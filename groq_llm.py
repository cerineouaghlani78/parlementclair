import os
import json
import asyncio
import logging
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
                mcp_tools = await session.list_tools()
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

                # System prompt de vulgarisation
                system_prompt = (
                    "Tu es ParlementClair, une IA spécialisée dans la vulgarisation des données "
                    "parlementaires de l'Assemblée Nationale et du Sénat pour les citoyens français.\n\n"
                    "Règles strictes :\n"
                    "1. Traduis systématiquement le jargon juridique ou politique en termes simples.\n"
                    "2. Structure tes réponses avec des sections lisibles et des listes à puces.\n"
                    "3. Pour chaque texte législatif, explique de manière neutre : 'Ce que ça change concrètement'.\n"
                    "4. Reste strictement impartial et objectif. Pas de parti pris."
                )

                # Utilisation de la question saisie par l'utilisateur
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_question}
                ]

                def make_initial_request():
                    return groq_client.chat.completions.create(
                        model="openai/gpt-oss-120b",
                        messages=messages,
                        tools=groq_tools,
                        tool_choice="auto",
                        temperature=0.4
                    )

                print("🔍 Recherche des données parlementaires en cours...")
                response = await asyncio.to_thread(make_initial_request)
                message = response.choices[0].message

                if getattr(message, 'tool_calls', None):
                    tool_call = message.tool_calls[0]
                    
                    # Appel de l'outil MCP avec les arguments générés par Groq
                    tool_args = json.loads(tool_call.function.arguments or "{}")
                    tool_result = await session.call_tool(tool_call.function.name, tool_args)

                    # Enrichissement de l'historique
                    messages.append(message)
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": tool_call.function.name,
                        "content": json.dumps(tool_result.content)
                    })

                    def make_final_request():
                        return groq_client.chat.completions.create(
                            model="openai/gpt-oss-120b",
                            messages=messages,
                            temperature=0.3
                        )

                    print("✍️ Analyse et simplification des textes législatifs...")
                    final_response = await asyncio.to_thread(make_final_request)
                    
                    print("\n================ VERSION CITOYENNE (PARLEMENTCLAIR) ================")
                    print(final_response.choices[0].message.content)
                    print("==================================================================\n")
                    
                else:
                    print("\n================ VERSION CITOYENNE (PARLEMENTCLAIR) ================")
                    print(message.content)
                    print("==================================================================\n")

    except Exception as e:
        print(f"\n❌ Une erreur est survenue : {e}")
        # Ajoute ces lignes pour forcer l'affichage du vrai coupable caché dans le TaskGroup
        import traceback
        print("\n--- Détails techniques de l'erreur ---")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())