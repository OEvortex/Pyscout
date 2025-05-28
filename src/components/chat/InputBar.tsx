"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputBarProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MAX_TEXTAREA_HEIGHT = 160; // Max height in pixels for the textarea

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
        textareaRef.current.focus(); 
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
        "p-2 sm:p-3 bg-background"
      )}
    >
      <div className="flex items-end space-x-2 bg-card text-card-foreground p-2 rounded-xl border border-input shadow-sm">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow resize-none overflow-y-hidden p-2.5 rounded-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm max-h-[160px]"
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
      </div>
    </form>
  );
}
