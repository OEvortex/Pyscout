
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserCog, User, Mail, Calendar, Shield, Crown, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();

  const accountFeatures = [
    { icon: Mail, label: "Email", value: "user@example.com", verified: true },
    { icon: Calendar, label: "Member Since", value: "January 2024" },
    { icon: Shield, label: "Security", value: "2FA Enabled" },
    { icon: Crown, label: "Plan", value: "Free Forever" },
  ];

  return (
    <main className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4 md:p-6 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Account Management</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          {/* Profile Card */}
          <Card className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <div className="relative mx-auto mb-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 mx-auto">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600">
                  Active
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PyscoutAI User
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Welcome to your account dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Details */}
              <div className="grid gap-4 md:grid-cols-2">
                {accountFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{feature.label}</p>
                      <p className="text-sm text-muted-foreground truncate">{feature.value}</p>
                    </div>
                    {feature.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button variant="outline" className="h-12 justify-start hover:bg-accent/50">
                    <UserCog className="h-4 w-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="h-12 justify-start hover:bg-accent/50">
                    <Shield className="h-4 w-4 mr-3" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="h-12 justify-start hover:bg-accent/50">
                    <Mail className="h-4 w-4 mr-3" />
                    Email Preferences
                  </Button>
                  <Button variant="outline" className="h-12 justify-start hover:bg-accent/50">
                    <Crown className="h-4 w-4 mr-3" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Coming Soon Notice */}
              <div className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                <UserCog className="h-12 w-12 text-primary mx-auto mb-3 animate-float" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Full Account Management Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced profile management, security settings, and personalization options are currently in development.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50">
        <p>PyscoutAI - Your AI Companion • Account Management</p>
      </footer>
    </main>
  );
}
