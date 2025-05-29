
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from '@/components/settings/ThemeSelector';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Save } from 'lucide-react';

const CUSTOM_SYSTEM_PROMPT_KEY = 'pyscoutai_custom_system_prompt';
const DEFAULT_SYSTEM_PROMPT = 'You are PyscoutAI, a helpful and friendly assistant, inspired by Gemini.';

export default function SettingsPage() {
  const [customPrompt, setCustomPrompt] = useState('');
  const [currentActivePrompt, setCurrentActivePrompt] = useState(DEFAULT_SYSTEM_PROMPT);
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

  return (
    <SidebarInset className="flex flex-col h-screen overflow-y-auto p-4 md:p-6">
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
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="custom-prompt">Custom System Prompt</Label>
              <Textarea
                id="custom-prompt"
                placeholder="e.g., You are a witty pirate assistant who loves to say 'Arr!'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px] text-sm"
                disabled={!isClient}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSavePrompt} disabled={!isClient} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Prompt
              </Button>
              <Button variant="outline" onClick={handleResetPrompt} disabled={!isClient} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset to Default
              </Button>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Currently Active Prompt Preview:</Label>
              <p className="text-xs p-2 bg-muted rounded-md border max-h-20 overflow-y-auto">
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
    </SidebarInset>
  );
}
