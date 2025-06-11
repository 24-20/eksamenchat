'use client'

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, Copy } from 'lucide-react';

interface MessageProps {
  content: string;
  isUser: boolean;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ content, isUser }) => {
  const [copyclipboard, setcopyclipboard] = useState<boolean>(false)
  const components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match?.[1] || 'text';
      const code = String(children).replace(/\n$/, '');
      return !inline ? (
        <div className="relative mb-4 rounded-lg bg-neutral-900 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-secondary border-b border-neutral-700 text-sm text-foreground">
            <span className=' text-xs text-foreground/80'>{lang}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code)
                setcopyclipboard(true)

              }}
              className="text-xs text-foreground/80 px-2 py-1 hover:bg-foreground/20 rounded flex items-center justify-center gap-1 "
            >
              {
                copyclipboard ?
                  <CheckIcon className='text-xs w-3.5 h-3.5' />
                  :

                  <Copy className='text-xs w-3.5 h-3.5' />
              }
              {
                copyclipboard ?
                  <>Kopiert</>
                  :
                  <>Kopier</>
              }
            </button>
          </div>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            customStyle={{ margin: 0, background: 'transparent' }}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-neutral-800 text-neutral-200 px-1 py-0.5 rounded">
          {children}
        </code>
      );
    },
  };


  useEffect(() => {
    if (copyclipboard) {
      setTimeout(() => {
        setcopyclipboard(false)
      }, 2000)
    }
  }, [copyclipboard])
  return (
    <div
      className={`flex pb-12 h-full w-full ${isUser ? 'items-end justify-end' : 'items-start'
        }`}
    >
      <div
        className={`p-4 rounded-lg ${isUser
          ? 'bg-foreground/5 self-end max-w-[350px] w-fit'
          : 'self-start max-w-2xl w-full'
          }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
