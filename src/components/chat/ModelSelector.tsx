
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
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Loader2, ServerCrash, Sparkles, Zap, Crown, Star, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function getModelIcon(modelName: string): React.ReactNode {
  const name = modelName.toLowerCase();
  if (name.includes('gpt') || name.includes('openai')) {
    return <Sparkles className="h-3 w-3" />;
  }
  if (name.includes('claude') || name.includes('anthropic')) {
    return <Crown className="h-3 w-3" />;
  }
  if (name.includes('gemini') || name.includes('google')) {
    return <Star className="h-3 w-3" />;
  }
  if (name.includes('flash') || name.includes('turbo')) {
    return <Zap className="h-3 w-3" />;
  }
  return <div className="h-3 w-3 bg-gradient-to-br from-primary to-purple-500 rounded-full" />;
}

function getModelBadge(modelName: string): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } | null {
  const name = modelName.toLowerCase();
  if (name.includes('gpt-4') || name.includes('claude-3') || name.includes('gemini-pro')) {
    return { text: 'Pro', variant: 'default' };
  }
  if (name.includes('flash') || name.includes('turbo')) {
    return { text: 'Fast', variant: 'secondary' };
  }
  if (name.includes('preview') || name.includes('beta')) {
    return { text: 'Beta', variant: 'outline' };
  }
  return null;
}

interface ModelSelectorProps {
  selectedModelFromParent: Model | null;
  onModelChange: (model: Model | null) => void;
}

export function ModelSelector({ selectedModelFromParent, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalSelectedModel, setInternalSelectedModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clientHasHydrated, setClientHasHydrated] = useState(false);  const [isSelecting, setIsSelecting] = useState(false);
  // Filter models based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(model =>
        (model.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.owned_by.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [models, searchQuery]);

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
      setIsSelecting(true);
      // Smooth transition with visual feedback
      setInternalSelectedModel(selectedModelObject);
      
      // Add a small delay for smooth animation
      setTimeout(() => {
        onModelChange(selectedModelObject);
        setIsSelecting(false);
        setSearchQuery(''); // Clear search when selecting
      }, 150);
    }
    setIsOpen(false); 
  };  if (!clientHasHydrated) {
    // Return a consistent SSR-safe fallback that matches what the server would render
    return (
      <Button
        variant="ghost"
        className="flex items-center px-3 py-2 h-auto rounded-xl bg-card/50 border border-border/30 transition-all duration-300 backdrop-blur-sm shadow-sm"
        disabled={true}
        aria-label="Select Model"
        suppressHydrationWarning
      >
        <div className="flex items-center min-w-0 flex-1">
          <div className="h-2 w-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mr-3 flex-shrink-0" />
          <span className="text-sm font-semibold text-foreground truncate">
            Select Model
          </span>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground flex-shrink-0" />
      </Button>
    );
  }let triggerContent: React.ReactNode;
  let triggerDisabled = false;
    if (isLoading && !internalSelectedModel && !error) {
    triggerContent = (
      <>
        <div className="h-2 w-2 bg-primary/60 rounded-full mr-3" />
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Loading models...</span>
      </>
    );
    triggerDisabled = true;
  } else if (error) {
    triggerContent = (
      <>
        <div className="h-2 w-2 bg-red-400 rounded-full mr-3 animate-pulse" />
        <ServerCrash className="mr-2 h-4 w-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Connection Error</span>
        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
      </>
    );
    triggerDisabled = false; // Allow clicking to retry
  } else if (models.length === 0 && !isLoading) {
    triggerContent = (
      <>
        <div className="h-2 w-2 bg-muted-foreground/60 rounded-full mr-3" />
        <span className="text-sm font-medium text-muted-foreground">No Models Available</span>
        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
      </>
    );
    triggerDisabled = true;  } else {
    const modelIcon = internalSelectedModel?.name ? getModelIcon(internalSelectedModel.name) : null;
    const modelBadge = internalSelectedModel?.name ? getModelBadge(internalSelectedModel.name) : null;
    
    triggerContent = (
      <>
        <div className="flex items-center min-w-0 flex-1">          <div className={cn(
            "h-2 w-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-200",
            internalSelectedModel 
              ? "bg-green-500" 
              : "bg-amber-500"
          )} />
          <div className="flex items-center gap-2 min-w-0">            {modelIcon && (
              <div className="text-primary flex-shrink-0">
                {modelIcon}
              </div>
            )}
            <span className="text-sm font-semibold text-foreground truncate">
              {internalSelectedModel?.name || 'Select Model'}
            </span>            {modelBadge && (
              <Badge variant={modelBadge.variant} className="text-xs h-5 px-1.5 flex-shrink-0">
                {modelBadge.text}
              </Badge>
            )}
          </div>
        </div>        <ChevronDown className={cn(
          "ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </>
    );
    triggerDisabled = isLoading && models.length === 0; 
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"          className={cn(
            "flex items-center px-3 py-2 h-auto rounded-xl bg-card/50 border border-border/30 transition-colors duration-200 backdrop-blur-sm shadow-sm group",
            "hover:bg-card/80 hover:border-border/50",
            "data-[state=open]:bg-card/90 data-[state=open]:border-primary/30",
            "focus-visible:ring-2 focus-visible:ring-primary/50",
            error && "border-destructive/30 hover:border-destructive/50"
          )}
          disabled={triggerDisabled}
          aria-label={`Selected model: ${internalSelectedModel?.name || 'Select Model'}`}
          suppressHydrationWarning
        >
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>      <DropdownMenuContent 
        className={cn(
            "w-80 sm:w-96 bg-card/95 backdrop-blur-sm text-card-foreground border border-border/50 shadow-lg p-3", 
            "z-50 rounded-2xl"
        )}
        align="start"
        suppressHydrationWarning
      >        {isLoading && models.length === 0 && clientHasHydrated && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground text-sm font-medium">Loading models...</span>
            </div>
          </div>
        )}
        {error && clientHasHydrated && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ServerCrash className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-destructive font-medium">Connection Error</p>
                <p className="text-muted-foreground text-xs mt-1">Unable to load models</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchAndCacheModels}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && models.length === 0 && clientHasHydrated && (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">No models found</span>
            </div>
          </div>
        )}
        
        {!isLoading && !error && models.length > 0 && clientHasHydrated && (
          <>            <DropdownMenuLabel className="text-sm font-bold text-foreground px-3 pt-2 pb-3 flex items-center">
              <div className="h-2 w-2 bg-primary rounded-full mr-2" />
              Choose your AI model
              <span className="ml-auto text-xs text-muted-foreground font-normal">
                {filteredModels.length} available
              </span>
            </DropdownMenuLabel>
            
            {/* Search Input */}
            <div className="relative mb-3 px-3">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            
            <ScrollArea viewportClassName="max-h-[280px]" className="pr-2"> 
              <div className="space-y-1.5">
                {filteredModels.length === 0 ? (
                  <div className="text-center py-6">
                    <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No models match your search</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">Try different keywords</p>
                  </div>
                ) : (                  filteredModels.map((model) => {
                    const isSelected = internalSelectedModel?.id === model.id;
                    const modelIcon = model.name ? getModelIcon(model.name) : null;
                    const modelBadge = model.name ? getModelBadge(model.name) : null;
                    
                    return (
                      <DropdownMenuItem
                        key={model.id}                        onSelect={() => handleModelSelect(model.id)}
                        className={cn(
                          "text-sm cursor-pointer py-3 px-4 rounded-xl focus:bg-accent/80 focus:text-accent-foreground transition-colors duration-200 group border border-transparent hover:border-primary/20",
                          isSelected && "bg-primary text-white border-primary/30"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 min-w-0 flex-1">                            <div className={cn(
                              "flex-shrink-0",
                              isSelected ? "text-white" : "text-primary"
                            )}>
                              {modelIcon}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-2">                                <span className={cn(
                                  "font-semibold truncate", 
                                  isSelected ? "text-white" : "text-foreground group-hover:text-primary"
                                )}>
                                  {model.name || model.id}
                                </span>
                                {modelBadge && (
                                  <Badge 
                                    variant={isSelected ? "secondary" : modelBadge.variant} 
                                    className={cn(
                                      "text-xs h-5 px-1.5 flex-shrink-0 transition-all duration-300",
                                      isSelected && "bg-white/20 text-white border-white/30"
                                    )}
                                  >
                                    {modelBadge.text}
                                  </Badge>
                                )}
                              </div>
                              <span className={cn(
                                "text-xs mt-0.5 truncate", 
                                isSelected ? "text-white/80" : "text-muted-foreground group-hover:text-muted-foreground/80"
                              )}>
                                by {model.owned_by}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 ml-2 animate-in zoom-in-0 duration-200">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </div>
            </ScrollArea>
            
            <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <DropdownMenuItem className="p-0 focus:bg-transparent cursor-default select-none rounded-xl">
                <div className="flex flex-col items-start p-4 w-full rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex items-center w-full mb-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-bold text-sm text-foreground">Upgrade to PyscoutAI Pro</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Get access to our most capable models, priority support, and advanced features</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                        Upgrade Now
                    </Button>
                </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

