
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
      const viewport = viewportRef.current;
      // Defer scroll to the end of the event loop to allow DOM updates and reflow
      setTimeout(() => {
        if (viewport) { // Check if viewport still exists in case component unmounted
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 0);
    }
  }, [messages, isLoading]); // Rerun when messages or loading state changes

  // Hide chat window content if no messages and not loading to allow welcome message to be prominent
  if (messages.length === 0 && !isLoading) {
    return <div className="flex-grow" />; // Takes up space but shows nothing
  }

  return (
    <ScrollArea className="flex-grow min-h-0 w-full max-w-3xl mx-auto" viewportRef={viewportRef} ref={scrollAreaRef}>
      <div className="p-4 sm:p-6 space-y-4"> {/* Increased spacing */}
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
