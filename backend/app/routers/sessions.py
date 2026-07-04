import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from .. import db
from ..chat_service import handle_user_message_stream
from ..schemas import SendMessageIn, SessionDetailOut, SessionOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.post("", response_model=SessionOut)
async def create_session():
    session = await db.create_session()
    return session


@router.get("", response_model=list[SessionOut])
async def list_sessions():
    return await db.list_sessions()


@router.get("/{session_id}", response_model=SessionDetailOut)
async def get_session(session_id: str):
    session = await db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session introuvable")
    messages = await db.get_visible_messages(session_id)
    return {**session, "messages": messages}


@router.delete("/{session_id}", status_code=204)
async def delete_session(session_id: str):
    session = await db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session introuvable")
    await db.delete_session(session_id)


@router.post("/{session_id}/messages")
async def send_message(session_id: str, body: SendMessageIn):
    """Envoie un message et streame la progression réelle (appels d'outils MCP,
    résultats, puis réponse finale) au format Server-Sent Events."""
    content = body.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message vide")

    session = await db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session introuvable")

    async def event_stream():
        try:
            async for event in handle_user_message_stream(session_id, content):
                yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        except Exception as exc:  # noqa: BLE001
            logger.exception("Erreur pendant le streaming de la réponse")
            yield f"data: {json.dumps({'type': 'error', 'detail': str(exc)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
