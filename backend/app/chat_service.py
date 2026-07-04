"""Orchestration d'un tour de conversation : historique + MCP + LLM."""

from . import db
from .config import settings
from .llm_service import SYSTEM_PROMPT, run_agent_turn
from .mcp_client import list_openai_tools, mcp_session


def _make_title(content: str) -> str:
    content = " ".join(content.split())
    return content[:60] + ("…" if len(content) > 60 else "")


def _bound_history(history: list[dict]) -> list[dict]:
    """Ne garde que les derniers échanges tant que la taille cumulée dépasse le
    budget configuré, pour laisser de la marge à un nouveau tour de tool-calling
    sans dépasser la fenêtre de contexte du modèle."""
    total = sum(len(m.get("content") or "") for m in history)
    while total > settings.history_max_chars and len(history) > 2:
        removed = history.pop(0)
        total -= len(removed.get("content") or "")
    return history


async def handle_user_message_stream(session_id: str, content: str):
    """Version streaming : produit les événements réels de la boucle agentique
    (`tool_call`, `tool_result`, `final`) au fil de l'eau, et persiste
    l'historique une fois le tour terminé."""
    session = await db.get_session(session_id)
    if session is None:
        raise ValueError(f"Session inconnue: {session_id}")

    # On ne rejoue que l'historique "propre" (texte user/assistant visible) d'un
    # tour à l'autre : les résultats bruts d'outils MCP d'un tour précédent ne
    # sont pas renvoyés au modèle, sous peine de saturer rapidement le contexte.
    visible_history = await db.get_visible_messages(session_id)
    if not visible_history:
        await db.set_session_title(session_id, _make_title(content))

    user_message = {"role": "user", "content": content}
    await db.append_message(session_id, user_message)

    working_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    # On ne renvoie au LLM que role/content : la clé `fiche` (structurée, pour
    # l'affichage) n'est pas un champ valide du protocole Chat Completions.
    working_messages.extend(
        {"role": m["role"], "content": m["content"]} for m in _bound_history(visible_history)
    )
    working_messages.append(user_message)

    base_len = len(working_messages)
    async with mcp_session() as mcp:
        tools = await list_openai_tools(mcp)
        async for event in run_agent_turn(mcp, working_messages, tools):
            yield event

    # Persiste les messages ajoutés par la boucle agentique (tool_calls, résultats
    # d'outils, réponse finale) pour garder une trace complète en base, même si
    # seul l'historique visible sera rejoué au tour suivant.
    new_messages = working_messages[base_len:]
    for message in new_messages:
        await db.append_message(session_id, message)
