// app/chat/page.tsx

'use client';



import { useState, useEffect } from 'react';
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
  const [error, setError] = useState<false | string>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [...prev, '']);

    try {

      const response = await fetch('http://localhost:8001/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, model }),
      });




      if (!response.body) {
        console.log('error fetching data')
        return
      }

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
                updated[updated.length - 2] += text;
                return updated;
              });
            }
          }
        }
      }
      setInput('');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.log('errrrrrorrrr', error);
    }

  };




  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div className="max-w-1xl mx-auto p-8">
      <div className="mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Model: {model}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setModel('model2')}>model1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setModel('model3')}>model2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-1 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex0 p-2 border rounded"
        />
        <button type="submit" className="p-1 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
      {
        error ?
          <div>
            {JSON.stringify(error)}
          </div>
          :
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="p-3 bg-gray-100 rounded-lg shadow">
                {msg}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

