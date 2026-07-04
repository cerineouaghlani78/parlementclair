import httpx
from fastapi import APIRouter

from ..config import settings
from ..mcp_client import list_openai_tools, mcp_session
from ..schemas import HealthOut

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthOut)
async def health():
    llm_reachable = False
    mcp_reachable = False
    mcp_tool_count = 0
    detail_parts = []

    try:
        headers = {"Authorization": f"Bearer {settings.llm_api_key}"} if settings.llm_api_key else {}
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(settings.llm_base_url.rstrip("/") + "/models", headers=headers)
            llm_reachable = resp.status_code == 200
            if not llm_reachable:
                detail_parts.append(f"LLM HTTP {resp.status_code}")
    except Exception as exc:  # noqa: BLE001
        detail_parts.append(f"LLM injoignable: {exc}")

    try:
        async with mcp_session() as session:
            tools = await list_openai_tools(session)
            mcp_reachable = True
            mcp_tool_count = len(tools)
    except Exception as exc:  # noqa: BLE001
        detail_parts.append(f"MCP injoignable: {exc}")

    status = "ok" if llm_reachable and mcp_reachable else "degraded"
    return HealthOut(
        status=status,
        llm_reachable=llm_reachable,
        mcp_reachable=mcp_reachable,
        mcp_tool_count=mcp_tool_count,
        detail="; ".join(detail_parts),
    )
