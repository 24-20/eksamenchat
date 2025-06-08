'use client';

import React, { useState, useEffect, useRef } from 'react';
import Message from './message'; // Import the Message component
import InputField from './chat-input'; // Import the InputField component


import { useSearchParams } from 'next/navigation';



interface ChatMessage {
  content: string;
  isUser: boolean;
}

const MathChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRenderedLengthRef = useRef<number>(0);
  const searchParams = useSearchParams();
  const model = searchParams.get('model'); // get ?term=hello
  const kb = searchParams.get('kb'); // get ?term=hello


  // New streaming function fetching from backend
  const fetchStreamingResponse = async (userMessage: string) => {
    setIsLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);
    // Add empty assistant message to be filled
    setMessages((prev) => [...prev, { content: '', isUser: false }]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, model: model, kb: kb, messages: messages }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

          for (const line of lines) {
            const text = line.replace('data: ', '');

            if (text) {
              accumulated += text;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = accumulated;
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    }

    setIsLoading(false);
  };

  // Effect to scroll to the bottom when messages are updated
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const lastMessageContent = messages[messages.length - 1].content;
      if (lastMessageContent.length > lastRenderedLengthRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        lastRenderedLengthRef.current = lastMessageContent.length;
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    fetchStreamingResponse(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-fit bg-accent relative p-4">
      <div ref={scrollRef} className="flex-1 p-4 space-y-4 h-full">
        {messages.map((msg, index) => (
          <Message key={index} content={msg.content} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="p-4 rounded-lg bg-foreground/20 self-start animate-pulse">
            <span className="dot-animation"></span>
          </div>
        )}
      </div>
      <InputField
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* Animations and styles */}
      <style jsx>{`
        .dot-animation:after {
          content: ' .';
          animation: dots 1s steps(5, end) infinite;
        }
        @keyframes dots {
          0%, 20% {
            color: rgba(0, 0, 0, 0);
            text-shadow:
              .25em 0 0 rgba(0, 0, 0, 0),
              .5em 0 0 rgba(0, 0, 0, 0);
          }
          40% {
            color: black;
            text-shadow:
              .25em 0 0 rgba(0, 0, 0, 0),
              .5em 0 0 rgba(0, 0, 0, 0);
          }
          60% {
            text-shadow:
              .25em 0 0 black,
              .5em 0 0 rgba(0, 0, 0, 0);
          }
          80%, 100% {
            text-shadow:
              .25em 0 0 black,
              .5em 0 0 black;
          }
        }
      `}</style>
    </div>
  );
};

export default MathChatbot;
