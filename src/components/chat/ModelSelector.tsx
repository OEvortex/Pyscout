
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Model, ModelApiResponse } from '@/types/chat';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronDown, Loader2, ServerCrash, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODEL_CACHE_KEY = 'pyscoutai_models_cache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface CachedModels {
  models: Model[];
  timestamp: number;
}

function parseModelName(id: string): string {
  const parts = id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : id;
}

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAndCacheModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ai4free-test.hf.space/v1/models');
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data: ModelApiResponse = await response.json();
      const parsedModels = data.data.map(m => ({ ...m, name: parseModelName(m.id) }));
      
      setModels(parsedModels);
      if (parsedModels.length > 0 && !selectedModelId) {
        const preferredModel = parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                               parsedModels.find(m => m.id.toLowerCase().includes('default')) ||
                               parsedModels[0];
        setSelectedModelId(preferredModel.id);
      }

      // Cache the fetched models
      if (typeof window !== 'undefined') {
        localStorage.setItem(MODEL_CACHE_KEY, JSON.stringify({ models: parsedModels, timestamp: Date.now() }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [selectedModelId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedDataString = localStorage.getItem(MODEL_CACHE_KEY);
        if (cachedDataString) {
          const cachedData = JSON.parse(cachedDataString) as CachedModels;
          if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS && cachedData.models.length > 0) {
            setModels(cachedData.models);
            if (!selectedModelId && cachedData.models.length > 0) {
              const preferredModel = cachedData.models.find(m => m.id.toLowerCase().includes('flash')) ||
                                     cachedData.models.find(m => m.id.toLowerCase().includes('default')) ||
                                     cachedData.models[0];
              setSelectedModelId(preferredModel.id);
            }
            setIsLoading(false);
            return; // Use cached data
          }
        }
      } catch (e) {
        console.error("Failed to read or parse model cache:", e);
        localStorage.removeItem(MODEL_CACHE_KEY); // Clear corrupted cache
      }
    }
    // If no valid cache, or cache is stale, fetch models
    fetchAndCacheModels();
  }, [fetchAndCacheModels, selectedModelId]);


  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsOpen(false); // Close dropdown after selection
    // console.log("Selected model:", modelId);
  };

  const selectedModel = models.find(m => m.id === selectedModelId);
  
  let triggerContent: React.ReactNode;
  let triggerDisabled = false;

  if (isLoading) {
    triggerContent = (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Models...
      </>
    );
    triggerDisabled = true;
  } else if (error) {
    triggerContent = (
      <>
        <ServerCrash className="mr-2 h-4 w-4 text-destructive" />
        <span className="text-destructive">Error</span>
      </>
    );
    triggerDisabled = true;
  } else if (models.length === 0) {
    triggerContent = "No Models Available";
    triggerDisabled = true;
  } else {
    triggerContent = (
      <>
        {selectedModel?.name || 'Select Model'}
        <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
      </>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-base font-medium flex items-center px-3 py-1.5 h-auto rounded-md hover:bg-accent/70 data-[state=open]:bg-accent/90"
          disabled={triggerDisabled}
          aria-label={`Selected model: ${selectedModel?.name || 'Select Model'}`}
        >
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn(
            "w-72 sm:w-80 bg-card text-card-foreground border-border shadow-xl p-2", // Increased padding
            "z-50 rounded-lg", 
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        )}
        align="start"
      >
        {isLoading && <DropdownMenuLabel className="text-muted-foreground text-center py-2">Loading...</DropdownMenuLabel>}
        {error && <DropdownMenuLabel className="text-destructive text-center py-2">{error}</DropdownMenuLabel>}
        {!isLoading && !error && models.length === 0 && <DropdownMenuLabel className="text-muted-foreground text-center py-2">No models found</DropdownMenuLabel>}
        
        {!isLoading && !error && models.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 pt-1 pb-2">Choose your model</DropdownMenuLabel>
            <ScrollArea viewportClassName="max-h-[260px]" className="pr-2"> {/* Approx 6-7 items at ~38px each + padding */}
              <div className="space-y-1">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onSelect={() => handleModelSelect(model.id)}
                    className={cn(
                      "text-sm cursor-pointer py-2 px-3 rounded-md focus:bg-accent/80 focus:text-accent-foreground",
                      selectedModelId === model.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className={cn("font-medium", selectedModelId === model.id && "text-primary")}>{model.name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          Owned by: {model.owned_by}
                        </span>
                      </div>
                      {selectedModelId === model.id && <Check className="h-4 w-4 ml-2 text-primary shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </ScrollArea>
            <DropdownMenuSeparator className="my-2 bg-border/70" />
            <DropdownMenuItem className="p-0 focus:bg-transparent cursor-default select-none rounded-md">
                <div className="flex flex-col items-start px-3 py-2.5 w-full rounded-md hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center w-full mb-1">
                        <Sparkles className="h-4 w-4 mr-2 text-primary group-hover:text-accent-foreground" />
                        <p className="font-semibold text-sm text-foreground group-hover:text-accent-foreground">Upgrade to PyscoutAI Pro</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2.5 group-hover:text-accent-foreground/80">Get our most capable models and features</p>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:bg-accent-foreground group-hover:text-accent">
                        Upgrade
                    </Button>
                </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

