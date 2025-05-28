
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, PlusCircle, LibraryBig, ScanLine, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface InputBarProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MAX_TEXTAREA_HEIGHT = 180; 

export function InputBar({ onSendMessage, isLoading }: InputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    autoResizeTextarea(event.target);
  };
  
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'; 
    const scrollHeight = element.scrollHeight;
    if (scrollHeight > MAX_TEXTAREA_HEIGHT) {
      element.style.height = `${MAX_TEXTAREA_HEIGHT}px`;
      element.style.overflowY = 'auto';
    } else {
      element.style.height = `${scrollHeight}px`;
      element.style.overflowY = 'hidden';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, []);


  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; 
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-3 sm:p-4 bg-transparent w-full max-w-3xl mx-auto group",
      )}
    >
      <div className={cn(
        "bg-card text-card-foreground p-3 rounded-3xl border border-input shadow-xl flex flex-col gap-2",
        "transition-all duration-300 ease-in-out group-focus-within:shadow-2xl group-focus-within:border-primary/50"
      )}>
        <div className="flex items-end space-x-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask PyscoutAI..."
            className="flex-grow resize-none overflow-y-hidden p-2.5 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base max-h-[180px]"
            rows={1}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            size="icon" 
            className="h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground transition-transform hover:scale-105 active:scale-95 self-end flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost"
                  size="icon" 
                  className="h-10 w-10 p-0 rounded-full text-muted-foreground hover:text-foreground disabled:bg-muted disabled:text-muted-foreground self-end flex items-center justify-center shrink-0"
                  aria-label="Voice input (placeholder)"
                  disabled={isLoading}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2 pl-1">
          {[
            { icon: PlusCircle, label: "Attach file", tip: "Attach file (placeholder)" },
            { icon: LibraryBig, label: "Research", tip: "Deep research (placeholder)" },
            { icon: ScanLine, label: "Canvas", tip: "Open canvas (placeholder)" },
          ].map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md px-2 py-1 h-auto text-xs disabled:opacity-50 transition-colors duration-150"
                    disabled={isLoading}
                    aria-label={item.label}
                  >
                    <item.icon className="h-4 w-4 mr-1.5" />
                    {item.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.tip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </form>
  );
}
