"use client";

import React, { useMemo } from "react";
import { Hash, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  estimateTokenCount,
  getTokenCountColor,
  formatTokenCount,
  getTokenCountDescription,
} from "@/lib/tokenCounter";

interface TokenCounterProps {
  text: string;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export function TokenCounter({
  text,
  className,
  showDetails = false,
  compact = false,
}: TokenCounterProps) {
  const tokenInfo = useMemo(() => estimateTokenCount(text), [text]);

  if (tokenInfo.tokens === 0 && !showDetails) {
    return null;
  }

  const colorClass = getTokenCountColor(tokenInfo.tokens);
  const description = getTokenCountDescription(tokenInfo.tokens);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1 text-xs transition-colors duration-200",
                colorClass,
                className,
              )}
            >
              <Hash className="h-3 w-3" />
              <span className="font-medium">
                {formatTokenCount(tokenInfo.tokens)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-card/95 backdrop-blur-sm border-border/50">
            <div className="space-y-1">
              <p className="font-medium">{description}</p>
              <div className="text-xs space-y-0.5">
                <p>
                  Tokens:{" "}
                  <span className="font-medium">{tokenInfo.tokens}</span>
                </p>
                <p>
                  Words: <span className="font-medium">{tokenInfo.words}</span>
                </p>
                <p>
                  Characters:{" "}
                  <span className="font-medium">
                    {tokenInfo.charactersWithSpaces}
                  </span>
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn(
          "text-xs font-medium border transition-all duration-200 hover:scale-105",
          tokenInfo.tokens > 0 ? colorClass : "text-muted-foreground",
          tokenInfo.tokens > 2000 && "animate-pulse",
        )}
      >
        <Hash className="h-3 w-3 mr-1" />
        {formatTokenCount(tokenInfo.tokens)} tokens
      </Badge>

      {showDetails && tokenInfo.tokens > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{tokenInfo.words} words</span>
          <span>•</span>
          <span>{tokenInfo.charactersWithSpaces} chars</span>
        </div>
      )}

      {tokenInfo.tokens > 3000 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-amber-500">
                <Zap className="h-3 w-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card/95 backdrop-blur-sm border-border/50">
              <p className="text-xs">
                Very long message - may hit token limits
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
