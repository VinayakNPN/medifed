import { useState, useEffect } from 'react';

export function useSSE(url: string) {
  const [lastEvent, setLastEvent] = useState<{type: string; data: any} | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url}`;
    
    const eventSource = new EventSource(fullUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('SSE Connected to', fullUrl);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLastEvent(parsed);
      } catch (err) {
        console.error("Failed to parse SSE event", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
      // EventSource automatically attempts to reconnect on error
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [url]);

  return { lastEvent, isConnected };
}
