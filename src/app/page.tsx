
"use client";

import React, { useState, useEffect } from 'react';
import type { Message } from '@/types/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InputBar } from '@/components/chat/InputBar';
import { ModelSelector } from '@/components/chat/ModelSelector';
import { useToast } from "@/hooks/use-toast";
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sparkles, CircleUserRound, Bot } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const SYSTEM_MESSAGE: Message = {
  id: 'system-prompt',
  role: 'system',
  content: 'You are PyscoutAI, a helpful and friendly assistant, inspired by Gemini.',
  timestamp: new Date(),
};

const SUGGESTION_CARDS = [
  { title: "Create an app", subtitle: "for tracking tasks", prompt: "Create an app for tracking tasks", dataAiHint: "app development" },
  { title: "Write a screenplay", subtitle: "for a Chemistry 101 video", prompt: "Write a screenplay for a Chemistry 101 video", dataAiHint: "script writing" },
  { title: "Write requirements for", subtitle: "a fitness tracking app", prompt: "Write requirements for a fitness tracking app", dataAiHint: "fitness health" },
  { title: "Design an interactive", subtitle: "kaleidoscope", prompt: "Design an interactive kaleidoscope", dataAiHint: "art design" },
];


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false); 

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0 && !isLoading) {
        setShowWelcome(true);
      }
    }, 100); 
    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  useEffect(() => {
    const newChatParam = searchParams.get('newChat');
    if (newChatParam === 'true') {
      setMessages([]);
      setIsLoading(false);
      setShowWelcome(true); 
      const currentPath = window.location.pathname;
      router.replace(currentPath, { scroll: false }); 
    }
  }, [searchParams, router]);


  const handleSendMessage = async (content: string) => {
    setShowWelcome(false); 
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    const messagesForApi = [SYSTEM_MESSAGE, ...messages, newUserMessage].map(m => ({role: m.role, content: m.content}));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesForApi,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReplyContent = data.choices?.[0]?.message?.content;

      if (botReplyContent) {
        const newBotMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: botReplyContent,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } else {
        throw new Error("Received an empty response from the assistant.");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to get response from assistant: ${errorMessage}`,
        variant: "destructive",
      });
       const errorBotMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "Sorry, I couldn't process your request right now. Please try again later.",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SidebarInset className="flex flex-col h-screen overflow-hidden p-0 md:m-0 md:rounded-none">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-background z-10 h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">PyscoutAI</span>
          <ModelSelector />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <CircleUserRound className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col relative">
        {showWelcome && messages.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-0 animate-in fade-in duration-500 ease-out">
            <div className="text-center"> {/* Wrapper for centering */}
              <Bot className="h-16 w-16 text-muted-foreground mb-6 mx-auto" />
              <h2 
                className="text-4xl sm:text-5xl font-medium bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center mb-10"
              >
                Hello, I'm PyscoutAI
              </h2>
            </div>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 max-w-4xl mx-auto">
              {SUGGESTION_CARDS.map((item) => (
                <Button
                  key={item.title}
                  variant="outline"
                  className="bg-card hover:bg-card/90 border-border text-card-foreground h-auto p-3.5 rounded-xl flex flex-col items-start text-left w-full min-w-[180px] sm:min-w-[200px]"
                  onClick={() => handleSendMessage(item.prompt)}
                  data-ai-hint={item.dataAiHint}
                >
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className="text-xs text-muted-foreground mt-1">{item.subtitle}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </SidebarInset>
  );
}
