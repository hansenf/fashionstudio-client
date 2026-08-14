'use client';

import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/api/client';

export function AIChatSidebar({
  layers,
  onAction,
}: {
  layers: any[];
  onAction: (action: any) => void;
}) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const result = await apiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMsg,
          layers,
          history: messages,
        }),
      });
      if (result.actions) {
        result.actions.forEach((action: any) => onAction(action));
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error processing request.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-80 border-t border-gray-200 bg-white">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            <p>Ask me to change colors,</p>
            <p>duplicate layers, or generate new elements!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[85%] ${
              msg.role === 'user'
                ? 'bg-purple-100 ml-auto text-purple-900'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">AI is thinking...</div>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 p-2 border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe what to do..."
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}