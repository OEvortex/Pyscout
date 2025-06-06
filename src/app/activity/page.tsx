"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  History,
  MessageSquare,
  Clock,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Zap,
  Brain,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActivityPage() {
  const router = useRouter();

  // Mock activity data
  const activityStats = [
    {
      icon: MessageSquare,
      label: "Total Conversations",
      value: "47",
      change: "+12 this week",
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Time Spent",
      value: "23h",
      change: "+5h this week",
      color: "text-green-500",
    },
    {
      icon: Brain,
      label: "Models Used",
      value: "8",
      change: "3 new models",
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      label: "Questions Asked",
      value: "324",
      change: "+89 this week",
      color: "text-orange-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "conversation",
      title: "Python Development Help",
      time: "2 hours ago",
      model: "GPT-4",
      status: "completed",
    },
    {
      id: 2,
      type: "conversation",
      title: "Data Analysis Questions",
      time: "1 day ago",
      model: "Claude-3",
      status: "completed",
    },
    {
      id: 3,
      type: "conversation",
      title: "Web Development Tips",
      time: "2 days ago",
      model: "Gemini Pro",
      status: "completed",
    },
    {
      id: 4,
      type: "conversation",
      title: "Machine Learning Concepts",
      time: "3 days ago",
      model: "GPT-4",
      status: "completed",
    },
  ];

  return (
    <main
      className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20"
      data-oid="busknj-"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid="xp5h9of"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto"
          data-oid="tkri4i_"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="om5c9j9"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="u9joi9b" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="tvzze_v">
            Activity Dashboard
          </h1>
          <div className="w-16" data-oid="43f:5ct"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full"
        data-oid="t5-j64i"
      >
        <div
          className="space-y-6 animate-in fade-in-50 duration-500"
          data-oid="4ixd6-8"
        >
          {/* Stats Overview */}
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-oid="2e6dy5x"
          >
            {activityStats.map((stat, index) => (
              <Card
                key={index}
                className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                data-oid="2yk:on1"
              >
                <CardContent className="p-6" data-oid="0n_01:p">
                  <div
                    className="flex items-center justify-between"
                    data-oid="4o8320r"
                  >
                    <div data-oid="ictbua3">
                      <p
                        className="text-sm font-medium text-muted-foreground"
                        data-oid="z:1h9nk"
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-2xl font-bold text-foreground"
                        data-oid="7ld9jbe"
                      >
                        {stat.value}
                      </p>
                      <p
                        className={`text-xs ${stat.color} mt-1`}
                        data-oid=".d_pavo"
                      >
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-muted/30 ${stat.color}`}
                      data-oid="0s.:4c1"
                    >
                      <stat.icon className="h-5 w-5" data-oid="1prt-e9" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="0-h2gql"
          >
            <CardHeader data-oid="_d1s2wc">
              <div
                className="flex items-center justify-between"
                data-oid="dlm.7h8"
              >
                <div data-oid="dfysw21">
                  <CardTitle
                    className="text-xl font-bold text-foreground flex items-center"
                    data-oid="k1uuch7"
                  >
                    <History
                      className="h-5 w-5 mr-2 text-primary"
                      data-oid="k4.pbie"
                    />
                    Recent Activity
                  </CardTitle>
                  <CardDescription
                    className="text-muted-foreground mt-1"
                    data-oid="z.7qrd1"
                  >
                    Your latest conversations and interactions
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-accent/50"
                  data-oid="arabnsk"
                >
                  <BarChart3 className="h-4 w-4 mr-2" data-oid="stzxoox" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="rh0aryr">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} data-oid="erhepsm">
                  <div
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                    data-oid="60xhi8:"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="gz5fuoc"
                    >
                      <div className="flex-shrink-0" data-oid="e3gm6:-">
                        <div
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                          data-oid="bke:t48"
                        >
                          <MessageSquare
                            className="h-5 w-5 text-primary"
                            data-oid="z9z-ew."
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0" data-oid="0hbbka:">
                        <h3
                          className="text-sm font-medium text-foreground truncate"
                          data-oid="5218zjm"
                        >
                          {activity.title}
                        </h3>
                        <div
                          className="flex items-center space-x-2 mt-1"
                          data-oid="gjz5.q8"
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            data-oid="v.nh:qh"
                          >
                            {activity.model}
                          </Badge>
                          <span
                            className="text-xs text-muted-foreground"
                            data-oid="m0dv-ww"
                          >
                            •
                          </span>
                          <span
                            className="text-xs text-muted-foreground"
                            data-oid="t55:4_:"
                          >
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="48lc4:5"
                    >
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                        data-oid="u7nz-pi"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <Separator className="mt-4" data-oid="4swe2a4" />
                  )}
                </div>
              ))}

              <div className="pt-4 text-center" data-oid="qajop49">
                <Button
                  variant="outline"
                  className="w-full hover:bg-accent/50"
                  data-oid="2kpas9g"
                >
                  <History className="h-4 w-4 mr-2" data-oid="r4_2uoc" />
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Insights */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="33s7z2r"
          >
            <CardHeader data-oid="7.epx7a">
              <CardTitle
                className="text-xl font-bold text-foreground flex items-center"
                data-oid="j6-f9dy"
              >
                <TrendingUp
                  className="h-5 w-5 mr-2 text-primary"
                  data-oid="fukkmwj"
                />
                Usage Insights
              </CardTitle>
              <CardDescription
                className="text-muted-foreground"
                data-oid="eve0s7u"
              >
                Discover patterns in your AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="lqw1in_">
              <div
                className="text-center p-8 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                data-oid="6.x6wej"
              >
                <BarChart3
                  className="h-16 w-16 text-primary mx-auto mb-4 animate-float"
                  data-oid="217-gmx"
                />

                <h3
                  className="text-lg font-semibold text-foreground mb-2"
                  data-oid="dip8f:t"
                >
                  Advanced Analytics Coming Soon
                </h3>
                <p
                  className="text-sm text-muted-foreground max-w-md mx-auto"
                  data-oid="8w234f:"
                >
                  Get detailed insights into your usage patterns, favorite
                  models, most productive times, and personalized
                  recommendations to enhance your AI experience.
                </p>
                <div
                  className="flex items-center justify-center space-x-4 mt-6"
                  data-oid="5ehyf:x"
                >
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="wxf8ueq"
                  >
                    <Zap
                      className="h-4 w-4 mr-1 text-yellow-500"
                      data-oid="0718w38"
                    />
                    Performance tracking
                  </div>
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="7gv4w6_"
                  >
                    <Brain
                      className="h-4 w-4 mr-1 text-purple-500"
                      data-oid="_s_0agx"
                    />
                    AI recommendations
                  </div>
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="n82ooq9"
                  >
                    <Calendar
                      className="h-4 w-4 mr-1 text-blue-500"
                      data-oid="ep.li44"
                    />
                    Usage trends
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50"
        data-oid="b:bqxax"
      >
        <p data-oid="3g7sd4t">
          PyscoutAI - Your AI Companion • Activity Dashboard
        </p>
      </footer>
    </main>
  );
}
