"""Interactive chat with the Groq API, keeping the conversation history.

Key point: the Groq API is stateless. To keep context, we resend the full
list of messages (system + every previous exchange) on EACH call, then append
the assistant's reply before the next turn.

Example:
    You > Give me a strawberry tart recipe.
    ... (the recipe) ...
    You > Use less sugar.
    ... (the same recipe adjusted: Groq remembers) ...
"""

import os
import sys

from dotenv import load_dotenv
from groq import Groq

MODEL = "llama-3.3-70b-versatile"


def ask(client: Groq, messages: list) -> str:
    """Send the full history to Groq, print the response as a stream and
    return the assistant's complete reply text."""
    stream = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True,
    )

    full_text = ""
    for chunk in stream:
        piece = chunk.choices[0].delta.content
        if piece:
            print(piece, end="", flush=True)
            full_text += piece
    print()  # final newline
    return full_text


def main() -> int:
    load_dotenv()

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print(
            "Error: GROQ_API_KEY not found. Add it to the .env file.",
            file=sys.stderr,
        )
        return 1

    client = Groq(api_key=api_key)

    # History starts with the system message. It grows on every turn.
    messages = [
        {
            "role": "system",
            "content": "You are a pastry chef.",
        }
    ]

    print("Groq chat - type 'quit' or an empty line to exit.\n")

    while True:
        try:
            user_input = input("You > ").strip()
        except (EOFError, KeyboardInterrupt):
            print()  # clean line on Ctrl-D / Ctrl-C
            break

        if not user_input or user_input.lower() in {"quit", "exit"}:
            break

        # 1. Append the user's request to the history.
        messages.append({"role": "user", "content": user_input})

        try:
            print("Groq > ", end="", flush=True)
            reply = ask(client, messages)
        except Exception as error:  # noqa: BLE001 - readable message
            print(f"\nError while calling the Groq API: {error}", file=sys.stderr)
            # Drop the failed request so it does not pollute the history.
            messages.pop()
            continue

        # 2. Append the assistant's reply: this is what gives memory to the
        #    next turn.
        messages.append({"role": "assistant", "content": reply})
        print()

    print("Bye!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
