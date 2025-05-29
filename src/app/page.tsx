
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Message, Model } from '@/types/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InputBar } from '@/components/chat/InputBar';
import { ModelSelector } from '@/components/chat/ModelSelector';
import { useToast } from "@/hooks/use-toast";
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sparkles, CircleUserRound, Bot, Brain, GalleryVerticalEnd, Image as ImageIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const SYSTEM_MESSAGE_CONTENT = 'You are PyscoutAI, a helpful and friendly assistant, inspired by Gemini.';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);

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
      // Clean up URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [searchParams, router]);

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

    const messagesForApi = [
      { role: 'system', content: SYSTEM_MESSAGE_CONTENT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
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
      const useStreaming = true; 

      const response = await fetch('https://ai4free-test.hf.space/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
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
        let apiErrorMessage = `HTTP error! status: ${response.status}`;
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
                          ? { ...msg, content: accumulatedResponse } 
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

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <SidebarInset className="flex flex-col h-screen overflow-hidden p-0 md:m-0 md:rounded-none">
      <header className="flex items-center justify-between px-4 py-3 bg-background z-10 h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">PyscoutAI</span>
          <ModelSelector
            selectedModelFromParent={currentModel}
            onModelChange={handleModelChange}
          />
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

      <div className="flex-1 flex flex-col min-h-0 relative"> {/* Key change: flex-grow to flex-1 and added min-h-0 */}
        {showWelcome && messages.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-0 animate-in fade-in duration-500 ease-out">
            <div className="text-center mb-10">
              <Bot className="h-16 w-16 text-muted-foreground mb-6 mx-auto" />
              <h2
                className="text-4xl sm:text-5xl font-medium bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center"
              >
                Hello, I'm PyscoutAI
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
