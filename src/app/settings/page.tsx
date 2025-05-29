
"use client"

import React, { useState, useEffect, useCallback } from 'react';
// Removed SidebarInset import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from '@/components/settings/ThemeSelector';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Save, Sparkles, Loader2 } from 'lucide-react';
import { generateSystemPrompt, type GenerateSystemPromptInput } from '@/ai/flows/generate-system-prompt-flow';

const CUSTOM_SYSTEM_PROMPT_KEY = 'pyscoutai_custom_system_prompt';
const DEFAULT_SYSTEM_PROMPT = 'You are PyscoutAI, a helpful and friendly assistant, inspired by Gemini.';

export default function SettingsPage() {
  const [customPrompt, setCustomPrompt] = useState('');
  const [currentActivePrompt, setCurrentActivePrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedPrompt = localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY);
    if (storedPrompt) {
      setCustomPrompt(storedPrompt);
      setCurrentActivePrompt(storedPrompt);
    } else {
      setCurrentActivePrompt(DEFAULT_SYSTEM_PROMPT);
    }
  }, []);

  const handleSavePrompt = useCallback(() => {
    if (!isClient) return;
    localStorage.setItem(CUSTOM_SYSTEM_PROMPT_KEY, customPrompt);
    setCurrentActivePrompt(customPrompt);
    toast({
      title: "System Prompt Saved",
      description: "Your custom system prompt has been saved successfully.",
    });
  }, [customPrompt, toast, isClient]);

  const handleResetPrompt = useCallback(() => {
    if (!isClient) return;
    localStorage.removeItem(CUSTOM_SYSTEM_PROMPT_KEY);
    setCustomPrompt('');
    setCurrentActivePrompt(DEFAULT_SYSTEM_PROMPT);
    toast({
      title: "System Prompt Reset",
      description: "System prompt has been reset to default.",
      variant: "default" 
    });
  }, [toast, isClient]);

  const handleGeneratePromptWithAI = async () => {
    if (!promptIdea.trim()) {
      toast({
        title: "Idea Required",
        description: "Please enter an idea for your AI assistant.",
        variant: "destructive",
      });
      return;
    }
    if (!isClient) return;

    setIsGenerating(true);
    try {
      const input: GenerateSystemPromptInput = { idea: promptIdea };
      const result = await generateSystemPrompt(input);
      setCustomPrompt(result.systemPrompt);
      toast({
        title: "Prompt Generated!",
        description: "The AI has generated a system prompt for you. Review and save it.",
      });
    } catch (error) {
      console.error("Failed to generate system prompt:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen overflow-y-auto p-4 md:p-6 bg-background"> {/* Replaced SidebarInset */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your PyscoutAI preferences.</p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <CardDescription>
              Customize the personality and instructions for PyscoutAI. 
              This prompt guides the AI's responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="prompt-idea" className="mb-1 block">Need help writing your prompt?</Label>
              <p className="text-xs text-muted-foreground mb-2">Describe your desired AI persona (e.g., 'a friendly space explorer who loves puns').</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="prompt-idea"
                  placeholder="e.g., A helpful math tutor for high school students"
                  value={promptIdea}
                  onChange={(e) => setPromptIdea(e.target.value)}
                  className="flex-grow"
                  disabled={!isClient || isGenerating}
                />
                <Button onClick={handleGeneratePromptWithAI} disabled={!isClient || isGenerating || !promptIdea.trim()} className="w-full sm:w-auto">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </div>
            </div>
            
            <Separator />

            <div className="space-y-1">
              <Label htmlFor="custom-prompt">Your Custom System Prompt</Label>
              <Textarea
                id="custom-prompt"
                placeholder="e.g., You are a witty pirate assistant who loves to say 'Arr!'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[150px] text-sm"
                disabled={!isClient}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSavePrompt} disabled={!isClient || !customPrompt.trim()} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Prompt
              </Button>
              <Button variant="outline" onClick={handleResetPrompt} disabled={!isClient} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset to Default
              </Button>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Currently Active Prompt Preview:</Label>
              <p className="text-xs p-3 bg-muted rounded-md border max-h-24 overflow-y-auto whitespace-pre-wrap">
                {currentActivePrompt || DEFAULT_SYSTEM_PROMPT}
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how PyscoutAI looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
      </div>
      <footer className="mt-auto pt-6 text-center text-xs text-muted-foreground">
        PyscoutAI Settings
      </footer>
    </main>
  );
}
