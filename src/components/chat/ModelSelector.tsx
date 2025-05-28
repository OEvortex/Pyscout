
"use client";

import React, { useState, useEffect } from 'react';
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
import { Check, ChevronDown, Loader2, ServerCrash, Sparkles, Bot as ModelIcon } from 'lucide-react'; // Added Sparkles, ModelIcon
import { cn } from '@/lib/utils';

function parseModelName(id: string): string {
  const parts = id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : id;
}

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
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
        if (parsedModels.length > 0) {
          const preferredModel = parsedModels.find(m => m.id.toLowerCase().includes('flash')) ||
                                 parsedModels.find(m => m.id.toLowerCase().includes('default')) ||
                                 parsedModels[0];
          setSelectedModelId(preferredModel.id);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
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
        <ServerCrash className="mr-2 h-4 w-4" />
        Error
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
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-base font-medium flex items-center px-2 py-1 h-auto"
          disabled={triggerDisabled}
          aria-label={`Selected model: ${selectedModel?.name || 'Select Model'}`}
        >
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 sm:w-80 bg-card border-border shadow-xl" 
        align="start"
      >
        {isLoading && <DropdownMenuLabel className="text-muted-foreground text-center py-2">Loading...</DropdownMenuLabel>}
        {error && <DropdownMenuLabel className="text-destructive text-center py-2">Error loading models</DropdownMenuLabel>}
        {!isLoading && !error && models.length === 0 && <DropdownMenuLabel className="text-muted-foreground text-center py-2">No models found</DropdownMenuLabel>}
        
        {!isLoading && !error && models.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Choose your model</DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onSelect={() => handleModelSelect(model.id)}
                className={cn(
                  "text-sm cursor-pointer py-2 px-3 focus:bg-accent/80 focus:text-accent-foreground",
                  selectedModelId === model.id && "bg-accent/50"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className={cn("font-medium", selectedModelId === model.id && "text-primary")}>{model.name}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Owned by: {model.owned_by}
                    </span>
                  </div>
                  {selectedModelId === model.id && <Check className="h-4 w-4 ml-2 text-primary" />}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1 bg-border/70" />
            <DropdownMenuItem className="p-0 focus:bg-transparent cursor-default select-none">
                <div className="flex flex-col items-start px-3 py-2.5 w-full rounded-md hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center w-full mb-1">
                        <Sparkles className="h-4 w-4 mr-2 text-primary group-hover:text-accent-foreground" />
                        <p className="font-semibold text-sm text-foreground group-hover:text-accent-foreground">Upgrade to ChimpChat Pro</p>
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
