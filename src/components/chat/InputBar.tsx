"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react'; // Removed CornerDownLeft as it's not used
import { cn } from '@/lib/utils';

interface InputBarProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MAX_TEXTAREA_HEIGHT = 200; // Max height in pixels for the textarea

export function InputBar({ onSendMessage, isLoading }: InputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    autoResizeTextarea(event.target);
  };
  
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    // Temporarily shrink to allow it to re-calculate scrollHeight correctly
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
        textareaRef.current.style.height = 'auto'; // Reset height after send
        textareaRef.current.style.overflowY = 'hidden';
        textareaRef.current.focus(); // Re-focus after sending
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
        "flex items-end space-x-2 p-3 border-t bg-background transition-all duration-150",
        "ring-1 ring-inset ring-transparent focus-within:ring-primary rounded-t-lg" // Added subtle ring and rounded top
      )}
    >
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow resize-none overflow-y-hidden p-3 rounded-lg shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-card text-card-foreground max-h-[200px] border-0" // Removed default border and focus ring
        rows={1}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()} 
        size="icon" 
        className="h-11 w-11 p-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground transition-transform hover:scale-105 active:scale-95 self-end" // Ensured button aligns well
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
