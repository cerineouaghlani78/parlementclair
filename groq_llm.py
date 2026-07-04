import os
import json
import asyncio
import logging
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

SERVER_URL="https://mcp.code4code.eu/mcp"
MODEL="llama-3.3-70b-versatile"
FALLBACK_MODEL="openai/gpt-oss-20b"
MAX_TOURS=5
MAX_RESULTS=3
MAX_CHARS=3000
MAX_COMPLETION_TOKENS=512
MAX_RETRIES=3
MAX_RATE_LIMIT_RETRIES=4

api_key=os.getenv("GROQ_API_KEY")
if not api_key:
    raise RuntimeError("GROQ_API_KEY manquante")
client=Groq(api_key=api_key, max_retries=MAX_RETRIES)

SYSTEM_PROMPT="""Tu es ParlementClair.
Tu expliques les données legislatives simplement.
Tu DOIS utiliser les outils lorsqu'une recherche legislatives est nécessaire.
Ne réponds jamais de mémoire si un outil permet d'obtenir les informations.
Si la question est hors sujet, indique poliment que tu es spécialisé dans les données legislatives.
"""

def parse_failed_tool_call(error_payload):
    if not isinstance(error_payload, dict):
        return None
    err = error_payload.get('error', {})
    if err.get('code') != 'tool_use_failed':
        return None
    failed = err.get('failed_generation', '')
    if not failed.startswith('<function=') or not failed.endswith('</function>'):
        return None
    body = failed[len('<function='):-len('</function>')]
    if '{' not in body:
        return None
    name, args_part = body.split('{', 1)
    name = name.strip()
    args_text = '{' + args_part
    try:
        args = json.loads(args_text)
        return name, args
    except Exception:
        return None

async def main():
    question=input("Question : ").strip()
    if not question:
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
