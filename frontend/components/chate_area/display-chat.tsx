
// components/MathChatbot.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Message from './message'; // Import the Message component
import InputField from './chat-input'; // Import the InputField component

interface ChatMessage {
  content: string;
  isUser: boolean;
}

const MathChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ref for tracking the last rendered content length to optimize scroll
  const lastRenderedLengthRef = useRef<number>(0);

  // Simulates a streaming API response
  const simulateStreamingApi = useCallback(async (userMessage: string) => {
    setIsLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);

    // Add a placeholder for AI's response that will be filled incrementally
    setMessages((prev) => [...prev, { content: '', isUser: false }]);

    const dummyResponses = [
      'Ok, la oss løse den kvadratiske ligningen ',
      '`ax^2 + bx + c = 0`. ',
      'Vi kan bruke den generelle løsningsformelen:\n\n',
      '$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n\n', // A complete formula
      'Her er et eksempel: Løs ',
      '`2x^2 + 5x - 3 = 0`. \n\n',
      'Først identifiserer vi koeffisientene: $a=2$, $b=5$, og $c=-3$.\n',
      'Sett disse inn i formelen:\n\n',
      '$$ x = \\frac{-5 \\pm \\sqrt{5^2 - 4(2)(-3)}}{2(2)} $$\n\n',
      '$$ x = \\frac{-5 \\pm \\sqrt{25 + 24}}{4} $$\n\n',
      '$$ x = \\frac{-5 \\pm \\sqrt{49}}{4} $$\n\n',
      '$$ x = \\frac{-5 \\pm 7}{4} $$\n\n',
      'Dette gir to løsninger:\n\n',
      '$x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = 0.5$\n',
      '$x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = -3$\n\n',
      'Her er en feilaktig latex for test: $2x^2 + 5x - 3 = 0\\text{ugyldig}$', // Invalid LaTeX for error test
      'Løsningene er $x=0.5$ og $x=-3$. ',
      'Håper dette var forståelig!'
    ];

    let currentBuffer = '';
    const delay = 50; // Milliseconds per "token"

    for (let i = 0; i < dummyResponses.length; i++) {
      const segment = dummyResponses[i];
      for (const char of segment) {
        currentBuffer += char;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Update the last message in the array incrementally
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = currentBuffer;
          }
          return newMessages;
        });
      }
    }

    setIsLoading(false);
  }, []);

  // Effect to scroll to the bottom when messages are updated
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const lastMessageContent = messages[messages.length - 1].content;
      // Only scroll if the last message content has actually grown
      if (lastMessageContent.length > lastRenderedLengthRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        lastRenderedLengthRef.current = lastMessageContent.length;
      }
    }
  }, [messages]); // Dependency array: triggers when 'messages' state changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return; // Prevent sending empty or multiple messages

    simulateStreamingApi(input);
    setInput(''); // Clear input field
  };

  return (
    <div className="flex flex-col h-fit bg-accent relative p-4">
      <div
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 h-full"
      >
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

      {/* Basic CSS for the pulse animation and scrollbar */}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Styling for KaTeX errors */
        :global(.katex-error) {
            color: red !important;
            font-weight: bold;
            text-decoration: wavy red underline;
            background-color: #ffe0e0;
            padding: 2px 4px;
            border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default MathChatbot
