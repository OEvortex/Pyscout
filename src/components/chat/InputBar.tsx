
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Brain, GalleryVerticalEnd, Mic, MicOff, Send } from 'lucide-react';
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
  const textareaRefToUse = externalTextareaRef || internalTextareaRef;
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const autoResizeTextarea = useCallback((element: HTMLTextAreaElement | null) => {
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
  }, []);

  useEffect(() => {
    if (textareaRefToUse.current) {
      autoResizeTextarea(textareaRefToUse.current);
    }
  }, [inputValue, autoResizeTextarea, textareaRefToUse]);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported by this browser.");
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false; // Stop after the first utterance
    recognition.interimResults = true; // We can use interim results if needed, but final is cleaner for input
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      let errorMessage = 'An error occurred during speech recognition.';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech was detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not available. Please check your microphone settings.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied. Please enable it in browser settings.';
      }
      toast({
        title: "Voice Input Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscriptSegment = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptSegment += event.results[i][0].transcript;
        }
      }

      if (finalTranscriptSegment) {
        setInputValue(prevVal => (prevVal.endsWith(' ') || prevVal === '' ? prevVal : prevVal + ' ') + finalTranscriptSegment.trim() + ' ');
        if (textareaRefToUse.current) {
          // autoResizeTextarea is called by useEffect on inputValue change
          setTimeout(() => { // Ensure focus and cursor move happens after state update and DOM re-render
            if (textareaRefToUse.current) {
              textareaRefToUse.current.focus();
              textareaRefToUse.current.selectionStart = textareaRefToUse.current.selectionEnd = textareaRefToUse.current.value.length;
            }
          }, 0);
        }
      }
    };

    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.onstart = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.stop();
      }
    };
  }, [toast, textareaRefToUse]); // Removed autoResizeTextarea as it's memoized and doesn't change


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    // autoResizeTextarea is handled by useEffect on inputValue change
  };
  
  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (isListening) {
      toast({ title: "Voice input active", description: "Please finish voice input before sending."});
      return;
    }
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRefToUse.current) {
        textareaRefToUse.current.style.height = 'auto'; 
        // autoResizeTextarea is handled by useEffect on inputValue change (to empty)
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isListening) {
        handleSubmit();
      }
    }
  };

  const handleMicClick = () => {
    if (!isSpeechSupported || !speechRecognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Speech recognition is not available in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      try {
        speechRecognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not start. Check mic permissions or if it's already active.",
          variant: "destructive",
        });
      }
    }
  };

  const showComingSoonToast = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} feature will be available in a future update.`,
    });
  };
  
  const RightSideButton = () => {
    if (isListening) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 rounded-full text-primary hover:bg-primary/10"
                onClick={handleMicClick}
                aria-label="Stop listening"
              >
                <MicOff className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Stop listening</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    if (inputValue.trim() && !isListening) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 rounded-full text-primary hover:bg-primary/10"
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Send message</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={handleMicClick}
              disabled={isLoading || !isSpeechSupported}
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isSpeechSupported ? "Voice input" : "Voice input not supported"}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };


  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-3 sm:p-4 bg-transparent w-full max-w-3xl mx-auto group",
      )}
    >
      <div className={cn(
        "bg-card text-card-foreground p-3.5 rounded-xl border border-input shadow-lg flex flex-col gap-3", 
        "transition-all duration-300 ease-in-out group-focus-within:shadow-xl group-focus-within:border-primary/70 group-focus-within:ring-2 group-focus-within:ring-primary/50"
      )}>
        <div className="flex items-end space-x-2"> {/* Use items-end for vertical alignment */}
          <Textarea
            ref={textareaRefToUse}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask PyscoutAI..."
            className="flex-grow resize-none overflow-y-hidden p-2.5 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base max-h-[180px]"
            rows={1}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <div className="shrink-0 self-end mb-px"> {/* Aligns button with baseline of text */}
             <RightSideButton />
          </div>
        </div>
        <div className="flex items-center space-x-1.5 pl-1">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/15 rounded-lg disabled:opacity-50 transition-colors duration-200"
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
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-2.5 py-1.5 h-auto text-sm disabled:opacity-50 transition-colors duration-200"
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
