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
      <TooltipProvider data-oid="nszpcib">
        <Tooltip data-oid="syoguii">
          <TooltipTrigger asChild data-oid="jy0kjaz">
            <div
              className={cn(
                "flex items-center gap-1 text-xs transition-colors duration-200",
                colorClass,
                className,
              )}
              data-oid="x_-gklk"
            >
              <Hash className="h-3 w-3" data-oid="epot1:1" />
              <span className="font-medium" data-oid="fusxkvo">
                {formatTokenCount(tokenInfo.tokens)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-card/95 backdrop-blur-sm border-border/50"
            data-oid="7f2vnw_"
          >
            <div className="space-y-1" data-oid="_ihs803">
              <p className="font-medium" data-oid="ifdkt62">
                {description}
              </p>
              <div className="text-xs space-y-0.5" data-oid=":lujp9:">
                <p data-oid="ursqnq:">
                  Tokens:{" "}
                  <span className="font-medium" data-oid="yjy_zeq">
                    {tokenInfo.tokens}
                  </span>
                </p>
                <p data-oid="-uoq508">
                  Words:{" "}
                  <span className="font-medium" data-oid="f6ieof:">
                    {tokenInfo.words}
                  </span>
                </p>
                <p data-oid="c49ki3u">
                  Characters:{" "}
                  <span className="font-medium" data-oid="_f2skvh">
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
    <div
      className={cn("flex items-center gap-2", className)}
      data-oid="5davgc3"
    >
      <Badge
        variant="outline"
        className={cn(
          "text-xs font-medium border transition-all duration-200 hover:scale-105",
          tokenInfo.tokens > 0 ? colorClass : "text-muted-foreground",
          tokenInfo.tokens > 2000 && "animate-pulse",
        )}
        data-oid="ur8.odh"
      >
        <Hash className="h-3 w-3 mr-1" data-oid="7d79uxw" />
        {formatTokenCount(tokenInfo.tokens)} tokens
      </Badge>

      {showDetails && tokenInfo.tokens > 0 && (
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground"
          data-oid="_vi4t.z"
        >
          <span data-oid=".wfojpv">{tokenInfo.words} words</span>
          <span data-oid="w4g8kq9">•</span>
          <span data-oid="7d4fnkp">{tokenInfo.charactersWithSpaces} chars</span>
        </div>
      )}

      {tokenInfo.tokens > 3000 && (
        <TooltipProvider data-oid="li8egr-">
          <Tooltip data-oid="p4mguh8">
            <TooltipTrigger asChild data-oid="s-tfl--">
              <div
                className="flex items-center text-amber-500"
                data-oid="06q6h::"
              >
                <Zap className="h-3 w-3" data-oid="d:znimm" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="bg-card/95 backdrop-blur-sm border-border/50"
              data-oid="yfqc3vp"
            >
              <p className="text-xs" data-oid="x:h:r56">
                Very long message - may hit token limits
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
