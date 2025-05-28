"use client";

import React, { useState, useEffect } from 'react';
import type { Message } from '@/types/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InputBar } from '@/components/chat/InputBar';
import { ThemeToggle } from '@/components/chat/ThemeToggle';
import { useToast } from "@/hooks/use-toast";
import { Bot } from 'lucide-react';


const SYSTEM_MESSAGE: Message = {
  id: 'system-prompt',
  role: 'system',
  content: 'You are ChimpChat, a helpful and friendly assistant.',
  timestamp: new Date(),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
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
          model: 'gpt-3.5-turbo', // Example model
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
  
  // Add an initial greeting message from the bot
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello! I'm ChimpChat. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  }, []);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center space-x-2">
          <Bot className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">ChimpChat</h1>
        </div>
        <ThemeToggle />
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
