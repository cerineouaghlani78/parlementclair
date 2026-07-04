"""Client MCP (Model Context Protocol) vers le serveur Tricoteuses.

Le serveur expose des outils sur la base législative française (Légifrance,
Assemblée nationale) via le transport HTTP "streamable". Ce module fournit :
  - un context manager pour ouvrir une session MCP le temps d'un tour de
    conversation (potentiellement plusieurs appels d'outils),
  - la conversion du schema d'outils MCP vers le format "tools" attendu par
    l'API Chat Completions compatible OpenAI (Groq, vLLM, ...).
"""

from contextlib import asynccontextmanager
from typing import Any

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from mcp.types import CallToolResult, Tool

from .config import settings


@asynccontextmanager
async def mcp_session():
    """Ouvre une session MCP initialisée vers le serveur Tricoteuses."""
    async with streamablehttp_client(settings.mcp_url) as (read, write, _get_session_id):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session


def mcp_tool_to_openai(tool: Tool) -> dict:
    """Convertit un outil MCP en schema de "function tool" OpenAI."""
    return {
        "type": "function",
        "function": {
            "name": tool.name,
            "description": tool.description or "",
            "parameters": tool.inputSchema or {"type": "object", "properties": {}},
        },
    }


async def list_openai_tools(session: ClientSession) -> list[dict]:
    """Liste les outils du serveur MCP au format OpenAI tools, en paginant."""
    tools: list[dict] = []
    cursor = None
    while True:
        result = await session.list_tools(cursor=cursor)
        tools.extend(mcp_tool_to_openai(t) for t in result.tools)
        cursor = result.nextCursor
        if not cursor:
            break
    return tools


def extract_tool_result_text(result: CallToolResult) -> str:
    """Aplatit le contenu d'un CallToolResult en texte pour le renvoyer au LLM.

    Les résultats de recherche Légifrance peuvent être volumineux (texte intégral
    de lois). On tronque pour rester sous la fenêtre de contexte et les limites
    de débit du fournisseur LLM configuré (Groq par défaut, ou vLLM local).
    """
    parts: list[str] = []
    for block in result.content:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
        else:
            parts.append(str(block))
    text = "\n".join(parts) if parts else ""

    limit = settings.tool_result_max_chars
    if len(text) > limit:
        text = text[:limit] + f"\n[…résultat tronqué à {limit} caractères, affinez la recherche si besoin…]"

    if result.isError:
        return f"[Erreur outil MCP] {text}"
    return text


async def call_tool(session: ClientSession, name: str, arguments: dict[str, Any]) -> str:
    result = await session.call_tool(name, arguments)
    return extract_tool_result_text(result)
