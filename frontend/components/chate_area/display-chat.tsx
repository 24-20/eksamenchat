'use client';

import React, { useState, useEffect, useRef } from 'react';
import Message from './message'; // Import the Message component
import InputField from './chat-input'; // Import the InputField component
import { fetchMessagesByChatId } from '@/app/actions/fetchmessages'; // Import the server action

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


interface ChatMessage {
  content: string;
  isUser: boolean;
}

interface MathChatBotProps {
  chatId: string | undefined;
  submit: string | null;
  prop_input: string | null;
}

const MathChatbot: React.FC<MathChatBotProps> = ({ chatId, submit, prop_input }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Initialize input with prop_input if available, otherwise empty string
  const [input, setInput] = useState<string>(prop_input ? prop_input : '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRenderedLengthRef = useRef<number>(0);
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const kb = searchParams.get('kb');
  const router = useRouter();

  // A ref to ensure the initial submission triggered by prop_input/submit URL params only runs once.
  const hasProcessedInitialSubmit = useRef(false);

  // Effect to fetch existing messages when chatId is available
  useEffect(() => {
    const loadMessages = async () => {
      if (chatId) {
        setIsLoadingMessages(true);
        try {
          const result = await fetchMessagesByChatId(chatId);
          if (result.success && result.data) {
            // Transform database messages to ChatMessage format
            const transformedMessages: ChatMessage[] = result.data.map((msg: any) => ({
              content: msg.content,
              isUser: msg.role === 'user'
            }));
            setMessages(transformedMessages);
          } else {
            console.error('Failed to fetch messages:', result.error);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    };
    if (!submit) {
      loadMessages();
    }
  }, [chatId]);

  // New streaming function fetching from backend
  const fetchStreamingResponse = async (userMessage: string, newChat?: true | undefined) => {
    setIsLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);
    // Add empty assistant message to be filled
    setMessages((prev) => [...prev, { content: '', isUser: false }]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass a copy of messages to avoid issues with state closure in streaming loop
        body: JSON.stringify({ prompt: userMessage, model, kb, messages, chatId, newChat }),

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
                // Update the last message in the array (which is the assistant's message)
                newMessages[newMessages.length - 1].content = accumulated;
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      // Potentially add an error message to chat or handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to scroll to the bottom when messages are updated
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      // Only scroll if the last message content has changed (i.e., new text is being streamed)
      const lastMessageContent = messages[messages.length - 1].content;
      if (lastMessageContent.length > lastRenderedLengthRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        lastRenderedLengthRef.current = lastMessageContent.length;
      }
    }
  }, [messages]);

  // Effect to handle initial submission from URL parameters
  useEffect(() => {
    // Only proceed if 'submit' is truthy and we haven't processed it before
    // Also ensure messages have been loaded first (or no chatId exists)
    if (submit && !hasProcessedInitialSubmit.current && !isLoadingMessages) {
      // Ensure prop_input exists as it's needed for the message
      if (prop_input) {
        fetchStreamingResponse(prop_input, true);
        setInput(''); // Clear the input field after sending the message
      }
      // Mark that the initial submission has been processed
      hasProcessedInitialSubmit.current = true;
    }
    // Dependencies: runs when 'submit' or 'prop_input' props change, or when messages finish loading
  }, [submit, prop_input, isLoadingMessages]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    // If no chatId, redirect to new chat page to create one
    if (!chatId) {
      router.push(`/c/new/?model=${model || ''}&kb=${kb || ''}&prop_input=${input}&submit=true`);
      return;
    }

    // Otherwise, fetch streaming response for the current chat
    fetchStreamingResponse(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-fit bg-accent relative p-4">
      <div ref={scrollRef} className="flex-1 p-4 space-y-4 h-full overflow-y-auto"> {/* Added overflow-y-auto */}
        {isLoadingMessages ? (
          <div className="p-4 rounded-lg bg-foreground/20 self-center">
            <span className="dot-animation">Loading messages</span>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} content={msg.content} isUser={msg.isUser} />
          ))
        )}
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
