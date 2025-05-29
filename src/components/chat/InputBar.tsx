
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Brain, GalleryVerticalEnd, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";


interface InputBarProps {
  onSendMessage: (content: string, isSuggestionClick?: boolean) => void;
  isLoading: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const MAX_TEXTAREA_HEIGHT = 180; 

export function InputBar({ onSendMessage, isLoading, textareaRef: externalTextareaRef }: InputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    autoResizeTextarea(event.target);
  };
  
  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
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
        autoResizeTextarea(textareaRef.current); 
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const showComingSoonToast = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} feature will be available in a future update.`,
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-3 sm:p-4 bg-transparent w-full max-w-3xl mx-auto group",
      )}
    >
      <div className={cn(
        "bg-card text-card-foreground p-3 rounded-xl border border-input shadow-xl flex flex-col gap-2.5", 
        "transition-all duration-300 ease-in-out group-focus-within:shadow-2xl group-focus-within:border-primary/50"
      )}>
        <div className="flex items-end space-x-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask PyscoutAI"
            className="flex-grow resize-none overflow-y-hidden p-2.5 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base max-h-[180px]"
            rows={1}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost"
                  size="icon" 
                  className="h-10 w-10 p-0 rounded-full text-muted-foreground hover:text-foreground disabled:bg-muted disabled:text-muted-foreground self-end flex items-center justify-center shrink-0 transition-colors duration-150"
                  aria-label="Voice input (placeholder)"
                  disabled={isLoading}
                  onClick={() => showComingSoonToast("Voice input")}
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
        <div className="flex items-center space-x-1.5 pl-1">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg disabled:opacity-50 transition-colors duration-150"
                    disabled={isLoading}
                    aria-label="Attach"
                     onClick={() => showComingSoonToast("Attach file")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top"><p>Attach file</p></TooltipContent>
             </Tooltip>
           </TooltipProvider>
          {[
            { icon: ImageIcon, label: "Image", tip: "Process image", action: () => showComingSoonToast("Image Processing") },
            { icon: Brain, label: "Deep Research", tip: "Deep research", action: () => showComingSoonToast("Deep Research") },
            { icon: GalleryVerticalEnd, label: "Canvas", tip: "Open canvas", action: () => showComingSoonToast("Canvas") },
          ].map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg px-2.5 py-1 h-auto text-xs disabled:opacity-50 transition-colors duration-150"
                    disabled={isLoading}
                    aria-label={item.label}
                    onClick={item.action}
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
