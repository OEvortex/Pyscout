
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, Model } from '@/types/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InputBar } from '@/components/chat/InputBar';
import { ModelSelector } from '@/components/chat/ModelSelector';
import { useToast } from "@/hooks/use-toast";
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sparkles, CircleUserRound, Bot, Image as ImageIcon, Brain, GalleryVerticalEnd, HelpCircle, LogOut, UserCog, History } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_SYSTEM_PROMPT = 'You are PyscoutAI, a helpful and friendly assistant, inspired by Gemini.';
const CUSTOM_SYSTEM_PROMPT_KEY = 'pyscoutai_custom_system_prompt';
const API_BASE_URL = 'https://ws.typegpt.net/v1';

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
  "Your friendly AI assistant is here."
];

const WELCOME_MESSAGE_INTERVAL = 6000; // 6 seconds

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [currentWelcomeMessage, setCurrentWelcomeMessage] = useState(WELCOME_MESSAGES[0]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Determine initial welcome screen visibility
    const timer = setTimeout(() => {
      if (messages.length === 0 && !isLoading) {
        setShowWelcome(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  useEffect(() => {
    // Handle "newChat" parameter
    const newChatParam = searchParams.get('newChat');
    if (newChatParam === 'true') {
      setMessages([]);
      setIsLoading(false);
      setShowWelcome(true);
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Load custom system prompt from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedPrompt = localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY);
      setCurrentSystemPrompt(storedPrompt || DEFAULT_SYSTEM_PROMPT);
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      setCurrentWelcomeMessage(WELCOME_MESSAGES[randomIndex]);

      const intervalId = setInterval(() => {
        setCurrentWelcomeMessage(prevMessage => {
          let nextMessage;
          do {
            const newRandomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
            nextMessage = WELCOME_MESSAGES[newRandomIndex];
          } while (nextMessage === prevMessage && WELCOME_MESSAGES.length > 1);
          return nextMessage;
        });
      }, WELCOME_MESSAGE_INTERVAL);

      return () => clearInterval(intervalId);
    }
  }, [showWelcome]);


  const handleModelChange = useCallback((model: Model | null) => {
    setCurrentModel(model);
  }, []);

  const handleSendMessage = async (content: string, isSuggestionClick = false) => {
    if (!currentModel) {
      toast({
        title: "Model Not Selected",
        description: "Please select a model from the dropdown before sending a message.",
        variant: "destructive",
      });
      return;
    }

    setShowWelcome(false);
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    let activeSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (typeof window !== 'undefined') {
      activeSystemPrompt = localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY) || DEFAULT_SYSTEM_PROMPT;
    }
    setCurrentSystemPrompt(activeSystemPrompt);


    const messagesForApi = [
      { role: 'system', content: activeSystemPrompt },
      ...messages.filter(m => m.id !== 'initial-bot-message-for-stream').map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: newUserMessage.content }
    ].filter(msg => msg.content.trim() !== '');

    const botMessageId = crypto.randomUUID();
    const initialBotMessageTimestamp = new Date();

    const initialBotMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: initialBotMessageTimestamp,
    };
    setMessages((prevMessages) => [...prevMessages, initialBotMessage]);

    let accumulatedResponse = "";

    try {
      const useStreaming = true; // Always stream

      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel.id,
          messages: messagesForApi,
          temperature: 0.7,
          max_tokens: 250, // Adjusted based on previous API usage
          stream: useStreaming,
        }),
      });

      if (!response.ok) {
        let apiErrorMessage = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          const messageFromServer = errorData.error?.message ||
            errorData.detail ||
            errorData.error ||
            errorData.message;

          if (typeof messageFromServer === 'string') {
            apiErrorMessage = messageFromServer;
          } else if (messageFromServer && typeof messageFromServer === 'object') {
            apiErrorMessage = JSON.stringify(messageFromServer);
          } else if (typeof errorData === 'string') {
            apiErrorMessage = errorData;
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) apiErrorMessage = errorText;
          } catch (textErr) {
            // Stick with original HTTP error
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
        const eventLines = chunk.split('\n\n');

        for (const eventLine of eventLines) {
          if (eventLine.trim() === '') continue;
          if (eventLine.startsWith('data: ')) {
            const jsonDataString = eventLine.substring(5).trim();
            if (jsonDataString === '[DONE]') {
              streamLoop = false;
              break;
            }
            if (jsonDataString) {
              try {
                const parsed = JSON.parse(jsonDataString);
                const choice = parsed.choices?.[0];
                if (choice) {
                  const deltaContent = typeof choice.delta?.content === 'string' ? choice.delta.content : '';
                  if (deltaContent) {
                    accumulatedResponse += deltaContent;
                    setMessages((prevMessages) =>
                      prevMessages.map((msg) =>
                        msg.id === botMessageId
                          ? { ...msg, content: accumulatedResponse, timestamp: initialBotMessageTimestamp }
                          : msg
                      )
                    );
                  }
                  if (choice.finish_reason) {
                    streamLoop = false;
                    break;
                  }
                }
              } catch (e) {
                console.error('Error parsing stream data:', e, jsonDataString);
              }
            }
          }
          if (!streamLoop) break;
        }
      }

    } catch (error) {
      console.error('Failed to send message or process response:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Assistant communication failed: ${errorMessage}`,
        variant: "destructive",
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, content: `Sorry, I couldn't process your request. ${errorMessage}` }
            : msg
        )
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
      case 'Manage Account':
        router.push('/account');
        break;
      case 'Activity':
        router.push('/activity');
        break;
      case 'Help & Feedback':
        router.push('/help');
        break;
      case 'Sign Out':
        // Placeholder: In a real app, this would clear auth tokens and redirect
        toast({ title: "Signed Out", description: "You have been signed out (placeholder)." });
        router.push('/'); // Redirect to home
        break;
      default:
        toast({ title: "Profile Action", description: `${action} clicked (placeholder).` });
    }
  };

  return (
    <SidebarInset className="flex flex-col h-screen overflow-hidden p-0 md:m-0 md:rounded-none">
      <header className="flex items-center justify-between px-4 py-3 bg-transparent z-10 h-[60px] border-b border-border/50">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-semibold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 hover:opacity-80"
          >
            PyscoutAI
          </span>
          <ModelSelector
            selectedModelFromParent={currentModel}
            onModelChange={handleModelChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-sm hover:bg-primary/10 hover:border-primary transition-colors duration-200"
            onClick={() => router.push('/pricing')}
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Upgrade
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20 transition-colors duration-200">
                <CircleUserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileMenuClick('Manage Account')}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Manage Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileMenuClick('Activity')}>
                <History className="mr-2 h-4 w-4" />
                <span>Activity</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileMenuClick('Help & Feedback')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileMenuClick('Sign Out')}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {showWelcome && messages.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-0">
            <div className="text-center mb-10">
              <Bot className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2
                key={currentWelcomeMessage}
                className="text-4xl sm:text-5xl font-medium bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent text-center animate-in fade-in-0 duration-700 ease-out"
              >
                {currentWelcomeMessage}
              </h2>
            </div>
          </div>
        )}
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} textareaRef={textareaRef} />
    </SidebarInset>
  );
}
