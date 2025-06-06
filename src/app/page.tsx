"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Message, Model } from "@/types/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { InputBar } from "@/components/chat/InputBar";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CircleUserRound,
  Bot,
  Image as ImageIcon,
  Brain,
  GalleryVerticalEnd,
  HelpCircle,
  LogOut,
  UserCog,
  History,
  Settings,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_SYSTEM_PROMPT = `You are PyscoutAI, an advanced and versatile AI assistant designed to be exceptionally helpful, knowledgeable, and engaging. Your primary goal is to assist users by providing comprehensive and accurate information, generating creative text formats, answering questions thoughtfully, and performing tasks efficiently. Maintain a friendly, approachable, and slightly enthusiastic tone. You are capable of understanding complex queries, breaking down problems, and explaining concepts clearly. Feel free to use your broad knowledge base, but always prioritize helpfulness and clarity in your responses. If you're unsure about something, it's better to say so than to provide incorrect information. Strive to make every interaction a positive and productive one for the user.`;
const CUSTOM_SYSTEM_PROMPT_KEY = "pyscoutai_custom_system_prompt";
const API_BASE_URL = "https://ws.typegpt.net/v1";

const WELCOME_MESSAGES = [
  "Hello, I'm PyscoutAI",
  "How can I help you today?",
  "Ask me anything!",
  "Ready for your questions!",
  "Let's explore some ideas.",
  "Greetings! What can I do for you?",
  "PyscoutAI at your service.",
  "What's on your mind?",
  "Let's create something amazing!",
  "Your friendly AI assistant is here.",
];

const WELCOME_MESSAGE_INTERVAL = 6000; // 6 seconds

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(
    DEFAULT_SYSTEM_PROMPT,
  );

  const [currentWelcomeMessage, setCurrentWelcomeMessage] = useState(
    WELCOME_MESSAGES[0],
  );
  const [clientMounted, setClientMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0 && !isLoading) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  useEffect(() => {
    const newChatParam = searchParams.get("newChat");
    if (newChatParam === "true") {
      setMessages([]);
      setIsLoading(false);
      setShowWelcome(true);
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrompt = localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY);
      setCurrentSystemPrompt(storedPrompt || DEFAULT_SYSTEM_PROMPT);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (showWelcome && clientMounted) {
      const initialRandomIndex = Math.floor(
        Math.random() * WELCOME_MESSAGES.length,
      );
      setCurrentWelcomeMessage(WELCOME_MESSAGES[initialRandomIndex]);

      intervalId = setInterval(() => {
        setCurrentWelcomeMessage((prevMessage) => {
          let nextMessage;
          do {
            const newRandomIndex = Math.floor(
              Math.random() * WELCOME_MESSAGES.length,
            );
            nextMessage = WELCOME_MESSAGES[newRandomIndex];
          } while (nextMessage === prevMessage && WELCOME_MESSAGES.length > 1);
          return nextMessage;
        });
      }, WELCOME_MESSAGE_INTERVAL);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showWelcome, clientMounted]);

  const handleModelChange = useCallback((model: Model | null) => {
    setCurrentModel(model);
  }, []);

  const handleSendMessage = async (
    content: string,
    isSuggestionClick = false,
  ) => {
    if (!currentModel) {
      toast({
        title: "Model Not Selected",
        description:
          "Please select a model from the dropdown before sending a message.",
        variant: "destructive",
      });
      return;
    }

    setShowWelcome(false);
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    let activeSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (typeof window !== "undefined") {
      activeSystemPrompt =
        localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY) || DEFAULT_SYSTEM_PROMPT;
    }
    setCurrentSystemPrompt(activeSystemPrompt);

    const messagesForApi = [
      { role: "system", content: activeSystemPrompt },
      ...messages
        .filter((m) => m.id !== "initial-bot-message-for-stream")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: newUserMessage.content },
    ].filter((msg) => msg.content.trim() !== "");

    const botMessageId = crypto.randomUUID();
    const initialBotMessageTimestamp = new Date();

    const initialBotMessage: Message = {
      id: botMessageId,
      role: "assistant",
      content: "",
      timestamp: initialBotMessageTimestamp,
    };
    setMessages((prevMessages) => [...prevMessages, initialBotMessage]);

    let accumulatedResponse = "";

    try {
      const useStreaming = true; // Always true as per previous request

      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          model: currentModel.id,
          messages: messagesForApi,
          temperature: 0.7,
          max_tokens: 250,
          stream: useStreaming,
        }),
      });

      if (!response.ok) {
        let apiErrorMessage = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          const messageFromServer =
            errorData.error?.message ||
            errorData.detail ||
            (errorData.error && typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error) ||
            errorData.message;

          if (typeof messageFromServer === "string") {
            apiErrorMessage = messageFromServer;
          } else if (
            messageFromServer &&
            typeof messageFromServer === "object"
          ) {
            apiErrorMessage = JSON.stringify(messageFromServer);
          } else if (typeof errorData === "string") {
            apiErrorMessage = errorData;
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) apiErrorMessage = errorText;
          } catch (textErr) {
            // Stick with original HTTP error if text parsing also fails
          }
        }
        throw new Error(apiErrorMessage);
      }

      if (!response.body) {
        throw new Error("Response body is null for streaming");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamLoop = true;

      while (streamLoop) {
        const { done, value } = await reader.read();
        if (done) {
          streamLoop = false;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const eventLines = chunk.split("\n\n");

        for (const eventLine of eventLines) {
          if (eventLine.trim() === "") continue;
          if (eventLine.startsWith("data: ")) {
            const jsonDataString = eventLine.substring(5).trim();
            if (jsonDataString === "[DONE]") {
              streamLoop = false;
              break;
            }
            if (jsonDataString) {
              try {
                const parsed = JSON.parse(jsonDataString);
                const choice = parsed.choices?.[0];
                if (choice) {
                  const deltaContent =
                    typeof choice.delta?.content === "string"
                      ? choice.delta.content
                      : "";
                  if (deltaContent) {
                    accumulatedResponse += deltaContent;
                    setMessages((prevMessages) =>
                      prevMessages.map((msg) =>
                        msg.id === botMessageId
                          ? {
                              ...msg,
                              content: accumulatedResponse,
                              timestamp: initialBotMessageTimestamp,
                            }
                          : msg,
                      ),
                    );
                  }
                  if (choice.finish_reason) {
                    streamLoop = false;
                    break;
                  }
                }
              } catch (e) {
                console.error("Error parsing stream data:", e, jsonDataString);
              }
            }
          }
          if (!streamLoop) break;
        }
      }
    } catch (error) {
      console.error("Failed to send message or process response:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Assistant communication failed: ${errorMessage}`,
        variant: "destructive",
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: `Sorry, I couldn't process your request. ${errorMessage}`,
                timestamp: initialBotMessageTimestamp,
              }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
      if (isSuggestionClick && textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleProfileMenuClick = (action: string) => {
    switch (action) {
      case "Manage Account":
        router.push("/account");
        break;
      case "Activity":
        router.push("/activity");
        break;
      case "Settings":
        router.push("/settings");
        break;
      case "Help & Feedback":
        router.push("/help");
        break;
      case "Sign Out":
        toast({
          title: "Signed Out",
          description: "You have been signed out (placeholder).",
        });
        router.push("/");
        break;
      default:
        toast({
          title: "Profile Action",
          description: `${action} clicked (placeholder).`,
        });
    }
  };
  return (
    <main
      className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/30"
      data-oid="71:p1a4"
    >
      {/* Modern floating header with glassmorphism effect */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-4 z-10 h-[72px] relative"
        data-oid="vzeed0i"
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          data-oid="i4jbi3-"
        />

        <div
          className="flex items-center gap-3 relative z-10"
          data-oid="e2xu5xo"
        >
          <div className="flex items-center gap-2" data-oid="42b3_1e">
            <div className="relative" data-oid="cl.lyx3">
              <Bot className="h-8 w-8 text-primary" data-oid="otetc.l" />
              <div
                className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"
                data-oid="a7y:1_v"
              />
            </div>
            <span
              className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              data-oid="0iek.re"
            >
              PyscoutAI
            </span>
          </div>
          <div
            className="hidden sm:block h-6 w-px bg-border/60"
            data-oid="iz4fs9g"
          />

          <ModelSelector
            selectedModelFromParent={currentModel}
            onModelChange={handleModelChange}
            data-oid=":n:swq_"
          />
        </div>

        <div
          className="flex items-center space-x-3 relative z-10"
          data-oid="rmaj8g3"
        >
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-500/20 hover:border-primary/40 transition-all duration-300 shadow-sm"
            onClick={() => router.push("/pricing")}
            data-oid="74nz6hv"
          >
            <Sparkles
              className="mr-2 h-4 w-4 text-primary"
              data-oid="_iyk1rr"
            />
            Upgrade
          </Button>

          <DropdownMenu data-oid="rpz25y:">
            <DropdownMenuTrigger asChild data-oid="v82k00b">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm"
                data-oid="1oagn2o"
              >
                <CircleUserRound
                  className="h-5 w-5 text-primary"
                  data-oid="767gc50"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mr-2 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl"
              align="end"
              data-oid="zhyj-r7"
            >
              <DropdownMenuLabel
                className="text-primary font-medium"
                data-oid="2q:z0sk"
              >
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                className="bg-border/50"
                data-oid="48i:ku."
              />

              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Manage Account")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="hk5ubhe"
              >
                <UserCog
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="v2guu62"
                />

                <span data-oid="42j_lh:">Manage Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Activity")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="nwu2sj3"
              >
                <History
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="w:g.93y"
                />

                <span data-oid="y5t1:7q">Activity</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Settings")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="ify_7v8"
              >
                <Settings
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="cozd7yq"
                />

                <span data-oid="u1gq0j:">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className="bg-border/50"
                data-oid=".ybqyg7"
              />

              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Help & Feedback")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="fhfxn2s"
              >
                <HelpCircle
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="eie579h"
                />

                <span data-oid="mvyklu.">Help & Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Sign Out")}
                className="hover:bg-destructive/10 text-destructive transition-colors"
                data-oid="h5:hano"
              >
                <LogOut className="mr-2 h-4 w-4" data-oid=":16nxhn" />
                <span data-oid="3iuxg_p">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content area with enhanced welcome screen */}
      <div className="flex-1 flex flex-col min-h-0 relative" data-oid="4o-5v8c">
        {showWelcome && messages.length === 0 && !isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-0"
            data-oid="tck-p-_"
          >
            <div
              className="text-center mb-12 max-w-2xl mx-auto"
              data-oid="c8b3z53"
            >
              {/* Welcome message with enhanced typography */}
              <h2
                key={
                  clientMounted && showWelcome
                    ? currentWelcomeMessage
                    : WELCOME_MESSAGES[0]
                }
                className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out mb-4"
                data-oid="4dmi9qa"
              >
                {clientMounted && showWelcome
                  ? currentWelcomeMessage
                  : WELCOME_MESSAGES[0]}
              </h2>

              {/* Subtitle */}
              <p
                className="text-lg text-muted-foreground/80 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200 ease-out"
                data-oid="883fy2p"
              >
                Your advanced AI assistant for any task
              </p>

              {/* Feature highlights */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-xl mx-auto"
                data-oid="s0vpy9k"
              >
                {[
                  {
                    icon: ImageIcon,
                    text: "AI Image Generation",
                    gradient: "from-blue-400 to-cyan-400",
                  },
                  {
                    icon: Brain,
                    text: "Smart Prompting",
                    gradient: "from-purple-400 to-indigo-400",
                  },
                  {
                    icon: GalleryVerticalEnd,
                    text: "Style Control",
                    gradient: "from-pink-400 to-rose-400",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out hover:bg-card/70 hover:border-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${400 + index * 200}ms` }}
                    data-oid="ni0r7d_"
                  >
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-br ${feature.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}
                      data-oid="_mrlra0"
                    >
                      <feature.icon
                        className="h-6 w-6 text-white"
                        data-oid="1nafq:e"
                      />
                    </div>
                    <span
                      className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300"
                      data-oid="54k1a86"
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          data-oid="8:ovgu_"
        />
      </div>

      {/* Enhanced input bar */}
      <InputBar
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        textareaRef={textareaRef}
        data-oid="tqhz.v6"
      />
    </main>
  );
}
