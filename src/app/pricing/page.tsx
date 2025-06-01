"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Sparkles, 
  Zap, 
  Brain, 
  Cpu, 
  InfinityIcon,
  ArrowLeft,
  Star,
  Globe,
  Shield,
  Clock,
  Users,
  Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const mainFeatures = [
    { name: "Unlimited AI Chat Sessions", icon: Sparkles, description: "Chat without limits, anytime" },
    { name: "Access to 450+ Cutting-Edge Models", icon: Cpu, description: "Latest AI models at your fingertips" },
    { name: "Powered by Advanced AI Brains", icon: Brain, description: "GPT-4, Claude, Gemini, and more" },
    { name: "Lightning Fast Responses", icon: Zap, description: "Optimized for speed and performance" },
    { name: "Advanced System Prompt Customization", icon: CheckCircle, description: "Personalize your AI assistant" },
    { name: "All Future Updates Included", icon: Rocket, description: "Stay current with latest features" },
    { name: "Absolutely Zero Cost, Forever!", icon: InfinityIcon, description: "No hidden fees, ever" },
  ];

  const additionalFeatures = [
    { category: "Security & Privacy", items: ["End-to-end encryption", "No data retention", "GDPR compliant"] },
    { category: "Performance", items: ["99.9% uptime", "Global CDN", "Real-time responses"] },
    { category: "Support", items: ["24/7 community support", "Comprehensive documentation", "Regular updates"] },
    { category: "Integrations", items: ["API access (coming soon)", "Browser extensions", "Mobile apps"] },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Developer",
      text: "PyscoutAI has transformed how I approach coding problems. The variety of models available is incredible!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Data Scientist", 
      text: "Being completely free makes this accessible to everyone. The AI responses are consistently high-quality.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Student",
      text: "Perfect for learning and research. I love how I can customize the AI's personality for different tasks.",
      rating: 5
    }
  ];

  return (
    <main className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Pricing</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        <div className="space-y-12 animate-in fade-in-50 duration-500">
          {/* Hero Section */}
          <header className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent py-2">
                PyscoutAI
              </h1>
              <Badge className="absolute -top-2 -right-8 bg-green-500 hover:bg-green-600 text-white animate-pulse">
                FREE
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Unrestricted Access, Completely Free!
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Experience the full power of PyscoutAI with all features unlocked, at no cost. Ever.
            </p>
          </header>

          {/* Main Pricing Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl glassmorphism shadow-2xl border-primary/20 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-shimmer"></div>
              
              <CardHeader className="text-center pb-6 relative">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <InfinityIcon className="h-8 w-8 text-primary animate-float" />
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    Forever Free
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  PyscoutAI
                </CardTitle>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <span className="text-4xl font-bold text-primary">$0</span>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">/ month</div>
                    <div className="text-xs text-muted-foreground">Forever</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  No catches, no hidden fees, no credit card required
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 relative">
                {/* Main Features */}
                <div className="space-y-4">
                  {mainFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        <feature.icon className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* CTA Button */}
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 text-primary-foreground text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/')}
                  size="lg"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Chatting for Free
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Join thousands of users already using PyscoutAI
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-foreground">Everything You Need, Included</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {additionalFeatures.map((featureGroup, index) => (
                <Card key={index} className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {featureGroup.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {featureGroup.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-foreground">What Users Are Saying</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <Card className="glassmorphism shadow-xl border-border/50">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold text-foreground">10K+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Cpu className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold text-foreground">450+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">AI Models</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold text-foreground">99.9%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <InfinityIcon className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold text-foreground">∞</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Always Free</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="glassmorphism shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground text-center">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Is PyscoutAI really free?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! PyscoutAI is completely free with no hidden costs, no premium tiers, and no credit card required.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">How many models can I use?</h4>
                  <p className="text-sm text-muted-foreground">
                    You have unlimited access to all 450+ AI models including GPT-4, Claude, Gemini, and many others.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Are there usage limits?</h4>
                  <p className="text-sm text-muted-foreground">
                    No usage limits! Chat as much as you want, when you want, with any available model.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">How is this sustainable?</h4>
                  <p className="text-sm text-muted-foreground">
                    We believe AI should be accessible to everyone. Our mission is to democratize AI technology.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50">
        <p>PyscoutAI - The Future of AI, Open to Everyone</p>
      </footer>
    </main>
  );
}
