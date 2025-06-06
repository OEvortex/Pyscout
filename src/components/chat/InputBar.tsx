"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Image as ImageIcon,
  Brain,
  GalleryVerticalEnd,
  Mic,
  MicOff,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { TokenCounter } from "@/components/ui/TokenCounter";

interface InputBarProps {
  onSendMessage: (content: string, isSuggestionClick?: boolean) => void;
  isLoading: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const MAX_TEXTAREA_HEIGHT = 180;

export function InputBar({
  onSendMessage,
  isLoading,
  textareaRef: externalTextareaRef,
}: InputBarProps) {
  const [inputValue, setInputValue] = useState("");
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefToUse = externalTextareaRef || internalTextareaRef;
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const textBeforeSpeechRef = useRef<string>("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const autoResizeTextarea = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element) return;
      element.style.height = "auto";
      const scrollHeight = element.scrollHeight;
      if (scrollHeight > MAX_TEXTAREA_HEIGHT) {
        element.style.height = `${MAX_TEXTAREA_HEIGHT}px`;
        element.style.overflowY = "auto";
      } else {
        element.style.height = `${scrollHeight}px`;
        element.style.overflowY = "hidden";
      }
    },
    [],
  );

  useEffect(() => {
    if (textareaRefToUse.current) {
      autoResizeTextarea(textareaRefToUse.current);
    }
  }, [inputValue, autoResizeTextarea, textareaRefToUse]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported by this browser.");
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      let errorMessage = "An error occurred during speech recognition.";
      if (event.error === "no-speech") {
        errorMessage = "No speech was detected. Please try again.";
      } else if (event.error === "audio-capture") {
        errorMessage =
          "Microphone not available. Please check your microphone settings.";
      } else if (event.error === "not-allowed") {
        errorMessage =
          "Microphone access denied. Please enable it in browser settings.";
      }
      toast({
        title: "Voice Input Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.onresult = (event: any) => {
      let combinedTranscript = "";
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
        setInputValue((currentVal) => {
          const newValWithSpace = currentVal.trimEnd() + " ";
          textBeforeSpeechRef.current = newValWithSpace;
          return newValWithSpace;
        });
      }

      if (textareaRefToUse.current) {
        setTimeout(() => {
          if (textareaRefToUse.current) {
            textareaRefToUse.current.focus();
            textareaRefToUse.current.selectionStart =
              textareaRefToUse.current.selectionEnd =
                textareaRefToUse.current.value.length;
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
      toast({
        title: "Voice input active",
        description: "Please finish voice input before sending.",
      });
      return;
    }
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      textBeforeSpeechRef.current = "";
      if (textareaRefToUse.current) {
        textareaRefToUse.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
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
          description:
            "Could not start. Check mic permissions or if it's already active.",
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
        <TooltipProvider data-oid="rscg5r.">
          <Tooltip data-oid=":.mynv0">
            <TooltipTrigger asChild data-oid="f1t9b5-">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-500 group/btn border border-red-400/50",
                  "animate-pulse hover:animate-none",
                  "hover:scale-110 hover:rotate-3 active:scale-95",
                  "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-red-400 before:to-red-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20"
                )}
                onClick={handleMicClick}
                aria-label="Stop listening"
                data-oid="13fq2ty"
              >
                <MicOff
                  className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300"
                  data-oid="nn:yf1c"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
              data-oid="x76e2k0"
            >
              <p data-oid="k:d4i4j">Stop listening</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    if (inputValue.trim() && !isListening) {
      return (
        <TooltipProvider data-oid="6d5xc37">
          <Tooltip data-oid="7x2yyh:">
            <TooltipTrigger asChild data-oid="jp1h1l5">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-500 group/btn border border-primary/50",
                  "hover:scale-110 hover:-rotate-3 active:scale-95",
                  "animate-in fade-in-0 scale-in-95 duration-300",
                  "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/50 before:to-purple-500/50 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-30",
                  "after:absolute after:inset-0 after:rounded-2xl after:bg-white/10 after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-100"
                )}
                disabled={isLoading}
                aria-label="Send message"
                data-oid="talhwe8"
              >
                <Send
                  className="h-5 w-5 group-hover/btn:scale-125 group-hover/btn:translate-x-1 transition-all duration-300"
                  data-oid="xwqwafu"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
              data-oid="yyulg9h"
            >
              <p data-oid="l:ou_2n">Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider data-oid="izb2fhh">
        <Tooltip data-oid="8wk8poc">
          <TooltipTrigger asChild data-oid="d00oq0w">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12 p-0 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-500 group/btn border border-transparent hover:border-primary/20",
                "hover:scale-105 hover:rotate-1 active:scale-95",
                "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/10 before:to-purple-500/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
              )}
              onClick={handleMicClick}
              disabled={isLoading || !isSpeechSupported}
              aria-label="Voice input"
              data-oid="a9siik0"
            >
              <Mic
                className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:-rotate-6 transition-all duration-300"
                data-oid="ljxzd5a"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
            data-oid="_j38f93"
          >
            <p data-oid="3o-goy_">
              {isSpeechSupported ? "Voice input" : "Voice input not supported"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative p-4 sm:p-6" data-oid="lbrgxb2">
      {/* Background glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none"
        data-oid="ivj7wcy"
      />

      <form
        onSubmit={handleSubmit}
        className={cn("relative w-full max-w-4xl mx-auto group")}
        data-oid="e6ol.y0"
      >
        <div
          className={cn(
            "relative bg-card/90 backdrop-blur-xl text-card-foreground p-4 rounded-3xl border border-border/50 shadow-2xl flex flex-col gap-4",
            "transition-all duration-700 ease-out transform-gpu",
            "group-focus-within:shadow-primary/40 group-focus-within:border-primary/60 group-focus-within:bg-card/98 group-focus-within:scale-[1.02]",
            "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-primary/8 before:via-purple-500/8 before:to-pink-500/8 before:opacity-0 before:transition-all before:duration-700 before:ease-out",
            "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-transparent after:via-white/5 after:to-transparent after:opacity-0 after:transition-all after:duration-500",
            "group-focus-within:before:opacity-100 group-focus-within:after:opacity-100",
            "hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
          )}
          data-oid="l5t319z"
        >
          {/* Main input area */}
          <div
            className="flex items-end space-x-3 relative z-10 group/input"
            data-oid="j2yo2-6"
          >
            <div className="relative flex-grow">
              {/* Animated placeholder overlay */}
              {!inputValue && !isListening && (
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center px-4">
                  <span className="text-muted-foreground/60 text-base animate-pulse">
                    Ask PyscoutAI anything...
                  </span>
                </div>
              )}
              
              {/* Typing indicator glow */}
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-all duration-300 blur-sm",
                inputValue && "opacity-30 animate-pulse"
              )} />
              
              <Textarea
                ref={textareaRefToUse}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder=""
                className={cn(
                  "flex-grow resize-none overflow-y-hidden p-4 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base max-h-[180px] text-foreground relative z-20",
                  "transition-all duration-300 ease-out",
                  "focus:scale-[1.01] focus:shadow-inner",
                  isListening && "animate-pulse"
                )}
                rows={1}
                disabled={isLoading}
                aria-label="Chat message input"
                data-oid="cgqw-83"
              />
            </div<div
              className="shrink-0 self-end mb-1 flex items-center gap-2"
              data-oid="hxjp.-2"
            >
              {/* Token count indicator (compact for right side) */}
              {inputValue.length > 0 && (
                <div
                  className={cn(
                    "text-xs text-muted-foreground/60 hidden sm:block transition-all duration-300 ease-out",
                    "animate-in fade-in-0 slide-in-from-right-2"
                  )}
                  data-oid="5v1.de1"
                >
                  <TokenCounter
                    text={inputValue}
                    compact={true}
                    data-oid="3w6xm:3"
                  />
                </div>
              )}
              <div className="animate-in fade-in-0 slide-in-from-right-1 duration-300">
                <RightSideButton data-oid="5ts9z.n" />
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div
            className="flex items-center justify-between relative z-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100"
            data-oid="ga3ybg2"
          >
            <div className="flex items-center space-x-2 group/actions" data-oid="fb31jsl">
              <TooltipProvider data-oid="15t49_c">
                <Tooltip data-oid="riez5m:">
                  <TooltipTrigger asChild data-oid="0txuvwa">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/15 rounded-xl disabled:opacity-50 transition-all duration-500 group/btn",
                        "hover:scale-110 hover:rotate-90 active:scale-95",
                        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/10 before:to-purple-500/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
                        "group-hover/actions:translate-y-0 translate-y-1 group-hover/actions:opacity-100 opacity-70"
                      )}
                      disabled={isLoading}
                      aria-label="Attach"
                      onClick={() => showComingSoonToast("Attach file")}
                      data-oid="ybc5vuo"
                    >
                      <Plus
                        className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:rotate-180 transition-all duration-500"
                        data-oid="nn-4vq9"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                    data-oid="cdbh7d."
                  >
                    <p data-oid="nd4rjpu">Attach file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {[
                {
                  icon: ImageIcon,
                  label: "Image",
                  tip: "Image Generation",
                  action: () => showComingSoonToast("Image Generation"),
                  gradient: "from-blue-400 to-cyan-400",
                },
                {
                  icon: Brain,
                  label: "Research",
                  tip: "Deep research",
                  action: () => showComingSoonToast("Deep Research"),
                  gradient: "from-purple-400 to-indigo-400",
                },
                {
                  icon: GalleryVerticalEnd,
                  label: "Canvas",
                  tip: "Open canvas",
                  action: () => showComingSoonToast("Canvas"),
                  gradient: "from-pink-400 to-rose-400",
                },
              ].map((item, index) => (
                <TooltipProvider key={index} data-oid="5nhdz_c">
                  <Tooltip data-oid="13bpy2:">
                    <TooltipTrigger asChild data-oid="fuyllwm">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-muted-foreground hover:text-white rounded-xl px-3 py-2 h-9 text-sm font-medium disabled:opacity-50 transition-all duration-500 group/btn border border-transparent hover:border-white/30 relative overflow-hidden",
                          `hover:bg-gradient-to-r hover:${item.gradient} hover:shadow-lg hover:shadow-${item.gradient.split('-')[1]}-500/25`,
                          "hover:scale-105 hover:-translate-y-0.5 active:scale-95",
                          "before:absolute before:inset-0 before:bg-gradient-to-r before:opacity-0 before:transition-opacity before:duration-300",
                          `before:${item.gradient} hover:before:opacity-20`,
                          "group-hover/actions:translate-y-0 translate-y-1 group-hover/actions:opacity-100 opacity-70",
                          `animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-${(index + 2) * 100}`
                        )}
                        disabled={isLoading}
                        aria-label={item.label}
                        onClick={item.action}
                        data-oid="w2uy4t."
                      >
                        <item.icon
                          className="h-4 w-4 mr-2 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all duration-500"
                          data-oid="1ona9d8"
                        />
                        <span className="relative z-10">{item.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                      data-oid="st5ip_e"
                    >
                      <p data-oid="m0hhjpe">{item.tip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Status indicators */}
            <div
              className="flex items-center space-x-2 text-xs text-muted-foreground/60"
              data-oid="aw2vjeh"
            >
              {isListening && (
                <div
                  className="flex items-center space-x-2 animate-in fade-in-0 slide-in-from-right-2 duration-300"
                  data-oid="09fjwkp"
                >
                  <div className="flex items-center space-x-1">
                    <div
                      className="h-2 w-2 bg-red-400 rounded-full animate-ping"
                      data-oid="mgzmdc-"
                    />
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse delay-75" />
                    <div className="h-1 w-1 bg-red-600 rounded-full animate-pulse delay-150" />
                  </div>
                  <span className="animate-pulse font-medium text-red-400" data-oid="f9-n64b">Listening...</span>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center space-x-2 animate-in fade-in-0 slide-in-from-right-2 duration-300" data-oid="m_hz6ko">
                  <div className="flex items-center space-x-1">
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce"
                      data-oid="_6:s515"
                    />
                    <div className="h-1.5 w-1.5 bg-primary/80 rounded-full animate-bounce delay-75" />
                    <div className="h-1 w-1 bg-primary/60 rounded-full animate-bounce delay-150" />
                  </div>
                  <span className="animate-pulse font-medium text-primary" data-oid="m5q4kpy">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
