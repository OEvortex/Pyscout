
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
          // Try to select a model that includes "flash" or "default" preferentially, otherwise the first.
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
    console.log("Selected model:", modelId);
  };

  const selectedModel = models.find(m => m.id === selectedModelId);
  const triggerLabel = selectedModel?.name || 'Select Model';

  // Common classes for loading/error states when sidebar is expanded
  const commonExpandedMessageClass = "w-full justify-start px-2 h-9 text-sm group-data-[collapsible=icon]:hidden";
  // Common classes for loading/error states when sidebar is collapsed (icon only)
  const commonCollapsedIconClass = "h-9 w-9 group-data-[collapsible=icon]:flex hidden";

  if (isLoading) {
    return (
      <>
        <Button variant="ghost" className={cn(commonExpandedMessageClass, "text-muted-foreground")}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Models...
        </Button>
        <Button variant="ghost" size="icon" className={cn(commonCollapsedIconClass, "text-muted-foreground")}>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Button variant="ghost" className={cn(commonExpandedMessageClass, "text-destructive-foreground bg-destructive/80 hover:bg-destructive")}>
          <ServerCrash className="mr-2 h-4 w-4" />
          Error loading
        </Button>
        <Button variant="ghost" size="icon" className={cn(commonCollapsedIconClass, "text-destructive-foreground bg-destructive/80 hover:bg-destructive")}>
          <ServerCrash className="h-4 w-4" />
        </Button>
      </>
    );
  }
  
  if (models.length === 0 && !isLoading) {
     return (
      <>
        <p className={cn("px-2 py-1 text-sm text-muted-foreground", sidebarState === 'collapsed' ? 'hidden' : 'block group-data-[collapsible=icon]:hidden')}>
          No models.
        </p>
         {/* Optionally, an icon for collapsed state if no models */}
        <span className={cn("h-9 w-9 group-data-[collapsible=icon]:flex hidden items-center justify-center text-muted-foreground", sidebarState === 'expanded' ? 'hidden' : 'block')}>?</span>
      </>
     );
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost" // Base variant, specific styles below
          className={cn(
            "text-sm font-medium rounded-md flex items-center transition-colors duration-150 ease-in-out",
            // Expanded state:
            "group-data-[collapsible=icon]:hidden px-3 py-1.5 h-auto bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
            // Collapsed state:
            "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-sidebar-accent group-data-[collapsible=icon]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar"
          )}
          aria-label={`Selected model: ${triggerLabel}`}
        >
          <span className="truncate group-data-[collapsible=icon]:hidden">{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 ml-2 shrink-0 group-data-[collapsible=icon]:hidden" />
          {/* Collapsed view: First letter of model name or 'M' */}
          <span className="group-data-[collapsible=icon]:flex hidden items-center justify-center w-full h-full font-medium">
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
              className="text-sm cursor-pointer py-2 px-2 data-[state=checked]:font-semibold hover:bg-accent/50 focus:bg-accent/60"
            >
              <div className="flex flex-col w-full">
                <span>{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  Owned by: {model.owned_by}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="my-1 bg-border" />
        <DropdownMenuItem className="p-0 focus:bg-transparent">
            <div className="flex flex-col items-start px-2 py-2 w-full">
                <p className="font-semibold text-sm text-foreground">Upgrade to ChimpChat Pro</p>
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

