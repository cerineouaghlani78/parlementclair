"""Simple Groq API example: request a strawberry tart recipe.

Prints the response as a stream (token by token).
"""

import os
import sys

from dotenv import load_dotenv
from groq import Groq

MODEL = "llama-3.3-70b-versatile"


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

    try:
        stream = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a pastry chef.",
                },
                {
                    "role": "user",
                    "content": "Give me a strawberry tart recipe.",
                },
            ],
            stream=True,
        )

        for chunk in stream:
            piece = chunk.choices[0].delta.content
            if piece:
                print(piece, end="", flush=True)
        print()  # final newline

    except Exception as error:  # noqa: BLE001 - keep a readable message
        print(f"\nError while calling the Groq API: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
