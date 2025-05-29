
"use client";

import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Zap, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const features = [
    { name: "Unlimited AI Chat", icon: Sparkles },
    { name: "Access to All Models", icon: Brain },
    { name: "Lightning Fast Responses", icon: Zap },
    { name: "Advanced System Prompt Customization", icon: CheckCircle },
    { name: "All Future Updates", icon: CheckCircle },
    { name: "Absolutely Zero Cost, Forever!", icon: CheckCircle },
  ];

  return (
    <SidebarInset className="flex flex-col h-screen overflow-y-auto p-4 md:p-6">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          PyscoutAI: The Best Things in Life Are Free!
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          That's right, all these amazing features are yours, completely free.
        </p>
      </header>

      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">
              PyscoutAI - Free Plan
            </CardTitle>
            <CardDescription className="text-xl font-bold text-primary mt-1">
              $0 / month
            </CardDescription>
            <p className="text-sm text-muted-foreground">Forever. No catches, no hidden fees.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center">
                  <feature.icon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              onClick={() => router.push('/')}
            >
              Start Chatting for Free
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground">
        PyscoutAI - AI for Everyone
      </footer>
    </SidebarInset>
  );
}
