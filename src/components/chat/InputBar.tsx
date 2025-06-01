
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Brain, GalleryVerticalEnd, Mic, MicOff, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { TokenCounter } from '@/components/ui/TokenCounter';

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
  const speechRecognitionRef = useRef<any>(null);
  const textBeforeSpeechRef = useRef<string>(''); 
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

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported by this browser.");
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };    recognition.onerror = (event: any) => {
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

    recognition.onresult = (event: any) => {
      let combinedTranscript = '';
      let currentSegmentIsFinal = false;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        combinedTranscript += transcriptPart;
        if (event.results[i].isFinal) {
          currentSegmentIsFinal = true;
        }
      }
      
      setInputValue(textBeforeSpeechRef.current + combinedTranscript);

      if (currentSegmentIsFinal) {
        setInputValue(currentVal => {
          const newValWithSpace = currentVal.trimEnd() + ' ';
          textBeforeSpeechRef.current = newValWithSpace; 
          return newValWithSpace;
        });
      }

      if (textareaRefToUse.current) {
        setTimeout(() => { 
          if (textareaRefToUse.current) {
            textareaRefToUse.current.focus();
            textareaRefToUse.current.selectionStart = textareaRefToUse.current.selectionEnd = textareaRefToUse.current.value.length;
          }
        }, 0);
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
  }, [toast, textareaRefToUse]); 


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    textBeforeSpeechRef.current = event.target.value; 
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
      textBeforeSpeechRef.current = ''; 
      if (textareaRefToUse.current) {
        textareaRefToUse.current.style.height = 'auto'; 
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
      textBeforeSpeechRef.current = inputValue; 
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
                className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn border border-red-400/50"
                onClick={handleMicClick}
                aria-label="Stop listening"
              >
                <MicOff className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-card/95 backdrop-blur-sm border-border/50"><p>Stop listening</p></TooltipContent>
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
                className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn border border-primary/50"
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 transition-all duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-card/95 backdrop-blur-sm border-border/50"><p>Send message</p></TooltipContent>
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
              className="h-12 w-12 p-0 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-300 group/btn border border-transparent hover:border-primary/20"
              onClick={handleMicClick}
              disabled={isLoading || !isSpeechSupported}
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-card/95 backdrop-blur-sm border-border/50">
            <p>{isSpeechSupported ? "Voice input" : "Voice input not supported"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative p-4 sm:p-6">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
      
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "relative w-full max-w-4xl mx-auto group",
        )}
      >
        <div className={cn(
          "relative bg-card/90 backdrop-blur-xl text-card-foreground p-4 rounded-3xl border border-border/50 shadow-2xl flex flex-col gap-4",
          "transition-all duration-500 ease-in-out",
          "group-focus-within:shadow-primary/30 group-focus-within:border-primary/50 group-focus-within:bg-card/95",
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-primary/5 before:via-purple-500/5 before:to-pink-500/5 before:opacity-0 before:transition-opacity before:duration-500",
          "group-focus-within:before:opacity-100"
        )}>
          {/* Main input area */}
          <div className="flex items-end space-x-3 relative z-10"> 
            <Textarea
              ref={textareaRefToUse}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask PyscoutAI anything..."
              className="flex-grow resize-none overflow-y-hidden p-4 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base max-h-[180px] placeholder:text-muted-foreground/60 text-foreground"
              rows={1}
              disabled={isLoading}
              aria-label="Chat message input"
            />            <div className="shrink-0 self-end mb-1 flex items-center gap-2"> 
              {/* Token count indicator (compact for right side) */}
              {inputValue.length > 0 && (
                <div className="text-xs text-muted-foreground/60 hidden sm:block">
                  <TokenCounter text={inputValue} compact={true} />
                </div>
              )}
              <RightSideButton />
            </div>
          </div>
          
          {/* Action buttons row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/15 rounded-xl disabled:opacity-50 transition-all duration-300 group/btn"
                      disabled={isLoading}
                      aria-label="Attach"
                      onClick={() => showComingSoonToast("Attach file")}
                    >
                      <Plus className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-card/95 backdrop-blur-sm border-border/50">
                    <p>Attach file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                {[
                { icon: ImageIcon, label: "Image", tip: "Image Generation", action: () => showComingSoonToast("Image Generation"), gradient: "from-blue-400 to-cyan-400" },
                { icon: Brain, label: "Research", tip: "Deep research", action: () => showComingSoonToast("Deep Research"), gradient: "from-purple-400 to-indigo-400" },
                { icon: GalleryVerticalEnd, label: "Canvas", tip: "Open canvas", action: () => showComingSoonToast("Canvas"), gradient: "from-pink-400 to-rose-400" },
              ].map((item, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:text-white rounded-xl px-3 py-2 h-9 text-sm font-medium disabled:opacity-50 transition-all duration-300 group/btn border border-transparent hover:border-white/20",
                          `hover:bg-gradient-to-r hover:${item.gradient} hover:shadow-lg`
                        )}
                        disabled={isLoading}
                        aria-label={item.label}
                        onClick={item.action}
                      >
                        <item.icon className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                        {item.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-card/95 backdrop-blur-sm border-border/50">
                      <p>{item.tip}</p>
                    </TooltipContent>                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground/60">
              {isListening && (
                <div className="flex items-center space-x-1 animate-pulse">
                  <div className="h-2 w-2 bg-red-400 rounded-full animate-ping" />
                  <span>Listening...</span>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

