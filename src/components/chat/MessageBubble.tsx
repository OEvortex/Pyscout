
"use client";

import React, { useState, useEffect } from 'react'; 
import type { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
            <AvatarFallback className="bg-primary text-primary-foreground"> {/* Use primary for bot avatar bg */}
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn('max-w-[75%] sm:max-w-[70%]')}>
          <div className="bg-muted rounded-xl p-3.5 space-y-2.5"> {/* Slightly more padding and spacing */}
            <div className="h-4 bg-muted-foreground/30 rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground/30 rounded w-1/2"></div>
          </div>
        </div>
         {isUser && (
          <Avatar className="h-8 w-8 self-start shrink-0">
             <AvatarFallback className="bg-accent text-accent-foreground"> {/* User accent color for avatar */}
                <User className="h-4 w-4" />
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
          <AvatarFallback className="bg-primary text-primary-foreground"> {/* Use primary for bot avatar bg */}
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] sm:max-w-[70%] rounded-xl p-3.5 text-sm shadow-md', // Increased padding
          isUser 
            ? 'bg-gradient-to-br from-primary to-blue-400 dark:to-purple-600 text-primary-foreground' // User gradient
            : 'bg-card text-card-foreground' // Bot uses card background
        )}
      >
        <div className="break-words prose prose-sm dark:prose-invert max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-ul:my-2 prose-ul:ml-1 prose-ul:list-inside prose-ol:my-2 prose-ol:ml-1 prose-ol:list-inside prose-code:bg-muted/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-xs prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-md prose-pre:text-xs prose-pre:overflow-x-auto">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 ml-4 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 ml-4 space-y-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
              code: ({node, inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <pre className="bg-muted p-2 rounded-md my-2 overflow-x-auto text-xs">
                    <code className={className} {...props}>
                      {String(children).replace(/\n$/, '')}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-muted/80 px-1 py-0.5 rounded-sm text-xs" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
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
          <AvatarFallback className="bg-accent text-accent-foreground"> {/* User accent color for avatar */}
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

