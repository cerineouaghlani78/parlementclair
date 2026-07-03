import os
import json
import asyncio
import logging
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Configuration des logs pour suivre la connexion pas à pas
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# 1. Configuration du serveur MCP
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

# 2. Initialisation de la clé API Groq (lue depuis une variable d'environnement)
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise RuntimeError(
        "La variable d'environnement GROQ_API_KEY n'est pas définie. "
        "Fais `export GROQ_API_KEY=ta_cle` avant de lancer le script, "
        "ou utilise un fichier .env avec python-dotenv."
    )
groq_client = Groq(api_key=api_key)


async def main():
    try:
        logging.info("Connexion au serveur MCP Tricoteuses (%s)...", server_url)

        # streamablehttp_client est le bon client pour un transport "http"
        # (le serveur répondait 405 avec sse_client car il n'utilise pas SSE)
        async with streamablehttp_client(url=server_url) as (read, write, get_session_id):
            async with ClientSession(read, write) as session:
                await session.initialize()
                logging.info("Connexion MCP établie avec succès !")

                # Récupération de la liste des outils (Assemblée Nationale, Sénat, etc.)
                mcp_tools = await session.list_tools()
                logging.info("%d outils récupérés depuis le serveur MCP.", len(mcp_tools.tools))

                # Formatage des schémas d'outils pour qu'ils soient compris par Groq
                groq_tools = [
                    {
                        "type": "function",
                        "function": {
                            "name": tool.name,
                            "description": tool.description,
                            "parameters": tool.inputSchema
                        }
                    } for tool in mcp_tools.tools
                ]

                # Préparation de la requête pour ParlementClair
                messages = [{
                    "role": "user",
                    "content": "Quels sont les derniers amendements ou rapports déposés à l'Assemblée Nationale ?"
                }]

                # Exécution de la requête synchrone de Groq dans un thread séparé
                def make_request():
                    return groq_client.chat.completions.create(
                        model="openai/gpt-oss-120b",  # Modèle recommandé par Groq (2026) pour le tool use / function calling
                        messages=messages,
                        tools=groq_tools,
                        tool_choice="auto"
                    )

                logging.info("Envoi de la demande au modèle Groq...")
                response = await asyncio.to_thread(make_request)

                # Récupération du message retourné
                message = response.choices[0].message
                logging.info("Réponse reçue de Groq.")

                # Vérification si Groq a décidé d'appeler un outil MCP
                if getattr(message, 'tool_calls', None):
                    tool_call = message.tool_calls[0]
                    logging.info("Groq demande l'exécution d'un outil : %s", tool_call.function.name)

                    # Exécution effective de l'outil MCP demandé par Groq
                    tool_args = json.loads(tool_call.function.arguments or "{}")
                    tool_result = await session.call_tool(tool_call.function.name, tool_args)
                    logging.info("Résultat de l'outil : %s", tool_result)
                else:
                    logging.info("Réponse textuelle directe : %s", message.content)

    except Exception:
        logging.exception("Une erreur est survenue durant le traitement")


if __name__ == "__main__":
    asyncio.run(main())