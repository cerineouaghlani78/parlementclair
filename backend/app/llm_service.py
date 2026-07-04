"""Client LLM (API compatible OpenAI) + boucle agentique de tool-calling.

Fonctionne avec n'importe quel fournisseur exposant une API Chat Completions
compatible OpenAI avec tool-calling : Groq (par défaut, cloud gratuit) ou un
serveur vLLM local (cf. PROJET.md, lancé avec --enable-auto-tool-choice et
--tool-call-parser qwen3_xml pour Qwen3.5) — seule la config (`LLM_BASE_URL`,
`LLM_MODEL`, `LLM_API_KEY`) change.

En plus des outils MCP (recherche Légifrance/Parlement), on expose un outil
local `render_fiche` : ce n'est pas un outil MCP, il n'est pas transmis au
serveur MCP. Quand le modèle l'appelle, on l'intercepte nous-mêmes et on
traite ses arguments comme la réponse finale structurée (fiche pédagogique
illustrée côté front-end), au lieu de la laisser en texte libre.
"""

import json
import logging
import re

import openai
from openai import AsyncOpenAI

from .config import settings
from .mcp_client import call_tool

logger = logging.getLogger(__name__)


def _coerce_str_list(value) -> list[str]:
    """Le parser de tool-calling qwen3_xml sérialise parfois un tableau de
    chaînes (surtout long, avec ponctuation) en une chaîne unique mal formée
    au lieu d'un vrai tableau JSON. On répare plutôt que de planter le rendu."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return [str(v).strip() for v in parsed if str(v).strip()]
        except json.JSONDecodeError:
            pass
        # Repli : extraire les segments entre guillemets comme éléments de liste.
        items = re.findall(r'"([^"]+)"', text)
        return items if items else [text]
    return []


def _normalize_fiche_payload(payload: dict) -> dict:
    for key in ("mesures", "changements", "non_disponible"):
        if key in payload:
            payload[key] = _coerce_str_list(payload[key])
    return payload

_client = AsyncOpenAI(
    base_url=settings.llm_base_url,
    api_key=settings.llm_api_key,
    timeout=settings.request_timeout_seconds,
)


class LLMProviderError(Exception):
    """Erreur renvoyée par le fournisseur LLM (Groq, vLLM...) après épuisement
    des tentatives — porte un message clair plutôt qu'une trace technique."""


async def _create_completion(**kwargs):
    """Appelle le LLM avec une résilience basique face aux erreurs ponctuelles
    des fournisseurs cloud : tool-call mal formé (400 tool_use_failed), quota
    dépassé après épuisement des retries internes du SDK, etc. On retente une
    fois avant d'abandonner proprement (au lieu de laisser planter tout le
    flux SSE avec une trace anyio illisible)."""
    if settings.disable_reasoning:
        kwargs.setdefault("extra_body", {})["chat_template_kwargs"] = {"enable_thinking": False}
    try:
        return await _client.chat.completions.create(**kwargs)
    except openai.APIError as exc:
        logger.warning("Erreur API LLM, nouvelle tentative : %s", exc)
        try:
            return await _client.chat.completions.create(**kwargs)
        except openai.APIError as exc2:
            logger.exception("Échec de l'appel LLM après une tentative de rattrapage")
            raise LLMProviderError(
                f"Le fournisseur LLM ({settings.llm_base_url}) a renvoyé une erreur : {exc2}"
            ) from exc2

RENDER_FICHE_TOOL = {
    "type": "function",
    "function": {
        "name": "render_fiche",
        "description": (
            "Affiche la réponse finale sous forme de fiche pédagogique illustrée, "
            "affichée comme une carte dans l'interface (pas du texte). Utilise CET "
            "OUTIL pour toute réponse qui analyse ou explique une loi précise déjà "
            "identifiée. Ne l'utilise QUE pour la réponse finale, une fois "
            "l'information réunie via les autres outils. Pour une réponse purement "
            "conversationnelle (salutation, demande de clarification, sélection à "
            "confirmer par l'utilisateur, question hors-sujet), ne l'appelle PAS : "
            "réponds en texte normal à la place."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "numero": {
                    "type": "string",
                    "description": "Numéro officiel du texte (ex: '2026-554').",
                },
                "titre": {
                    "type": "string",
                    "description": "Titre complet officiel de la loi.",
                },
                "titre_court": {
                    "type": "string",
                    "description": "Titre court et vulgarisé, compréhensible sans jargon (ex: \"Loi hydroélectricité\").",
                },
                "date_promulgation": {
                    "type": "string",
                    "description": "Date de promulgation/adoption (YYYY-MM-DD) si trouvée dans les données MCP.",
                },
                "date_publication": {
                    "type": "string",
                    "description": "Date de publication au Journal Officiel (YYYY-MM-DD) si trouvée.",
                },
                "resume": {
                    "type": "string",
                    "description": (
                        "Résumé en langage totalement vulgarisé, 2 à 4 phrases courtes, "
                        "zéro jargon juridique, comme expliqué à quelqu'un qui n'a jamais lu un texte de loi."
                    ),
                },
                "mesures": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": (
                        "1 à 6 mesures concrètes de la loi, en langage simple. Uniquement des mesures "
                        "explicitement lues dans le contenu d'un article ou d'un texte renvoyé par un "
                        "outil — jamais un chiffre, seuil ou quantité estimé ou complété de toi-même. "
                        "Si le contenu des articles n'a pas été trouvé, laisse ce tableau court ou vide "
                        "et explique le manque dans `non_disponible`."
                    ),
                },
                "changements": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": (
                        "1 à 6 changements concrets pour les citoyens/entreprises/collectivités, basés "
                        "uniquement sur du contenu réellement lu (mêmes règles que `mesures`)."
                    ),
                },
                "vote": {
                    "type": "object",
                    "description": (
                        "Résultat du vote UNIQUEMENT si trouvé dans les données MCP. `pour`/`contre`/"
                        "`abstention` doivent être de vrais chiffres trouvés dans les données — ne jamais "
                        "mettre 0 ou une estimation à la place d'une valeur inconnue. Si tu n'as ni "
                        "décompte ni date de vote réels, omets ENTIÈREMENT ce champ (ne l'inclus pas avec "
                        "des valeurs nulles) et mentionne l'absence de décompte dans `non_disponible`."
                    ),
                    "properties": {
                        "chambre": {"type": "string", "description": "Ex: 'Assemblée nationale', 'Sénat'."},
                        "date": {"type": "string", "description": "Date du vote (YYYY-MM-DD), trouvée explicitement dans les données."},
                        "pour": {"type": "integer"},
                        "contre": {"type": "integer"},
                        "abstention": {"type": "integer"},
                    },
                },
                "impacts": {
                    "type": "array",
                    "description": "Impacts par secteur, uniquement ceux étayés par les données consultées.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "secteur": {"type": "string"},
                            "niveau": {"type": "string", "enum": ["positif", "negatif", "mixte"]},
                            "detail": {"type": "string", "description": "1 phrase courte expliquant l'impact."},
                        },
                    },
                },
                "sources": {
                    "type": "array",
                    "description": "Sources précises consultées (obligatoire, au moins une).",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string", "description": "Ex: 'Légifrance — LOI n° 2026-554'."},
                            "url": {"type": "string"},
                        },
                    },
                },
                "non_disponible": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Informations demandées par l'utilisateur mais non trouvées dans les données MCP consultées.",
                },
            },
            "required": ["titre", "resume", "mesures", "sources"],
        },
    },
}

SYSTEM_PROMPT = """Tu es ParlementClair, un assistant qui explique des lois françaises de façon vulgarisée et pédagogique, en t'appuyant exclusivement sur les outils MCP connectés à la base législative (Légifrance, Assemblée nationale, Sénat).

## Rigueur
- Base-toi exclusivement sur les données renvoyées par les outils MCP. N'invente jamais un article, un numéro de loi, une date, un chiffre ou un résultat de vote.
- Si une information demandée est absente ou introuvable dans les résultats d'outils, liste-la explicitement comme non disponible plutôt que de l'interpréter, de la déduire ou de l'estimer.
- Utilise les outils de façon ciblée : commence par une requête simple, et si un appel échoue, corrige le paramètre en cause plutôt que de répéter le même type d'erreur.

## Méthode de recherche Légifrance (pour éviter de tourner en rond)
- Si tu ne connais pas le champ ou le schéma exact à utiliser, commence par `search_recipes` avec quelques mots-clés : ne devine pas les noms de champs Typesense ou SQL au hasard, et ne répète pas une requête qui a déjà échoué avec une variante à peine différente.
- Pour retrouver une loi, une ordonnance ou un décret dont tu connais le numéro (ex. « 2026-554 »), utilise exactement cette requête, qui fonctionne de façon vérifiée :
  ```sql
  SELECT id, nature,
         data->'META'->'META_SPEC'->'META_TEXTE_VERSION'->>'TITREFULL' AS titre,
         data->'META'->'META_SPEC'->'META_TEXTE_CHRONICLE'->>'DATE_PUBLI' AS date_publi
  FROM legifrance.texte_version
  WHERE nature = 'LOI'  -- 'nature' est une colonne SQL de premier niveau, PAS un champ dans data->META->...
    AND data->'META'->'META_SPEC'->'META_TEXTE_CHRONICLE'->>'NUM' = '2026-554'
  ```
  Ne cherche jamais un numéro de loi dans `legifrance.article` : le champ `num` de cette table est un numéro d'article de code (ex. « L. 554-3 »), sans rapport avec le numéro de la loi.
- Pour une recherche plein texte approximative (thème, titre partiel, sigle), utilise `search_legal_texts` avec `query_by: "autocompletion,text_id"`. Le résultat contient un champ `id` Typesense interne (souvent suffixé `-Legifrance_texte-N`) qui n'est PAS l'identifiant réel : utilise le champ `text_id` (ou `uid`) du document pour toute requête SQL de suivi sur `legifrance.texte_version`.
- Pour le contenu détaillé des articles d'une loi, si une jointure directe sur `legifrance.article` ne renvoie rien du premier coup, n'en conclus pas que le contenu est indisponible : reformule via `search_recipes` (ex. « retrouver les articles d'un texte legifrance par cid ») avant d'abandonner.

## Interactivité
- Si la demande est floue, ambiguë, ou peut correspondre à plusieurs textes (ex. : titre incomplet, sigle ambigu, plusieurs lois possibles), ne lance pas d'analyse complète immédiatement.
- Recherche d'abord les candidats plausibles, puis réponds en texte simple avec une sélection ciblée (liste courte : numéro, titre, date) et demande à l'utilisateur de confirmer son choix avant d'analyser en détail.
- Si la demande porte sur un thème ou une catégorie plutôt que sur un texte précis (ex. : « quelles sont les dernières lois sur l'écologie ? », « lois récentes sur le logement »), ne cherche PAS à identifier toi-même LA loi la plus pertinente via des `query_sql` de plus en plus complexes (tri par date + mot-clé) : c'est un piège qui consomme tout ton budget d'itérations sans jamais converger. Fais une ou deux recherches ciblées au maximum (`search_legal_texts` sur le thème, éventuellement un `query_sql` simple filtrant `nature = 'LOI'` trié par date), puis réponds en texte normal avec une courte liste des candidats trouvés (numéro, titre, date si connue) et demande à l'utilisateur laquelle approfondir. N'appelle `render_fiche` qu'une fois la loi choisie par l'utilisateur.

## Réponse finale : fiche pédagogique
- Dès que tu as identifié une loi précise et réuni assez d'informations pour en parler, réponds en appelant l'outil `render_fiche` : c'est la réponse finale, affichée comme une fiche illustrée dans l'interface. N'écris pas une longue réponse en texte libre pour analyser une loi : utilise systématiquement `render_fiche`.
- Vulgarise complètement : zéro jargon juridique, phrases courtes, comme si tu expliquais à quelqu'un qui n'a jamais lu un texte de loi.
- INTERDICTION ABSOLUE D'INVENTER : `mesures` et `changements` doivent décrire uniquement ce que tu as **lu textuellement** dans le contenu d'un article ou d'un texte renvoyé par un outil. N'estime, n'arrondis et ne complète JAMAIS un chiffre, un seuil, une date ou une quantité qui n'apparaît pas mot pour mot dans les données consultées — même une valeur « plausible ».
- Si tu n'as obtenu que des métadonnées (titre, dates, historique parlementaire) sans avoir pu lire le contenu réel des articles, ta fiche doit rester à ce niveau : mets dans `mesures`/`changements` uniquement ce que le titre et les métadonnées permettent honnêtement de dire, et liste « détail des mesures et articles » dans `non_disponible`. Une fiche courte et honnête vaut mieux qu'une fiche détaillée mais inventée.
- N'inclus le champ `vote` que si tu as trouvé un vrai décompte (pour/contre/abstention) OU au minimum une date de vote explicitement écrite dans les données récupérées (ex. dans les travaux préparatoires). Ne mets jamais `null` dans pour/contre/abstention : soit tu as les vrais chiffres, soit tu omets entièrement le champ `vote` et tu mentionnes l'absence de décompte dans `non_disponible`.
- Idem pour `impacts` : n'en donne que si un effet est explicitement décrit dans les données consultées, sinon omets le champ.
- Pour une réponse purement conversationnelle (salutation, clarification, sélection à confirmer, question hors-sujet), réponds en texte normal, avec des paragraphes courts et des listes à puces si utile — n'appelle pas `render_fiche` dans ce cas.

Réponds en français."""


async def run_agent_turn(session, messages: list[dict], tools: list[dict]):
    """Exécute un tour complet : appelle le LLM, exécute les tool-calls demandés
    via la session MCP fournie (ou intercepte `render_fiche` localement),
    boucle jusqu'à obtenir une réponse finale.

    Générateur asynchrone : produit des événements réels au fil de l'eau
    (`tool_call`, `tool_result`, `fiche`, `final`) pour permettre un affichage
    de progression côté client. `messages` est mutée en place (historique
    complet, y compris les messages "tool" intermédiaires) pour être
    persistée par l'appelant une fois le générateur épuisé.
    """
    all_tools = [*tools, RENDER_FICHE_TOOL]

    for _ in range(settings.max_tool_iterations):
        try:
            response = await _create_completion(
                model=settings.llm_model,
                messages=messages,
                tools=all_tools,
                tool_choice="auto",
            )
        except LLMProviderError as exc:
            yield {
                "type": "final",
                "content": f"⚠️ {exc} Réessayez votre question, ou reformulez-la si le problème persiste.",
            }
            return
        choice = response.choices[0]
        message = choice.message

        tool_calls = message.tool_calls or []
        content = message.content or ""

        # Deux symptômes connus d'une génération ratée, tous deux invisibles
        # côté modèle (ni exception, ni erreur HTTP) mais inutilisables :
        #  - le parser de tool-calling échoue à extraire l'appel structuré et
        #    laisse la syntaxe brute dans le texte (`<tool_call>...`, `<function=...`) ;
        #  - la réponse est vide (le budget de génération part entièrement dans
        #    le raisonnement, sans qu'il ne reste de contenu final — cf. mode
        #    réflexion de Qwen3.5).
        # Dans les deux cas, on ne montre jamais ça à l'utilisateur : on retente
        # un tour frais (sans persister cette tentative ratée dans l'historique).
        malformed = "<tool_call>" in content or "<function=" in content
        if not tool_calls and (malformed or not content.strip()):
            logger.warning(
                "Réponse finale invalide (%s), nouvelle tentative",
                "syntaxe non parsée" if malformed else "contenu vide",
            )
            continue

        messages.append(
            {
                "role": "assistant",
                "content": content,
                **({"tool_calls": [tc.model_dump() for tc in tool_calls]} if tool_calls else {}),
            }
        )

        if not tool_calls:
            yield {"type": "final", "content": content}
            return

        for tc in tool_calls:
            if tc.function.name == "render_fiche":
                yield {"type": "tool_call", "name": "render_fiche", "arguments": {}}
                try:
                    payload = json.loads(tc.function.arguments or "{}")
                except json.JSONDecodeError:
                    payload = None

                if payload is not None:
                    payload = _normalize_fiche_payload(payload)
                    # Un résumé textuel (jamais vide) est conservé pour que le modèle
                    # garde le contexte de la fiche lors d'un tour suivant (relance,
                    # question de suivi) : seule la structure `fiche` sert à l'affichage.
                    titre_bit = payload.get("titre_court") or payload.get("titre") or "loi analysée"
                    numero_bit = f" (n° {payload['numero']})" if payload.get("numero") else ""
                    resume_bit = payload.get("resume") or ""
                    content = f"[Fiche générée : {titre_bit}{numero_bit}] {resume_bit}".strip()
                    messages.append({"role": "assistant", "content": content, "fiche": payload})
                    yield {"type": "fiche", "data": payload}
                    return

                yield {"type": "tool_result", "name": "render_fiche", "ok": False}
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": "Erreur : JSON invalide pour render_fiche, réessaie avec un JSON strictement valide.",
                    }
                )
                continue

            try:
                arguments = json.loads(tc.function.arguments or "{}")
            except json.JSONDecodeError:
                arguments = {}

            yield {"type": "tool_call", "name": tc.function.name, "arguments": arguments}

            try:
                result_text = await call_tool(session, tc.function.name, arguments)
                yield {"type": "tool_result", "name": tc.function.name, "ok": True}
            except Exception as exc:  # noqa: BLE001 - on veut renvoyer l'erreur au modèle
                logger.exception("Échec de l'appel d'outil MCP %s", tc.function.name)
                result_text = f"[Erreur outil MCP] {exc}"
                yield {"type": "tool_result", "name": tc.function.name, "ok": False}

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result_text,
                }
            )

    # Nombre maximal d'itérations atteint : on force une réponse finale sans outils.
    try:
        response = await _create_completion(model=settings.llm_model, messages=messages)
        content = response.choices[0].message.content or ""
    except LLMProviderError as exc:
        content = ""
        logger.warning("Échec de la complétion finale forcée : %s", exc)
    if "<tool_call>" in content or "<function=" in content:
        # Même symptôme de parsing raté que dans la boucle principale : on ne
        # montre jamais cette syntaxe brute, on retombe sur le message générique.
        content = ""
    if not content.strip():
        content = (
            "⚠️ Information non disponible : je n'ai pas réussi à obtenir une réponse "
            "complète dans le nombre d'étapes de recherche disponibles. Essayez de "
            "reformuler ou de préciser votre question (numéro de loi exact, article "
            "précis...)."
        )
    messages.append({"role": "assistant", "content": content})
    yield {"type": "final", "content": content}
