
"use client";

import React, { useState, useEffect } from 'react'; 
import type { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Partial<Message> & { id: string };
  isShimmer?: boolean;
}

export const MessageBubble = React.memo(function MessageBubble({ message, isShimmer = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (isShimmer) {
    return (
      <div className={cn('flex items-start space-x-3 py-3 animate-pulse', !isUser ? 'justify-start' : 'justify-end pl-10 pr-2 sm:pl-12')}>
        {!isUser && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-muted">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn('max-w-[75%] sm:max-w-[70%]')}>
          <div className="bg-muted rounded-xl p-3 space-y-2">
            <div className="h-4 bg-muted-foreground/30 rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground/30 rounded w-1/2"></div>
          </div>
        </div>
         {isUser && (
          <Avatar className="h-8 w-8 self-start shrink-0">
             <AvatarFallback className="bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
  
  if (!message.content && message.role === 'assistant' && !isShimmer) return null; 
  if (!message.content && message.role !== 'assistant') return null;


  return (
    <div
      className={cn(
        'flex items-end space-x-3 py-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out', 
        isUser ? 'justify-end pl-10 pr-2 sm:pl-12' : 'justify-start pr-10 pl-2 sm:pr-12' 
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 self-start shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] sm:max-w-[70%] rounded-xl p-3 text-sm shadow-md', 
          isUser 
            ? 'bg-gradient-to-br from-primary to-blue-400 dark:to-purple-600 text-primary-foreground' 
            : 'bg-card text-card-foreground border border-border/50' 
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {hasMounted && message.timestamp && (
           <p className={cn(
             "text-xs mt-1.5",
             isUser ? "text-primary-foreground/80 text-right" : "text-muted-foreground text-left"
            )}>
             {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </p>
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 self-start shrink-0">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});
