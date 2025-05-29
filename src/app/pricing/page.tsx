
"use client";

import React from 'react';
// Removed SidebarInset import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Zap, Brain, Cpu, InfinityIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const features = [
    { name: "Unlimited AI Chat Sessions", icon: Sparkles },
    { name: "Access to 450+ Cutting-Edge Models", icon: Cpu },
    { name: "Powered by Advanced AI Brains", icon: Brain },
    { name: "Lightning Fast Responses", icon: Zap },
    { name: "Advanced System Prompt Customization", icon: CheckCircle },
    { name: "All Future Updates Included", icon: CheckCircle },
    { name: "Absolutely Zero Cost, Forever!", icon: InfinityIcon },
  ];

  return (
    <main className="flex flex-col min-h-screen overflow-y-auto p-4 md:p-8 items-center justify-center bg-background"> {/* Replaced SidebarInset */}
      <header className="mb-8 text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent py-2">
          PyscoutAI: Unrestricted Access, Completely Free!
        </h1>
        <p className="text-muted-foreground mt-3 text-lg sm:text-xl">
          Experience the full power of PyscoutAI with all features unlocked, at no cost. Ever.
        </p>
      </header>

      <div className="flex justify-center w-full max-w-lg animate-in fade-in-50 duration-500 ease-out">
        <Card className="w-full shadow-xl border-primary/20 hover:shadow-primary/10 transition-shadow duration-300">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-semibold text-foreground">
              PyscoutAI - Free Plan
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-primary mt-2">
              $0 <span className="text-base font-normal text-muted-foreground">/ month</span>
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">Forever. No catches, no hidden fees, no credit card required.</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center text-foreground">
                  <feature.icon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 text-primary-foreground text-lg py-6 transition-opacity duration-300"
              onClick={() => router.push('/')}
              size="lg"
            >
              Start Chatting for Free
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        PyscoutAI - The Future of AI, Open to Everyone.
      </footer>
    </main>
  );
}
