
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  ExternalLink,
  ArrowLeft,
  Star,
  ThumbsUp,
  Zap,
  Shield,
  Rocket,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Rocket,
      color: "text-blue-500",
      articles: [
        { title: "How to start your first conversation", popularity: "high" },
        { title: "Understanding different AI models", popularity: "high" },
        { title: "Setting up your profile", popularity: "medium" },
        { title: "Customizing system prompts", popularity: "medium" },
      ]
    },
    {
      title: "Features & Functionality",
      icon: Zap,
      color: "text-purple-500",
      articles: [
        { title: "Using the model selector", popularity: "high" },
        { title: "Managing conversation history", popularity: "medium" },
        { title: "Dark mode and themes", popularity: "low" },
        { title: "Keyboard shortcuts", popularity: "low" },
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      color: "text-green-500",
      articles: [
        { title: "How we protect your data", popularity: "high" },
        { title: "Understanding AI model privacy", popularity: "medium" },
        { title: "Deleting your conversations", popularity: "medium" },
        { title: "Account security best practices", popularity: "low" },
      ]
    },
    {
      title: "Community & Support",
      icon: Users,
      color: "text-orange-500",
      articles: [
        { title: "Joining the community", popularity: "medium" },
        { title: "Reporting issues", popularity: "medium" },
        { title: "Feature requests", popularity: "low" },
        { title: "Contributing to development", popularity: "low" },
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      action: "mailto:support@pyscoutai.com",
      color: "bg-blue-500"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      icon: Book,
      action: "#",
      color: "bg-purple-500"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: Users,
      action: "#",
      color: "bg-green-500"
    },
    {
      title: "Feature Requests",
      description: "Suggest new features",
      icon: Star,
      action: "#",
      color: "bg-orange-500"
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

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
          <h1 className="text-xl font-semibold">Help & Support</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        <div className="space-y-8 animate-in fade-in-50 duration-500">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 mx-auto">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              How can we help you?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions, explore our documentation, or get in touch with our support team.
            </p>
          </div>

          {/* Search */}
          <Card className="glassmorphism shadow-lg border-border/50 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`h-12 w-12 rounded-full ${action.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <Button variant="ghost" size="sm" className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h3>
            
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                {filteredCategories.reduce((total, cat) => total + cat.articles.length, 0)} results found for "{searchQuery}"
              </p>
            )}

            {filteredCategories.length === 0 && searchQuery && (
              <Card className="glassmorphism border-border/50">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or browse our categories below.</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {(searchQuery ? filteredCategories : faqCategories).map((category, index) => (
                <Card key={index} className="glassmorphism shadow-lg border-border/50 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <category.icon className={`h-5 w-5 mr-3 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <div key={articleIndex}>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={article.popularity === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {article.popularity === 'high' && <ThumbsUp className="h-3 w-3 mr-1" />}
                              {article.popularity}
                            </Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        {articleIndex < category.articles.length - 1 && <Separator className="ml-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="glassmorphism shadow-xl border-border/50">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-bold text-foreground mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you get the most out of PyscoutAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Browse Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50">
        <p>PyscoutAI - Your AI Companion • Help & Support Center</p>
      </footer>
    </main>
  );
}
