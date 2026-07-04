import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.services.event_publisher import event_publisher

router = APIRouter()

@router.get("/events")
async def sse_stream(request: Request):
    """
    Server-Sent Events endpoint for real-time frontend updates.
    """
    q = event_publisher.subscribe()

    async def event_generator():
        try:
            while True:
                # Disconnect if client leaves
                if await request.is_disconnected():
                    break
                
                # Wait for the next event in the queue
                message = await q.get()
                yield message
        except asyncio.CancelledError:
            pass
        finally:
            event_publisher.unsubscribe(q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
