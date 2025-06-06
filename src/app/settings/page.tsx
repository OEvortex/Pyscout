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
const DEFAULT_SYSTEM_PROMPT = `You are PyscoutAI, an advanced and versatile AI assistant designed to be exceptionally helpful, knowledgeable, and engaging. Your primary goal is to assist users by providing comprehensive and accurate information, generating creative text formats, answering questions thoughtfully, and performing tasks efficiently. Maintain a friendly, approachable, and slightly enthusiastic tone. You are capable of understanding complex queries, breaking down problems, and explaining concepts clearly. Feel free to use your broad knowledge base, but always prioritize helpfulness and clarity in your responses. If you're unsure about something, it's better to say so than to provide incorrect information. Strive to make every interaction a positive and productive one for the user.`;
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
      data-oid="3lj-:fu"
    >
      {" "}
      <div
        className={cn(
          "flex flex-col flex-1 p-4 md:p-6 bg-transparent relative",
          isClosing && "animate-settings-close",
        )}
        data-oid="xi.lb.9"
      >
        <header
          className="mb-6 flex items-start justify-between sticky top-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm py-4 z-10 -mx-4 md:-mx-6 px-4 md:px-6 border-b"
          data-oid="9rs20z7"
        >
          <div data-oid="kchj:xb">
            <h1
              className="text-3xl font-semibold tracking-tight text-foreground"
              data-oid=".yhoktq"
            >
              Settings
            </h1>
            <p className="text-muted-foreground text-sm" data-oid="u-od_qa">
              Manage your PyscoutAI preferences.
            </p>
          </div>{" "}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseSettings}
            className="ml-auto rounded-full hover:bg-accent/20 hover:scale-105 transition-all duration-200 group"
            data-oid="ln86i5j"
          >
            <X
              className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200"
              data-oid="2s6u3dr"
            />
            <span className="sr-only" data-oid="augrz4m">
              Close settings
            </span>
          </Button>
        </header>{" "}
        <div
          className="space-y-8 mt-2 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
          data-oid="3atk.i3"
        >
          <Card
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-border/70 settings-card-hover animate-settings-section"
            data-oid="xgysvul"
          >
            <CardHeader data-oid="56fcuar">
              <CardTitle className="text-foreground" data-oid="gbui732">
                System Prompt
              </CardTitle>
              <CardDescription data-oid="urplex9">
                Customize the personality and instructions for PyscoutAI. This
                prompt guides the AI's responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="z:9yxgm">
              <div data-oid="0hbo1ee">
                <Label
                  htmlFor="prompt-idea"
                  className="mb-1 block font-medium text-foreground/90"
                  data-oid="_4gxbxe"
                >
                  Need help writing your prompt?
                </Label>
                <p
                  className="text-xs text-muted-foreground mb-2"
                  data-oid="k3ir535"
                >
                  Describe your desired AI persona (e.g., 'a friendly space
                  explorer who loves puns').
                </p>
                <div
                  className="flex flex-col sm:flex-row gap-2"
                  data-oid="kfe:cay"
                >
                  <Input
                    id="prompt-idea"
                    placeholder="e.g., A helpful math tutor for high school students"
                    value={promptIdea}
                    onChange={(e) => setPromptIdea(e.target.value)}
                    className="flex-grow"
                    disabled={!isClient || isGenerating}
                    data-oid="54m70mz"
                  />

                  <Button
                    onClick={handleGeneratePromptWithAI}
                    disabled={!isClient || isGenerating || !promptIdea.trim()}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground button-smooth"
                    data-oid="lgg3gr:"
                  >
                    {isGenerating ? (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        data-oid="h57e18:"
                      />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" data-oid=":zba1dl" />
                    )}
                    Generate with AI
                  </Button>
                </div>
              </div>
              <Separator data-oid="lxk-hc4" />
              <div className="space-y-1" data-oid="dmh6290">
                <Label
                  htmlFor="custom-prompt"
                  className="font-medium text-foreground/90"
                  data-oid="5hsoz2h"
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
                  data-oid="7kg.xdm"
                />
              </div>{" "}
              <div
                className="flex flex-col sm:flex-row gap-2"
                data-oid="hn:94an"
              >
                <Button
                  onClick={handleSavePrompt}
                  disabled={!isClient || !customPrompt.trim()}
                  className="w-full sm:w-auto button-smooth"
                  data-oid="e79oiuv"
                >
                  <Save className="mr-2 h-4 w-4" data-oid="gmofq7f" /> Save
                  Prompt
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetPrompt}
                  disabled={!isClient}
                  className="w-full sm:w-auto button-smooth"
                  data-oid="1bbiqqv"
                >
                  <RotateCcw className="mr-2 h-4 w-4" data-oid="vaaabm2" />{" "}
                  Reset to Default
                </Button>
              </div>
              <div data-oid="h29v3fi">
                <Label
                  className="text-xs text-muted-foreground font-medium"
                  data-oid="6s42xn0"
                >
                  Currently Active Prompt Preview:
                </Label>
                <p
                  className="text-xs p-3 bg-muted rounded-md border max-h-24 overflow-y-auto whitespace-pre-wrap"
                  data-oid="dwuoz3n"
                >
                  {currentActivePrompt || DEFAULT_SYSTEM_PROMPT}
                </p>
              </div>
            </CardContent>
          </Card>
          <Separator data-oid="ede-df-" />{" "}
          <Card
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-border/70 settings-card-hover animate-settings-section"
            data-oid="e:z2s1t"
          >
            <CardHeader data-oid="9fl3t8h">
              <CardTitle className="text-foreground" data-oid="l5l3ueo">
                Appearance
              </CardTitle>
              <CardDescription data-oid="9-_dm1r">
                Choose how PyscoutAI looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="0chuiro">
              <ThemeSelector data-oid="d8vr253" />
            </CardContent>
          </Card>
        </div>
        <footer
          className="mt-auto pt-8 pb-4 text-center text-xs text-muted-foreground"
          data-oid="sm.:fed"
        >
          PyscoutAI Settings
        </footer>
      </div>
    </main>
  );
}
