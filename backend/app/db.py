"""Persistance basique des sessions de chat en SQLite (via aiosqlite).

Une session = une conversation multi-tour. Chaque message (user/assistant,
+ tool/tool_calls intermédiaires nécessaires à la continuité du tool-calling)
est stocké sous forme de JSON brut compatible avec le format `messages` de
l'API Chat Completions, ce qui permet de rejouer l'historique complet lors
d'un tour suivant.
"""

import json
import os
import uuid
from datetime import datetime, timezone

import aiosqlite

from .config import settings

_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT,
    raw TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
);
"""


async def init_db() -> None:
    os.makedirs(os.path.dirname(settings.db_path) or ".", exist_ok=True)
    async with aiosqlite.connect(settings.db_path) as db:
        await db.executescript(_SCHEMA)
        await db.commit()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def create_session(title: str = "") -> dict:
    session_id = str(uuid.uuid4())
    created_at = _now()
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            "INSERT INTO sessions (id, title, created_at) VALUES (?, ?, ?)",
            (session_id, title, created_at),
        )
        await db.commit()
    return {"id": session_id, "title": title, "created_at": created_at}


async def list_sessions() -> list[dict]:
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id, title, created_at FROM sessions ORDER BY created_at DESC")
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def get_session(session_id: str) -> dict | None:
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id, title, created_at FROM sessions WHERE id = ?", (session_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None


async def set_session_title(session_id: str, title: str) -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute("UPDATE sessions SET title = ? WHERE id = ?", (title, session_id))
        await db.commit()


async def delete_session(session_id: str) -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
        await db.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
        await db.commit()


async def append_message(session_id: str, message: dict) -> None:
    """Stocke un message brut (format Chat Completions : role/content/tool_calls/...)."""
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            "INSERT INTO messages (session_id, role, content, raw, created_at) VALUES (?, ?, ?, ?, ?)",
            (session_id, message.get("role", ""), message.get("content") or "", json.dumps(message), _now()),
        )
        await db.commit()


async def get_messages(session_id: str) -> list[dict]:
    """Retourne l'historique complet au format Chat Completions (pour rejouer vers le LLM)."""
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT raw FROM messages WHERE session_id = ? ORDER BY id ASC",
            (session_id,),
        )
        rows = await cursor.fetchall()
        return [json.loads(row["raw"]) for row in rows]


async def get_visible_messages(session_id: str) -> list[dict]:
    """Retourne uniquement les messages user/assistant avec du contenu textuel,
    destinés à être affichés dans l'interface (masque les messages "tool" et
    les tool_calls intermédiaires). Les messages "fiche" gardent leur charge
    structurée dans la clé `fiche`, en plus d'un résumé textuel dans `content`
    (utilisé pour le contexte renvoyé au modèle lors des tours suivants)."""
    all_messages = await get_messages(session_id)
    visible = []
    for m in all_messages:
        if m.get("role") in ("user", "assistant") and (m.get("content") or "").strip():
            entry = {"role": m["role"], "content": m["content"]}
            if m.get("fiche"):
                entry["fiche"] = m["fiche"]
            visible.append(entry)
    return visible
