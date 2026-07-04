from typing import Any

from pydantic import BaseModel


class SessionOut(BaseModel):
    id: str
    title: str
    created_at: str


class ChatMessageOut(BaseModel):
    role: str
    content: str
    fiche: dict[str, Any] | None = None


class SessionDetailOut(SessionOut):
    messages: list[ChatMessageOut]


class SendMessageIn(BaseModel):
    content: str


class HealthOut(BaseModel):
    status: str
    llm_reachable: bool
    mcp_reachable: bool
    mcp_tool_count: int
    detail: str = ""
