// components/Message.tsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css'; // KaTeX CSS must be imported

interface MessageProps {
  content: string;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ content, isUser }) => {
  // A simple way to handle KaTeX errors is to catch the error during rendering
  // and display raw LaTeX or an error message instead.
  // Rehype-katex largely handles this by setting a class on the element.
  // You can style .katex-error in your CSS.

  return (
    <div className={`flex h-full w-full ${isUser ? 'items-end justify-end' : 'items-start'}`}>
      <div
        className={`p-4 rounded-lg ${isUser ? ' bg-foreground/5 self-end max-w-[350px] w-fit' : ' self-start'
          }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[
            rehypeRaw,
            rehypeKatex,
          ]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
