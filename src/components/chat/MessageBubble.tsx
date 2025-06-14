"use client";

import React, { useState, useEffect } from "react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Partial<Message> & { id: string };
  isShimmer?: boolean;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  isShimmer = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (isShimmer) {
    return (
      <div
        className={cn(
          "flex items-start space-x-4 py-4 animate-pulse",
          !isUser ? "justify-start" : "justify-end pl-12 pr-4 sm:pl-16",
        )}
        data-oid="tskmt7-"
      >
        {!isUser && (
          <Avatar
            className="h-10 w-10 shrink-0 border-2 border-primary/20 shadow-lg"
            data-oid="dkf86_7"
          >
            <AvatarFallback
              className="bg-gradient-to-br from-primary to-purple-500 text-white"
              data-oid="a.ep00n"
            >
              <Bot className="h-5 w-5" data-oid="i909lhu" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn("max-w-[75%] sm:max-w-[70%]")} data-oid="_2._p5b">
          <div
            className="bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-sm rounded-3xl p-5 space-y-3 border border-border/50 shadow-lg"
            data-oid="6s4c60m"
          >
            <div
              className="h-4 bg-muted-foreground/20 rounded-full w-3/4 animate-pulse"
              data-oid="ol:_4ns"
            ></div>
            <div
              className="h-4 bg-muted-foreground/20 rounded-full w-1/2 animate-pulse"
              data-oid="ecd-6v3"
            ></div>
            <div
              className="h-3 bg-muted-foreground/15 rounded-full w-2/3 animate-pulse"
              data-oid="02frfv3"
            ></div>
          </div>
        </div>
        {isUser && (
          <Avatar
            className="h-10 w-10 self-start shrink-0 border-2 border-accent/20 shadow-lg"
            data-oid="fd-ydmc"
          >
            <AvatarFallback
              className="bg-gradient-to-br from-accent to-orange-500 text-white"
              data-oid="sohrokd"
            >
              <User className="h-5 w-5" data-oid="fj6:m72" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }

  if (!message.content && message.role === "assistant" && !isShimmer)
    return null;
  if (!message.content && message.role !== "assistant") return null;

  return (
    <div
      className={cn(
        "flex items-end space-x-4 py-3 animate-in fade-in-0 slide-in-from-bottom-6 duration-500 ease-out",
        isUser
          ? "justify-end pl-12 pr-4 sm:pl-16"
          : "justify-start pr-12 pl-4 sm:pr-16",
      )}
      data-oid="74styrb"
    >
      {!isUser && (
        <Avatar
          className="h-10 w-10 self-start shrink-0 border-2 border-primary/20 shadow-lg hover:scale-105 transition-transform duration-200"
          data-oid="qxcsosl"
        >
          <AvatarFallback
            className="bg-gradient-to-br from-primary to-purple-500 text-white"
            data-oid="k3uu.n9"
          >
            <Bot className="h-5 w-5" data-oid="3t:f5uy" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] sm:max-w-[70%] rounded-3xl p-5 text-sm shadow-xl border backdrop-blur-sm",
          isUser
            ? "bg-gradient-to-br from-primary via-primary to-purple-600 text-white border-primary/30 shadow-primary/20"
            : "bg-gradient-to-br from-card/90 to-card/80 text-card-foreground border-border/50 shadow-card/20",
        )}
        data-oid="cs4842b"
      >
        <div
          className="break-words prose prose-sm dark:prose-invert max-w-none prose-p:mb-3 prose-p:last:mb-0 prose-ul:my-3 prose-ul:ml-2 prose-ul:list-inside prose-ol:my-3 prose-ol:ml-2 prose-ol:list-inside prose-code:bg-muted/90 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-xs prose-pre:bg-muted/90 prose-pre:p-4 prose-pre:rounded-xl prose-pre:text-xs prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border/50"
          data-oid="vtg_m3i"
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p
                  className="mb-3 last:mb-0 leading-relaxed"
                  {...props}
                  data-oid="cmn.xp3"
                />
              ),

              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside my-3 ml-4 space-y-1.5"
                  {...props}
                  data-oid="_tdwf_l"
                />
              ),

              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside my-3 ml-4 space-y-1.5"
                  {...props}
                  data-oid="oq9fqjt"
                />
              ),

              strong: ({ node, ...props }) => (
                <strong
                  className="font-semibold"
                  {...props}
                  data-oid="8l2hexi"
                />
              ),

              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !props.inline && match ? (
                  <pre
                    className="bg-muted/90 dark:bg-muted/80 p-4 my-3 rounded-xl text-xs overflow-x-auto border border-border/50 shadow-inner"
                    data-oid="sli7-nd"
                  >
                    <code className={className} {...props} data-oid="26_62lw">
                      {String(children).replace(/\n$/, "")}
                    </code>
                  </pre>
                ) : (
                  <code
                    className="bg-muted/90 dark:bg-muted/80 px-2 py-1 rounded-lg text-xs font-medium"
                    {...props}
                    data-oid="iekh.x."
                  >
                    {children}
                  </code>
                );
              },
            }}
            data-oid="es_6ct9"
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {hasMounted && message.timestamp && (
          <p
            className={cn(
              "text-xs mt-3 opacity-70",
              isUser
                ? "text-white/80 text-right"
                : "text-muted-foreground text-left",
            )}
            data-oid="rgivpko"
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar
          className="h-10 w-10 self-start shrink-0 border-2 border-accent/20 shadow-lg hover:scale-105 transition-transform duration-200"
          data-oid="523i1al"
        >
          <AvatarFallback
            className="bg-gradient-to-br from-accent to-orange-500 text-white"
            data-oid=":_fx..d"
          >
            <User className="h-5 w-5" data-oid="5vuwlic" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});
