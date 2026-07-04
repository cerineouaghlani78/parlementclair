import os
import json
import asyncio
import logging

import truststore
truststore.inject_into_ssl()

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Désactivation des logs d'infos trop bavards pour garder le terminal propre pour l'utilisateur
logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s - %(message)s")

config_str = """
{
  "mcpServers": {
    "tricoteuses": {
      "transport": "http",
      "url": "https://mcp.code4code.eu/mcp"
    }
  }
}
"""
config = json.loads(config_str)
server_url = config["mcpServers"]["tricoteuses"]["url"]

api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise RuntimeError("La variable d'environnement GROQ_API_KEY n'est pas définie.")
groq_client = Groq(api_key=api_key)


async def main():
    # 1. Demande de la question directement dans le terminal
    print("\n" + "="*60)
    user_question = input("[ParlementClair] Posez votre question au Parlement : ")
    print("="*60 + "\n")
    
    if not user_question.strip():
        print("Question vide. Fin du programme.")
        return

    try:
        # Connexion discrète au serveur MCP
        async with streamablehttp_client(url=server_url) as (read, write, get_session_id):
            async with ClientSession(read, write) as session:
                await session.initialize()

                # Récupération et formatage des outils
                LAW_TOOL_NAMES = {
                    "search_legal_texts",
                    "list_parlement_items",
                    "get_parlement_item",
                    "get_pastilled_article",
                }
                mcp_tools = await session.list_tools()
                groq_tools = [
                    {
                        "type": "function",
                        "function": {
                            "name": tool.name,
                            "description": tool.description,
                            "parameters": tool.inputSchema
                        }
                    }
                    for tool in mcp_tools.tools
                    if tool.name in LAW_TOOL_NAMES
                ]

                # System prompt de vulgarisation
                system_prompt = (
                    "Tu es ParlementClair, une IA spécialisée dans la vulgarisation des données "
                    "parlementaires de l'Assemblée Nationale et du Sénat pour les citoyens français.\n\n"
                    "Règles strictes :\n"
                    "1. Traduis systématiquement le jargon legislatif ou politique en termes simples.\n"
                    "2. Structure tes réponses avec des sections lisibles et des listes à puces.\n"
                    "3. Pour chaque texte législatif, explique de manière neutre : 'Ce que ça change concrètement'.\n"
                    "4. Reste strictement impartial et objectif. Pas de parti pris.\n"
                    "5. Si la requete de l'utilisateur est hors sujet (tout ce que ne concerne pas les donnees legislatives), reponds a l'utilisateur que tu ne traites pas ce genre de requete.\n"
                )

                # Utilisation de la question saisie par l'utilisateur
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_question}
                ]

                # Boucle agentique : on redonne les outils à chaque tour et on
                # boucle tant que le modèle demande un appel d'outil, jusqu'à sa
                # réponse finale en texte. Le garde-fou MAX_TOURS évite une
                # boucle infinie si le modèle n'arrête jamais de chercher.
                MAX_TOURS = 5
                # Tier gratuit Groq : 8000 tokens/minute. On borne le volume de
                # résultats d'outil renvoyé au modèle pour ne pas dépasser (un
                # search légal peut renvoyer >100k tokens).
                MAX_RESULTATS_OUTIL = 3
                MAX_CHARS_OUTIL = 8000

                def make_request():
                    return groq_client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=messages,
                        tools=groq_tools,
                        tool_choice="auto",
                        temperature=0.4,
                    )

                message = None
                for tour in range(MAX_TOURS):
                    if tour == 0:
                        print("🔍 Recherche des données parlementaires en cours...")
                    else:
                        print("✍️ Analyse et affinage des recherches...")

                    response = await asyncio.to_thread(make_request)
                    message = response.choices[0].message

                    # Pas d'appel d'outil : c'est la réponse finale.
                    if not getattr(message, "tool_calls", None):
                        break

                    # Le modèle demande un ou plusieurs outils : on les exécute
                    # tous, puis on renvoie les résultats au tour suivant.
                    messages.append(message)
                    for tool_call in message.tool_calls:
                        tool_args = json.loads(tool_call.function.arguments or "{}")
                        # On borne le nombre de résultats demandés à l'outil.
                        if isinstance(tool_args.get("limit"), int):
                            tool_args["limit"] = min(tool_args["limit"], MAX_RESULTATS_OUTIL)

                        tool_result = await session.call_tool(tool_call.function.name, tool_args)

                        # Si le backend Typesense rejette un champ `query_by` invalide,
                        # on réessaye sans ce champ. Cela corrige les appels auto-générés
                        # par Groq qui peuvent utiliser `title` par erreur.
                        if getattr(tool_result, "isError", False):
                            text_parts = [getattr(block, "text", "") for block in tool_result.content]
                            error_text = " ".join(text_parts)
                            if "Could not find a field named" in error_text and "query_by" in tool_args:
                                retry_args = {k: v for k, v in tool_args.items() if k != "query_by"}
                                print("⚠️ Requête d'outil corrigée : suppression de query_by invalide.")
                                tool_result = await session.call_tool(tool_call.function.name, retry_args)
                                tool_args = retry_args

                        # tool_result.content est une liste de blocs MCP (TextContent, ...),
                        # des modèles pydantic non sérialisables directement.
                        tool_content = [block.model_dump(mode="json") for block in tool_result.content]
                        tool_text = json.dumps(tool_content, ensure_ascii=False)
                        # Filet de sécurité : on tronque si le résultat reste trop
                        # gros pour la limite de tokens/minute.
                        if len(tool_text) > MAX_CHARS_OUTIL:
                            tool_text = tool_text[:MAX_CHARS_OUTIL] + " …[résultat tronqué pour respecter la limite de tokens]"
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": tool_text
                        })
                else:
                    # Boucle épuisée sans réponse finale.
                    print(f"\n⚠️ Le modèle n'a pas conclu après {MAX_TOURS} tours de recherche.")

                print("\n================ VERSION CITOYENNE (PARLEMENTCLAIR) ================")
                print(message.content if message else "(aucune réponse)")
                print("==================================================================\n")

    except Exception as e:
        print(f"\n❌ Une erreur est survenue : {e}")
        # Ajoute ces lignes pour forcer l'affichage du vrai coupable caché dans le TaskGroup
        import traceback
        print("\n--- Détails techniques de l'erreur ---")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
