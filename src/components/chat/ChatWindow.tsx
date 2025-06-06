"use client";

import React, { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      // Defer scroll to the end of the event loop to allow DOM updates and reflow
      setTimeout(() => {
        if (viewport) {
          // Check if viewport still exists in case component unmounted
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 0);
    }
  }, [messages, isLoading]); // Rerun when messages or loading state changes

  // Hide chat window content if no messages and not loading to allow welcome message to be prominent
  if (messages.length === 0 && !isLoading) {
    return <div className="flex-grow" data-oid="g3srwqj" />; // Takes up space but shows nothing
  }
  return (
    <ScrollArea
      className="flex-grow min-h-0 w-full max-w-4xl mx-auto relative"
      viewportRef={viewportRef}
      ref={scrollAreaRef}
      data-oid="0lt8vbi"
    >
      <div className="p-4 sm:p-6 space-y-6 min-h-full" data-oid="miawf4i">
        {" "}
        {/* Increased spacing and padding */}
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          data-oid="06.w-x0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
            data-oid="0ud:-og"
          />
        </div>
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
            style={{ animationDelay: `${index * 100}ms` }}
            data-oid="alqwgli"
          >
            <MessageBubble message={msg} data-oid="u4-gy5p" />
          </div>
        ))}
        {isLoading && (
          <div
            className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
            data-oid="wg3uwh3"
          >
            <MessageBubble
              message={{
                id: "shimmer-loading",
                role: "assistant",
                content: "",
                timestamp: new Date(),
              }}
              isShimmer
              data-oid="yvsrjwy"
            />
          </div>
        )}
        {/* Spacer for better last message visibility */}
        <div className="h-4" data-oid="p7zg9vq" />
      </div>
    </ScrollArea>
  );
}
