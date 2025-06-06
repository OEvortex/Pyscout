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
  Settings,
  Search,
  Code,
  Lightbulb,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { TokenCounter } from "@/components/ui/TokenCounter";

interface InputBarProps {
  onSendMessage: (content: string, isSuggestionClick?: boolean, toolType?: string) => void;
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
  const [activeTools, setActiveTools] = useState<string[]>([]);
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
  };  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (isListening) {
      toast({
        title: "Voice input active",
        description: "Please finish voice input before sending.",
      });
      return;
    }
    if (inputValue.trim() && !isLoading) {
      // Pass the active tools along with the message
      const toolsData = activeTools.length > 0 ? JSON.stringify({ tools: activeTools }) : undefined;
      onSendMessage(inputValue.trim(), false, toolsData);
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
  };  const handleToolSelection = (toolType: string) => {
    setActiveTools(prevTools => {
      if (prevTools.includes(toolType)) {
        // Remove tool if already active
        return prevTools.filter(tool => tool !== toolType);
      } else {
        // Add tool if not active
        return [...prevTools, toolType];
      }
    });
  };

  const removeActiveTool = (toolType: string) => {
    setActiveTools(prevTools => prevTools.filter(tool => tool !== toolType));
  };

  const getToolDisplayName = (toolType: string) => {
    switch (toolType) {
      case "web_search":
        return "Web Search";
      case "image_generation":
        return "Image Generation";
      case "deep_research":
        return "Deep Research";
      case "think_longer":
        return "Think Longer";
      case "canvas":
        return "Canvas";
      default:
        return toolType;
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
        <TooltipProvider data-oid="egp.38p">
          <Tooltip data-oid="rdi9guk">
            <TooltipTrigger asChild data-oid="kek-6pz">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn border border-red-400/50"
                onClick={handleMicClick}
                aria-label="Stop listening"
                data-oid="mnni9t."
              >
                <MicOff
                  className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200"
                  data-oid="n-mdlxi"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-card/95 backdrop-blur-sm border-border/50"
              data-oid="f-herwy"
            >
              <p data-oid="55wulcj">Stop listening</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    if (inputValue.trim() && !isListening) {
      return (
        <TooltipProvider data-oid="vncvkxa">
          <Tooltip data-oid="7iu8ri0">
            <TooltipTrigger asChild data-oid="w8zb:.4">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn border border-primary/50"
                disabled={isLoading}
                aria-label="Send message"
                data-oid="aulz08m"
              >
                <Send
                  className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 transition-all duration-200"
                  data-oid="xrneq7k"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-card/95 backdrop-blur-sm border-border/50"
              data-oid="8lzuy15"
            >
              <p data-oid="aqg9z-u">Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider data-oid="jt18vpx">
        <Tooltip data-oid="4s6cr4r">
          <TooltipTrigger asChild data-oid="si8hdsv">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-12 w-12 p-0 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-300 group/btn border border-transparent hover:border-primary/20"
              onClick={handleMicClick}
              disabled={isLoading || !isSpeechSupported}
              aria-label="Voice input"
              data-oid="2n4omer"
            >
              <Mic
                className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200"
                data-oid="gpjywyt"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-card/95 backdrop-blur-sm border-border/50"
            data-oid="ax47:ja"
          >
            <p data-oid="gxxf3oc">
              {isSpeechSupported ? "Voice input" : "Voice input not supported"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative p-4 sm:p-6" data-oid="9qjdih.">
      {/* Background glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none"
        data-oid="jd8pa18"
      />

      <form
        onSubmit={handleSubmit}
        className={cn("relative w-full max-w-4xl mx-auto group")}
        data-oid="s90yvze"
      >
        <div
          className={cn(
            "relative bg-card/90 backdrop-blur-xl text-card-foreground p-4 rounded-3xl border border-border/50 shadow-2xl flex flex-col gap-4",
            "transition-all duration-500 ease-in-out",
            "group-focus-within:shadow-primary/30 group-focus-within:border-primary/50 group-focus-within:bg-card/95",
            "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-primary/5 before:via-purple-500/5 before:to-pink-500/5 before:opacity-0 before:transition-opacity before:duration-500",
            "group-focus-within:before:opacity-100",
          )}
          data-oid="x2x7fk2"
        >
          {/* Main input area */}
          <div
            className="flex items-end space-x-3 relative z-10"
            data-oid="fyryq3u"
          >
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
              data-oid="lw-p1pu"
            />

            <div
              className="shrink-0 self-end mb-1 flex items-center gap-2"
              data-oid="l487w:h"
            >
              {/* Token count indicator (compact for right side) */}
              {inputValue.length > 0 && (
                <div
                  className="text-xs text-muted-foreground/60 hidden sm:block"
                  data-oid="igmm02p"
                >
                  <TokenCounter
                    text={inputValue}
                    compact={true}
                    data-oid="sqq04ko"
                  />
                </div>
              )}
              <RightSideButton data-oid="i52-g-2" />
            </div>
          </div>

          {/* Active Tools Display */}
          {activeTools.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
              {activeTools.map((tool) => (
                <div
                  key={tool}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-xs font-medium text-primary transition-colors"
                >
                  {tool === "web_search" && <Search className="h-3 w-3" />}
                  {tool === "image_generation" && <ImageIcon className="h-3 w-3" />}
                  {tool === "deep_research" && <Brain className="h-3 w-3" />}
                  {tool === "think_longer" && <Lightbulb className="h-3 w-3" />}
                  {tool === "canvas" && <GalleryVerticalEnd className="h-3 w-3" />}
                  <span>{getToolDisplayName(tool)}</span>
                  <button
                    onClick={() => removeActiveTool(tool)}
                    className="ml-1 hover:bg-primary/30 rounded p-0.5 transition-colors"
                    aria-label={`Remove ${getToolDisplayName(tool)}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons row */}
          <div
            className="flex items-center justify-between relative z-10"
            data-oid="x3_1.fv"
          >            <div className="flex items-center space-x-2" data-oid="jr6o0f9">
              {/* Attach File Button */}
              <TooltipProvider data-oid="-dp.q9t">
                <Tooltip data-oid="o0qk4r5">
                  <TooltipTrigger asChild data-oid="mayk3my">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/15 rounded-xl disabled:opacity-50 transition-all duration-300 group/btn"
                      disabled={isLoading}
                      aria-label="Attach"
                      onClick={() => showComingSoonToast("Attach file")}
                      data-oid="iv3ld3p"
                    >
                      <Plus
                        className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200"
                        data-oid="w:rc-1s"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-card/95 backdrop-blur-sm border-border/50"
                    data-oid="emrngs1"
                  >
                    <p data-oid="6dac8ye">Attach file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/15 rounded-xl px-3 py-2 h-9 text-sm font-medium disabled:opacity-50 transition-all duration-300 group/btn border border-transparent hover:border-primary/20"
                    disabled={isLoading}
                    aria-label="Tools"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Tools
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>                <DropdownMenuContent 
                  align="start" 
                  className="w-56 bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg rounded-xl p-1"
                >
                  <DropdownMenuItem 
                    onClick={() => showComingSoonToast("Image Generation")}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span className="bg-blue-50 text-blue-600 rounded-full p-1.5 mr-3">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    Image Generation
                  </DropdownMenuItem>                  <DropdownMenuItem 
                    onClick={() => handleToolSelection("web_search")}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors",
                      activeTools.includes("web_search") && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <span className="bg-green-50 text-green-600 rounded-full p-1.5 mr-3">
                      <Search className="h-4 w-4" />
                    </span>
                    <span className="flex-1">Search the web</span>
                    {activeTools.includes("web_search") && (
                      <div className="ml-2 h-2 w-2 bg-green-500 rounded-full"></div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => showComingSoonToast("Deep Research")}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span className="bg-yellow-50 text-yellow-600 rounded-full p-1.5 mr-3">
                      <Brain className="h-4 w-4" />
                    </span>
                    Deep Research
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => showComingSoonToast("Think for longer")}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span className="bg-orange-50 text-orange-600 rounded-full p-1.5 mr-3">
                      <Lightbulb className="h-4 w-4" />
                    </span>
                    Think for longer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => showComingSoonToast("Canvas")}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span className="text-zinc-600 mr-3">
                      <GalleryVerticalEnd className="h-4 w-4" />
                    </span>
                    Canvas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status indicators */}
            <div
              className="flex items-center space-x-2 text-xs text-muted-foreground/60"
              data-oid="n3a-x3b"
            >
              {isListening && (
                <div
                  className="flex items-center space-x-1 animate-pulse"
                  data-oid="y4hdggp"
                >
                  <div
                    className="h-2 w-2 bg-red-400 rounded-full animate-ping"
                    data-oid="i9n8ssy"
                  />

                  <span data-oid="0mt:z93">Listening...</span>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center space-x-1" data-oid="d6y40h-">
                  <div
                    className="h-2 w-2 bg-primary rounded-full animate-bounce"
                    data-oid=":y:vf1y"
                  />

                  <span data-oid="m_00q-b">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
