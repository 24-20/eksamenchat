import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match?.[1] || 'text';
      const code = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="relative my-4 rounded-lg bg-neutral-900 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-neutral-800 border-b border-neutral-700 text-sm text-neutral-300">
            <span>{lang}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-xs px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded"
            >
              Copy
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
