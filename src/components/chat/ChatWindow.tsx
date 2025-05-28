"use client";

import React, { useEffect, useRef } from 'react';
import type { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-grow" viewportRef={viewportRef} ref={scrollAreaRef}>
      <div className="p-4 space-y-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <MessageBubble 
            message={{ id: 'shimmer-loading', role: 'assistant', content: '', timestamp: new Date() }} 
            isShimmer 
          />
        )}
      </div>
    </ScrollArea>
  );
}
