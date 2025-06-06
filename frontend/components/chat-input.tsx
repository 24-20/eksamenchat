
'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() !== '') {
      console.log(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full border-t bg-background p-4">
      <div className="relative flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          className={cn(
            'w-full resize-none rounded-lg border border-input bg-background p-3 pr-16 text-sm shadow-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'min-h-[40px] max-h-[200px] overflow-y-auto'
          )}
          style={{ lineHeight: '1.5' }}
        />
        <Button
          type="button"
          onClick={handleSend}
          size="sm"
          className="absolute bottom-3 right-3"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
