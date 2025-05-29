
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
  let name = parts.length > 1 ? parts.slice(1).join('/') : id;
  name = name.replace(/-/g, ' ').split(' ').map(part => {
    if (part.toLowerCase() === 'gpt' || part.match(/[a-zA-Z]\d/)) {
      return part.toUpperCase();
    }
    if (part.length > 0) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return "";
  }).join(' ');
  return name;
}

interface ModelSelectorProps {
  selectedModelFromParent: Model | null;
  onModelChange: (model: Model) => void;
}

export function ModelSelector({ selectedModelFromParent, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [internalSelectedModelId, setInternalSelectedModelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clientHasHydrated, setClientHasHydrated] = useState(false);

  useEffect(() => {
    setClientHasHydrated(true);
  }, []);

  useEffect(() => {
    if (clientHasHydrated) {
      setInternalSelectedModelId(selectedModelFromParent?.id || null);
    }
  }, [selectedModelFromParent, clientHasHydrated]);

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

      if (parsedModels.length > 0 && !selectedModelFromParent) {
        const defaultModel = parsedModels.find(m => m.id === "AI4Chat/default");
        const preferredModel = defaultModel ||
                               parsedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                               parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                               parsedModels[0];
        if (preferredModel) {
            setTimeout(() => onModelChange(preferredModel), 0);
        }
      } else if (parsedModels.length > 0 && selectedModelFromParent && !parsedModels.find(m => m.id === selectedModelFromParent.id)) {
        const defaultModel = parsedModels.find(m => m.id === "AI4Chat/default");
        const preferredModel = defaultModel ||
                               parsedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                               parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                               parsedModels[0];
        if (preferredModel) {
            setTimeout(() => onModelChange(preferredModel), 0);
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(MODEL_CACHE_KEY, JSON.stringify({ models: parsedModels, timestamp: Date.now() }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, [selectedModelFromParent, onModelChange]);

  useEffect(() => {
    const loadModels = async () => {
      if (!clientHasHydrated) {
        return;
      }

      setIsLoading(true); 
      setError(null);
      let loadedFromCache = false;

      if (typeof window !== 'undefined') {
        try {
          const cachedDataString = localStorage.getItem(MODEL_CACHE_KEY);
          if (cachedDataString) {
            const cachedData = JSON.parse(cachedDataString) as CachedModels;
            if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS && cachedData.models.length > 0) {
              const parsedCachedModels = cachedData.models.map(m => ({ ...m, name: m.name || parseModelName(m.id) }));
              setModels(parsedCachedModels);
              if (!selectedModelFromParent && parsedCachedModels.length > 0) {
                const defaultModel = parsedCachedModels.find(m => m.id === "AI4Chat/default");
                const preferredModel = defaultModel ||
                                       parsedCachedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                                       parsedCachedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                                       parsedCachedModels[0];
                if (preferredModel) {
                  setTimeout(() => onModelChange(preferredModel), 0);
                }
              }
              setTimeout(() => setIsLoading(false), 0);
              loadedFromCache = true;
            }
          }
        } catch (e) {
          console.error("Failed to read or parse model cache:", e);
          if (typeof window !== 'undefined') localStorage.removeItem(MODEL_CACHE_KEY);
        }
      }

      if (!loadedFromCache) {
        await fetchAndCacheModels();
      }
    };

    loadModels();
  }, [clientHasHydrated, selectedModelFromParent, onModelChange, fetchAndCacheModels]);


  const handleModelSelect = (modelId: string) => {
    const selectedModelObject = models.find(m => m.id === modelId);
    if (selectedModelObject) {
      onModelChange(selectedModelObject);
    }
    setIsOpen(false); 
  };

  if (!clientHasHydrated) {
    return (
      <Button
        variant="ghost"
        className="flex items-center px-1.5 py-1 h-auto rounded-md hover:bg-accent/20 data-[state=open]:bg-accent/30 focus-visible:ring-1 focus-visible:ring-ring"
        disabled={true}
        aria-label="Loading models"
      >
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </Button>
    );
  }

  const selectedModelForDisplay = models.find(m => m.id === internalSelectedModelId);
  
  let triggerContent: React.ReactNode;
  let triggerDisabled = false;

  if (isLoading && !selectedModelForDisplay && !error) {
    triggerContent = (
      <>
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </>
    );
    triggerDisabled = true;
  } else if (error) {
    triggerContent = (
      <>
        <ServerCrash className="mr-1.5 h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Error</span>
      </>
    );
    triggerDisabled = true;
  } else if (models.length === 0 && !isLoading) {
    triggerContent = <span className="text-sm">No Models</span>;
    triggerDisabled = true;
  } else {
    triggerContent = (
      <>
        <span className="text-sm font-medium">{selectedModelForDisplay?.name || 'Select Model'}</span>
        <span className="text-sm text-muted-foreground ml-1">(preview)</span>
        <ChevronDown className={cn("ml-1.5 h-4 w-4 shrink-0 opacity-60 transition-transform duration-200", isOpen && "rotate-180")} />
      </>
    );
     triggerDisabled = isLoading && models.length === 0; 
  }


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center px-1.5 py-1 h-auto rounded-md hover:bg-accent/20 data-[state=open]:bg-accent/30 focus-visible:ring-1 focus-visible:ring-ring"
          disabled={triggerDisabled}
          aria-label={`Selected model: ${selectedModelForDisplay?.name || 'Select Model'}`}
        >
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn(
            "w-72 sm:w-80 bg-popover text-popover-foreground border-border shadow-xl p-2", 
            "z-50 rounded-lg", 
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        )}
        align="start"
      >
        {isLoading && models.length === 0 && clientHasHydrated && <DropdownMenuLabel className="text-muted-foreground text-center py-2">Loading models...</DropdownMenuLabel>}
        {error && clientHasHydrated && <DropdownMenuLabel className="text-destructive text-center py-2">{error}</DropdownMenuLabel>}
        {!isLoading && !error && models.length === 0 && clientHasHydrated && <DropdownMenuLabel className="text-muted-foreground text-center py-2">No models found</DropdownMenuLabel>}
        
        {!isLoading && !error && models.length > 0 && clientHasHydrated && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 pt-1 pb-2">Choose your model</DropdownMenuLabel>
            <ScrollArea viewportClassName="max-h-[260px]" className="pr-1"> 
              <div className="space-y-1">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onSelect={() => handleModelSelect(model.id)}
                    className={cn(
                      "text-sm cursor-pointer py-2 px-3 rounded-md focus:bg-accent/80 focus:text-accent-foreground",
                      internalSelectedModelId === model.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className={cn("font-medium", internalSelectedModelId === model.id && "text-primary")}>{model.name}</span>
                        <span className="text-xs text-muted-foreground/80 mt-0.5">
                          Owned by: {model.owned_by}
                        </span>
                      </div>
                      {internalSelectedModelId === model.id && <Check className="h-4 w-4 ml-2 text-primary shrink-0" />}
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

    

    