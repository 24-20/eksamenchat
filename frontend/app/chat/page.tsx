// app/chat/page.tsx

'use client';

import { useState } from 'react';
import { useModel } from '@/context/model-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const { model, setModel } = useModel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [...prev, '']);
    
    const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, model }),
    });


    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        for (const line of lines) {
          const text = line.replace('data: ', '');
          if (text) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] += text;
              return updated;
            });
          }
        }
      }
    }
     setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Model: {model}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setModel('model1')}>model1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setModel('model2')}>model2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

