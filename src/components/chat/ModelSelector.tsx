"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Model, ModelApiResponse } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2, ServerCrash, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

const MODEL_CACHE_KEY = 'pyscoutai_models_cache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
const API_BASE_URL = 'https://ws.typegpt.net/v1';

interface CachedModels {
  models: Model[];
  timestamp: number;
}

function parseModelName(id: string): string {
  const parts = id.split('/');
  let name = parts.length > 1 ? parts.slice(1).join('/') : id;
  name = name.replace(/-/g, ' ').split(' ').map(part => {
    if (part.toLowerCase() === 'gpt' || part.match(/[a-zA-Z]\d/)) { // Keep GPT and similar (e.g., Llama3) as uppercase
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
  onModelChange: (model: Model | null) => void;
}

export function ModelSelector({ selectedModelFromParent, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [internalSelectedModel, setInternalSelectedModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [clientHasHydrated, setClientHasHydrated] = useState(false);

  useEffect(() => {
    setClientHasHydrated(true);
  }, []);

  useEffect(() => {
    if (clientHasHydrated) {
      setInternalSelectedModel(selectedModelFromParent);
    }
  }, [selectedModelFromParent, clientHasHydrated]);

  const fetchAndCacheModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data: ModelApiResponse = await response.json();
      const parsedModels = data.data.map(m => ({ ...m, name: parseModelName(m.id) }));
      
      setModels(parsedModels);

      if (parsedModels.length > 0 && !selectedModelFromParent) {
        const defaultModel = parsedModels.find(m => m.id === "AI4Chat/default") ||
                               parsedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                               parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                               parsedModels[0];
        if (defaultModel) {
            setTimeout(() => onModelChange(defaultModel), 0);
        }
      } else if (parsedModels.length > 0 && selectedModelFromParent && !parsedModels.find(m => m.id === selectedModelFromParent.id)) {
         const defaultModel = parsedModels.find(m => m.id === "AI4Chat/default") ||
                               parsedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                               parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                               parsedModels[0];
        if (defaultModel) {
            setTimeout(() => onModelChange(defaultModel), 0);
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
                const defaultModel = parsedCachedModels.find(m => m.id === "AI4Chat/default") ||
                                       parsedCachedModels.find(m => m.id.toLowerCase().includes('gpt-4o')) ||
                                       parsedCachedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                                       parsedCachedModels[0];
                if (defaultModel) {
                  setTimeout(() => onModelChange(defaultModel), 0);
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

    if (clientHasHydrated) {
      loadModels();
    }
  }, [clientHasHydrated, selectedModelFromParent, onModelChange, fetchAndCacheModels]);


  const handleModelSelect = (modelId: string) => {
    const selectedModelObject = models.find(m => m.id === modelId);
    if (selectedModelObject) {
      onModelChange(selectedModelObject);
    }
    setOpen(false);
  };

  if (!clientHasHydrated) {
    return (
      <Button
        variant="ghost"
        className="flex items-center px-1.5 py-1 rounded-md"
        disabled={true}
        aria-label="Loading models"
      >
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </Button>
    );
  }
  
  let triggerContent: React.ReactNode;
  let triggerDisabled = false;

  if (isLoading && !internalSelectedModel && !error) {
    triggerContent = (
      <>
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
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
    triggerContent = <span className="text-sm text-muted-foreground">No Models</span>;
    triggerDisabled = true;
  } else {
    triggerContent = (
      <>
        <span className="text-sm font-medium">{internalSelectedModel?.name || 'Select Model'}</span>
        <span className="text-sm text-muted-foreground ml-1">(preview)</span>
        <ChevronsUpDown className="ml-1.5 h-4 w-4 shrink-0 opacity-60" />
      </>
    );
    triggerDisabled = isLoading && models.length === 0;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center px-2 py-1 rounded-md"
          disabled={triggerDisabled}
          aria-label={`Selected model: ${internalSelectedModel?.name || 'Select Model'}`}
        >
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Search models..." className="h-9" />
          <CommandList>
            {isLoading && models.length === 0 && clientHasHydrated && (
              <CommandEmpty>Loading models...</CommandEmpty>
            )}
            {error && clientHasHydrated && (
              <CommandEmpty className="text-destructive">{error}</CommandEmpty>
            )}
            {!isLoading && !error && models.length === 0 && clientHasHydrated && (
              <CommandEmpty>No models found</CommandEmpty>
            )}
            {!isLoading && !error && models.length > 0 && clientHasHydrated && (
              <ScrollArea viewportClassName="max-h-[260px]">
                <CommandGroup heading="Choose your model">
                  {models.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.id}
                      onSelect={() => handleModelSelect(model.id)}
                      className={cn(
                        internalSelectedModel?.id === model.id
                          ? "bg-primary text-foreground"
                          : "cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className={cn("font-medium", internalSelectedModel?.id === model.id && "text-foreground")}>
                            {model.name}
                          </span>
                          <span className={cn("text-xs mt-0.5 text-muted-foreground", internalSelectedModel?.id === model.id && "text-foreground")}>
                            Owned by: {model.owned_by}
                          </span>
                        </div>
                        {internalSelectedModel?.id === model.id && (
                          <Check className="h-4 w-4 ml-2 text-foreground shrink-0" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            )}
          </CommandList>
        </Command>
        {!isLoading && !error && models.length > 0 && clientHasHydrated && (
          <Card className="border-t">
            <CardContent className="p-3">
              <div className="flex items-center w-full mb-1">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                <CardTitle className="text-sm">Upgrade to PyscoutAI Pro</CardTitle>
              </div>
              <CardDescription className="text-xs mb-2.5">
                Get our most capable models and features
              </CardDescription>
              <Button size="sm" className="w-full bg-primary text-primary-foreground">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        )}
      </PopoverContent>
    </Popover>
  );
}

