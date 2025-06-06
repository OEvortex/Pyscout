"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Save, Sparkles, Loader2, X } from "lucide-react";
import {
  generateSystemPrompt,
  type GenerateSystemPromptInput,
} from "@/ai/flows/generate-system-prompt-flow";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const CUSTOM_SYSTEM_PROMPT_KEY = "pyscoutai_custom_system_prompt";
const DEFAULT_SYSTEM_PROMPT = `You are PyscoutAI, an advanced and versatile AI assistant designed to be exceptionally helpful, knowledgeable, and engaging. Your primary goal is to assist users by providing comprehensive and accurate information, generating creative text formats, answering questions thoughtfully, and performing tasks efficiently.

## Core Capabilities:
- Maintain a friendly, approachable, and slightly enthusiastic tone
- Understand complex queries and break down problems systematically
- Explain concepts clearly with examples when helpful
- Provide accurate information from your knowledge base
- If unsure about something, acknowledge uncertainty rather than provide incorrect information

## Web Search Instructions:
When the user's message includes "SEARCH_QUERY:" followed by search terms, perform the following:

1. **Search Execution**: Use the provided search query to find current, relevant information from the web
2. **Information Processing**: Analyze search results to extract the most relevant and accurate information
3. **Source Integration**: Incorporate findings into your response, clearly indicating when information comes from web sources
4. **Citation Format**: When referencing web search results, use this format: "According to recent web search results..." or "Based on current information found online..."
5. **Verification**: Cross-reference multiple sources when possible to ensure accuracy
6. **Recency**: Prioritize recent information when discussing current events, breaking news, or rapidly changing topics

## Search Response Structure:
- Begin with a brief acknowledgment that you've searched for current information
- Present the most relevant findings clearly and concisely
- Organize information logically (chronologically for news, by relevance for other topics)
- Include key details like dates, sources, and context when available
- Conclude with any additional insights or connections to the user's broader question

## Guidelines:
- Always strive to make interactions positive and productive
- Use search capabilities to provide the most current and accurate information available
- Be transparent about the sources and recency of information
- If search results are limited or unclear, acknowledge this and provide what information is available
- Combine web search results with your existing knowledge for comprehensive responses

Remember: Web search should enhance your responses with current information while maintaining your core personality and helpfulness.`;
const ANIMATION_DURATION = 250; // ms - Quick and smooth close animation

export default function SettingsPage() {
  const [customPrompt, setCustomPrompt] = useState("");
  const [currentActivePrompt, setCurrentActivePrompt] = useState(
    DEFAULT_SYSTEM_PROMPT,
  );
  const [promptIdea, setPromptIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // For exit animation
  const router = useRouter();

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
    setCustomPrompt("");
    setCurrentActivePrompt(DEFAULT_SYSTEM_PROMPT);
    toast({
      title: "System Prompt Reset",
      description: "System prompt has been reset to default.",
      variant: "default",
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
        description:
          "The AI has generated a system prompt for you. Review and save it.",
      });
    } catch (error) {
      console.error("Failed to generate system prompt:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseSettings = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  return (
    <main
      className="flex flex-col min-h-screen overflow-y-auto"
      data-oid="sbgptcm"
    >
      {" "}
      <div
        className={cn(
          "flex flex-col flex-1 p-4 md:p-6 bg-transparent relative",
          isClosing && "animate-settings-close",
        )}
        data-oid="yczpfln"
      >
        <header
          className="mb-6 flex items-start justify-between sticky top-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm py-4 z-10 -mx-4 md:-mx-6 px-4 md:px-6 border-b"
          data-oid="mnryb46"
        >
          <div data-oid="ufl-g7y">
            <h1
              className="text-3xl font-semibold tracking-tight text-foreground"
              data-oid="tfp9ky6"
            >
              Settings
            </h1>
            <p className="text-muted-foreground text-sm" data-oid="wi0iuq9">
              Manage your PyscoutAI preferences.
            </p>
          </div>{" "}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseSettings}
            className="ml-auto rounded-full hover:bg-accent/20 hover:scale-105 transition-all duration-200 group"
            data-oid="wn1y880"
          >
            <X
              className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200"
              data-oid="4axwi2i"
            />

            <span className="sr-only" data-oid="q6y5chh">
              Close settings
            </span>
          </Button>
        </header>{" "}
        <div
          className="space-y-8 mt-2 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
          data-oid="y1ip_69"
        >
          <Card
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-border/70 settings-card-hover animate-settings-section"
            data-oid=":9bg784"
          >
            <CardHeader data-oid="vrzmu72">
              <CardTitle className="text-foreground" data-oid="cb.vkz4">
                System Prompt
              </CardTitle>
              <CardDescription data-oid="bg5k6ko">
                Customize the personality and instructions for PyscoutAI. This
                prompt guides the AI's responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="r5aez.q">
              <div data-oid=":4_dk9j">
                <Label
                  htmlFor="prompt-idea"
                  className="mb-1 block font-medium text-foreground/90"
                  data-oid="v_son28"
                >
                  Need help writing your prompt?
                </Label>
                <p
                  className="text-xs text-muted-foreground mb-2"
                  data-oid="m:.tq61"
                >
                  Describe your desired AI persona (e.g., 'a friendly space
                  explorer who loves puns').
                </p>
                <div
                  className="flex flex-col sm:flex-row gap-2"
                  data-oid="qm1p1tm"
                >
                  <Input
                    id="prompt-idea"
                    placeholder="e.g., A helpful math tutor for high school students"
                    value={promptIdea}
                    onChange={(e) => setPromptIdea(e.target.value)}
                    className="flex-grow"
                    disabled={!isClient || isGenerating}
                    data-oid="avndkv_"
                  />

                  <Button
                    onClick={handleGeneratePromptWithAI}
                    disabled={!isClient || isGenerating || !promptIdea.trim()}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground button-smooth"
                    data-oid="p82uue6"
                  >
                    {isGenerating ? (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        data-oid="8r6v2ze"
                      />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" data-oid="bzi.9xm" />
                    )}
                    Generate with AI
                  </Button>
                </div>
              </div>
              <Separator data-oid="ng93ib7" />
              <div className="space-y-1" data-oid="bj4ja0b">
                <Label
                  htmlFor="custom-prompt"
                  className="font-medium text-foreground/90"
                  data-oid="czwq7jd"
                >
                  Your Custom System Prompt
                </Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="e.g., You are a witty pirate assistant who loves to say 'Arr!'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[150px] text-sm focus:border-primary"
                  disabled={!isClient}
                  data-oid="ad67zjn"
                />
              </div>{" "}
              <div
                className="flex flex-col sm:flex-row gap-2"
                data-oid="cv_yk5e"
              >
                <Button
                  onClick={handleSavePrompt}
                  disabled={!isClient || !customPrompt.trim()}
                  className="w-full sm:w-auto button-smooth"
                  data-oid="ziat7ef"
                >
                  <Save className="mr-2 h-4 w-4" data-oid=".2adaxo" /> Save
                  Prompt
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetPrompt}
                  disabled={!isClient}
                  className="w-full sm:w-auto button-smooth"
                  data-oid="nvlmr1f"
                >
                  <RotateCcw className="mr-2 h-4 w-4" data-oid="0jxv-e:" />{" "}
                  Reset to Default
                </Button>
              </div>
              <div data-oid="sk6nrub">
                <Label
                  className="text-xs text-muted-foreground font-medium"
                  data-oid="4lk_saw"
                >
                  Currently Active Prompt Preview:
                </Label>
                <p
                  className="text-xs p-3 bg-muted rounded-md border max-h-24 overflow-y-auto whitespace-pre-wrap"
                  data-oid="900tmkb"
                >
                  {currentActivePrompt || DEFAULT_SYSTEM_PROMPT}
                </p>
              </div>
            </CardContent>
          </Card>
          <Separator data-oid="-klssst" />{" "}
          <Card
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-border/70 settings-card-hover animate-settings-section"
            data-oid="8z_7p80"
          >
            <CardHeader data-oid="d0-lhdv">
              <CardTitle className="text-foreground" data-oid="n:695rg">
                Appearance
              </CardTitle>
              <CardDescription data-oid="50j_t2e">
                Choose how PyscoutAI looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="lzy7xfy">
              <ThemeSelector data-oid="zzsdpe8" />
            </CardContent>
          </Card>
        </div>
        <footer
          className="mt-auto pt-8 pb-4 text-center text-xs text-muted-foreground"
          data-oid="dnl5okr"
        >
          PyscoutAI Settings
        </footer>
      </div>
    </main>
  );
}
