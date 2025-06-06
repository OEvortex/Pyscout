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
        data-oid="treai89"
      >
        {!isUser && (
          <Avatar
            className="h-10 w-10 shrink-0 border-2 border-primary/20 shadow-lg"
            data-oid="3u569cc"
          >
            <AvatarFallback
              className="bg-gradient-to-br from-primary to-purple-500 text-white"
              data-oid="nseo5u0"
            >
              <Bot className="h-5 w-5" data-oid="3lcux0i" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn("max-w-[75%] sm:max-w-[70%]")} data-oid="7f_5iq2">
          <div
            className="bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-sm rounded-3xl p-5 space-y-3 border border-border/50 shadow-lg"
            data-oid="7bjpwu7"
          >
            <div
              className="h-4 bg-muted-foreground/20 rounded-full w-3/4 animate-pulse"
              data-oid="znjysjp"
            ></div>
            <div
              className="h-4 bg-muted-foreground/20 rounded-full w-1/2 animate-pulse"
              data-oid="tm7xi.c"
            ></div>
            <div
              className="h-3 bg-muted-foreground/15 rounded-full w-2/3 animate-pulse"
              data-oid="nvvoaii"
            ></div>
          </div>
        </div>
        {isUser && (
          <Avatar
            className="h-10 w-10 self-start shrink-0 border-2 border-accent/20 shadow-lg"
            data-oid=".zan0r9"
          >
            <AvatarFallback
              className="bg-gradient-to-br from-accent to-orange-500 text-white"
              data-oid="7w2d_a8"
            >
              <User className="h-5 w-5" data-oid="sw02xhi" />
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
      data-oid=".:.:r3y"
    >
      {!isUser && (
        <Avatar
          className="h-10 w-10 self-start shrink-0 border-2 border-primary/20 shadow-lg hover:scale-105 transition-transform duration-200"
          data-oid="_9ds1q1"
        >
          <AvatarFallback
            className="bg-gradient-to-br from-primary to-purple-500 text-white"
            data-oid="whyv:_3"
          >
            <Bot className="h-5 w-5" data-oid="huy6olu" />
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
        data-oid="7.ovuie"
      >
        <div
          className="break-words prose prose-sm dark:prose-invert max-w-none prose-p:mb-3 prose-p:last:mb-0 prose-ul:my-3 prose-ul:ml-2 prose-ul:list-inside prose-ol:my-3 prose-ol:ml-2 prose-ol:list-inside prose-code:bg-muted/90 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-xs prose-pre:bg-muted/90 prose-pre:p-4 prose-pre:rounded-xl prose-pre:text-xs prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border/50"
          data-oid="bt-sg8x"
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p
                  className="mb-3 last:mb-0 leading-relaxed"
                  {...props}
                  data-oid="msl-uc."
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside my-3 ml-4 space-y-1.5"
                  {...props}
                  data-oid="_wy.8rd"
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside my-3 ml-4 space-y-1.5"
                  {...props}
                  data-oid="qc4s5s0"
                />
              ),
              strong: ({ node, ...props }) => (
                <strong
                  className="font-semibold"
                  {...props}
                  data-oid="oxp5hg3"
                />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !props.inline && match ? (
                  <pre
                    className="bg-muted/90 dark:bg-muted/80 p-4 my-3 rounded-xl text-xs overflow-x-auto border border-border/50 shadow-inner"
                    data-oid="doad5ex"
                  >
                    <code className={className} {...props} data-oid="d-pd1li">
                      {String(children).replace(/\n$/, "")}
                    </code>
                  </pre>
                ) : (
                  <code
                    className="bg-muted/90 dark:bg-muted/80 px-2 py-1 rounded-lg text-xs font-medium"
                    {...props}
                    data-oid="x1dmq6f"
                  >
                    {children}
                  </code>
                );
              },
            }}
            data-oid="rei60_u"
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
            data-oid="byykhwz"
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
          data-oid="ifx:7cj"
        >
          <AvatarFallback
            className="bg-gradient-to-br from-accent to-orange-500 text-white"
            data-oid="wportb."
          >
            <User className="h-5 w-5" data-oid="yyr:037" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});
