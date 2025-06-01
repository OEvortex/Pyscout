
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  ArrowLeft,
  Zap,
  Brain,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActivityPage() {
  const router = useRouter();

  // Mock activity data
  const activityStats = [
    { icon: MessageSquare, label: "Total Conversations", value: "47", change: "+12 this week", color: "text-blue-500" },
    { icon: Clock, label: "Time Spent", value: "23h", change: "+5h this week", color: "text-green-500" },
    { icon: Brain, label: "Models Used", value: "8", change: "3 new models", color: "text-purple-500" },
    { icon: TrendingUp, label: "Questions Asked", value: "324", change: "+89 this week", color: "text-orange-500" },
  ];

  const recentActivity = [
    { 
      id: 1, 
      type: "conversation", 
      title: "Python Development Help", 
      time: "2 hours ago", 
      model: "GPT-4",
      status: "completed"
    },
    { 
      id: 2, 
      type: "conversation", 
      title: "Data Analysis Questions", 
      time: "1 day ago", 
      model: "Claude-3",
      status: "completed"
    },
    { 
      id: 3, 
      type: "conversation", 
      title: "Web Development Tips", 
      time: "2 days ago", 
      model: "Gemini Pro",
      status: "completed"
    },
    { 
      id: 4, 
      type: "conversation", 
      title: "Machine Learning Concepts", 
      time: "3 days ago", 
      model: "GPT-4",
      status: "completed"
    },
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
          <h1 className="text-xl font-semibold">Activity Dashboard</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {activityStats.map((stat, index) => (
              <Card key={index} className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-xs ${stat.color} mt-1`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted/30 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <History className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Your latest conversations and interactions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-accent/50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {activity.model}
                          </Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
              
              <div className="pt-4 text-center">
                <Button variant="outline" className="w-full hover:bg-accent/50">
                  <History className="h-4 w-4 mr-2" />
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Insights */}
          <Card className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Usage Insights
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Discover patterns in your AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4 animate-float" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Get detailed insights into your usage patterns, favorite models, most productive times, 
                  and personalized recommendations to enhance your AI experience.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    Performance tracking
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 mr-1 text-purple-500" />
                    AI recommendations
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                    Usage trends
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50">
        <p>PyscoutAI - Your AI Companion • Activity Dashboard</p>
      </footer>
    </main>
  );
}
