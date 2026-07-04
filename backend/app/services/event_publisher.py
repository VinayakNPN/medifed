import asyncio
import json

class EventPublisher:
    def __init__(self):
        self.queues = []

    def subscribe(self):
        q = asyncio.Queue()
        self.queues.append(q)
        return q

    def unsubscribe(self, q):
        if q in self.queues:
            self.queues.remove(q)

    async def publish(self, event_type: str, data: dict):
        """
        Broadcasts an event to all connected SSE clients.
        event_type maps to the 15-stage workflow (e.g., 'Quantization Completed')
        """
        message = json.dumps({"type": event_type, "data": data})
        # Server-Sent Events format requires 'data: <json>\n\n'
        formatted_message = f"data: {message}\n\n"
        for q in self.queues:
            await q.put(formatted_message)

event_publisher = EventPublisher()
