
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Model, ModelApiResponse } from '@/types/chat';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Loader2, ServerCrash } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

function parseModelName(id: string): string {
  const parts = id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : id;
}

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state: sidebarState } = useSidebar();

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
          setSelectedModelId(parsedModels[0].id); // Select the first model by default
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
    // Here you would typically propagate the selected model to your chat logic,
    // e.g., via a context or a callback prop.
    console.log("Selected model:", modelId);
  };

  const selectedModel = models.find(m => m.id === selectedModelId);

  const triggerLabel = selectedModel?.name || 'Select Model';

  if (isLoading && sidebarState === "expanded") {
    return (
      <Button variant="ghost" className="w-full justify-start px-2 h-9 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Models...
      </Button>
    );
  }
  
  if (isLoading && sidebarState === "collapsed") {
     return (
      <Button variant="ghost" size="icon" className="h-9 w-9 group-data-[collapsible=icon]:flex hidden">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }


  if (error && sidebarState === "expanded") {
    return (
       <Button variant="ghost" className="w-full justify-start px-2 h-9 text-sm text-destructive-foreground bg-destructive/80 hover:bg-destructive group-data-[collapsible=icon]:hidden">
        <ServerCrash className="mr-2 h-4 w-4" />
        Error loading models
      </Button>
    );
  }

   if (error && sidebarState === "collapsed") {
     return (
      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive-foreground bg-destructive/80 hover:bg-destructive group-data-[collapsible=icon]:flex hidden">
        <ServerCrash className="h-4 w-4" />
      </Button>
    );
  }

  if (models.length === 0 && !isLoading && sidebarState === "expanded") {
    return <p className="px-2 py-1 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">No models available.</p>;
  }
  
  if (models.length === 0 && !isLoading && sidebarState === "collapsed") {
    return null; // Or a placeholder icon if preferred
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between px-2 h-9 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          aria-label={`Selected model: ${triggerLabel}`}
        >
          <span className="truncate group-data-[collapsible=icon]:hidden">{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
           <span className="group-data-[collapsible=icon]:flex hidden items-center justify-center w-full h-full">
            {selectedModel?.name?.substring(0,1).toUpperCase() || 'M'} 
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border-border shadow-xl" align="start">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Choose your model</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={selectedModelId || undefined} onValueChange={handleModelSelect}>
          {models.map((model) => (
            <DropdownMenuRadioItem 
              key={model.id} 
              value={model.id} 
              className="text-sm cursor-pointer py-2 px-2 data-[state=checked]:font-semibold"
            >
              <div className="flex flex-col w-full">
                <span>{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  Owned by: {model.owned_by}
                </span>
              </div>
               {/* Check icon is handled by DropdownMenuRadioItem's indicator */}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="my-1 bg-border" />
        <DropdownMenuItem className="p-0">
            <div className="flex flex-col items-start px-2 py-2 w-full">
                <p className="font-semibold text-sm">Upgrade to ChimpChat Pro</p>
                <p className="text-xs text-muted-foreground mb-2">Get our most capable models and features</p>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Upgrade
                </Button>
            </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
