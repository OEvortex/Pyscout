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
    return <div className="flex-grow" data-oid="pqhaja_" />; // Takes up space but shows nothing
  }
  return (
    <ScrollArea
      className="flex-grow min-h-0 w-full max-w-4xl mx-auto relative"
      viewportRef={viewportRef}
      ref={scrollAreaRef}
      data-oid="ii2laxq"
    >
      <div className="p-4 sm:p-6 space-y-6 min-h-full" data-oid="9k9mw00">
        {" "}
        {/* Increased spacing and padding */}
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          data-oid="sp:sbu1"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
            data-oid="y:wbogy"
          />
        </div>
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
            style={{ animationDelay: `${index * 100}ms` }}
            data-oid="1z4k6uf"
          >
            <MessageBubble message={msg} data-oid="191.tkc" />
          </div>
        ))}
        {isLoading && (
          <div
            className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
            data-oid="gj9fk4e"
          >
            <MessageBubble
              message={{
                id: "shimmer-loading",
                role: "assistant",
                content: "",
                timestamp: new Date(),
              }}
              isShimmer
              data-oid="l-j--qa"
            />
          </div>
        )}
        {/* Spacer for better last message visibility */}
        <div className="h-4" data-oid="jrltl5-" />
      </div>
    </ScrollArea>
  );
}
