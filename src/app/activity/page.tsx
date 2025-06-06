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
      data-oid="ci6dsk4"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid=":tvnwza"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto"
          data-oid="3gbhgee"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="fchr:8p"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="z:kh_my" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="7n7qo2g">
            Activity Dashboard
          </h1>
          <div className="w-16" data-oid="8eb5jbv"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full"
        data-oid="wd1fsd5"
      >
        <div
          className="space-y-6 animate-in fade-in-50 duration-500"
          data-oid="jrj6s33"
        >
          {/* Stats Overview */}
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-oid="v0k.irq"
          >
            {activityStats.map((stat, index) => (
              <Card
                key={index}
                className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                data-oid="ic4re_w"
              >
                <CardContent className="p-6" data-oid="zkpdj:5">
                  <div
                    className="flex items-center justify-between"
                    data-oid="las4vx:"
                  >
                    <div data-oid="u8g7-ad">
                      <p
                        className="text-sm font-medium text-muted-foreground"
                        data-oid="jzjb.da"
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-2xl font-bold text-foreground"
                        data-oid="t2n2..m"
                      >
                        {stat.value}
                      </p>
                      <p
                        className={`text-xs ${stat.color} mt-1`}
                        data-oid="eml5ejs"
                      >
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-muted/30 ${stat.color}`}
                      data-oid="za.-g:6"
                    >
                      <stat.icon className="h-5 w-5" data-oid="1cks1y_" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="gyofy37"
          >
            <CardHeader data-oid="h:5gsg9">
              <div
                className="flex items-center justify-between"
                data-oid="uhqii_3"
              >
                <div data-oid="aklwhtl">
                  <CardTitle
                    className="text-xl font-bold text-foreground flex items-center"
                    data-oid="ut_jv6y"
                  >
                    <History
                      className="h-5 w-5 mr-2 text-primary"
                      data-oid="hpg9vr1"
                    />
                    Recent Activity
                  </CardTitle>
                  <CardDescription
                    className="text-muted-foreground mt-1"
                    data-oid="r_e7rmu"
                  >
                    Your latest conversations and interactions
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-accent/50"
                  data-oid="wqo9ump"
                >
                  <BarChart3 className="h-4 w-4 mr-2" data-oid="oioq8iq" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="mxb4jo6">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} data-oid="549jkrd">
                  <div
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                    data-oid="96s-qab"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid=":-2a9h6"
                    >
                      <div className="flex-shrink-0" data-oid="25kvt31">
                        <div
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                          data-oid="y66u2ew"
                        >
                          <MessageSquare
                            className="h-5 w-5 text-primary"
                            data-oid="wh5q4.l"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0" data-oid="dqx3vts">
                        <h3
                          className="text-sm font-medium text-foreground truncate"
                          data-oid="6qkz9i_"
                        >
                          {activity.title}
                        </h3>
                        <div
                          className="flex items-center space-x-2 mt-1"
                          data-oid="5v_8dht"
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            data-oid="t.amtnf"
                          >
                            {activity.model}
                          </Badge>
                          <span
                            className="text-xs text-muted-foreground"
                            data-oid="msozxs8"
                          >
                            •
                          </span>
                          <span
                            className="text-xs text-muted-foreground"
                            data-oid="-0vxacl"
                          >
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="py22gpg"
                    >
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                        data-oid="r5y70ax"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <Separator className="mt-4" data-oid="kxpwvou" />
                  )}
                </div>
              ))}

              <div className="pt-4 text-center" data-oid="ek_ofc2">
                <Button
                  variant="outline"
                  className="w-full hover:bg-accent/50"
                  data-oid="zob8wj4"
                >
                  <History className="h-4 w-4 mr-2" data-oid="es50st4" />
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Insights */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="ug0aqg2"
          >
            <CardHeader data-oid="d5jf3iu">
              <CardTitle
                className="text-xl font-bold text-foreground flex items-center"
                data-oid="mq98bla"
              >
                <TrendingUp
                  className="h-5 w-5 mr-2 text-primary"
                  data-oid="fqv2t2_"
                />
                Usage Insights
              </CardTitle>
              <CardDescription
                className="text-muted-foreground"
                data-oid="-h2d0sx"
              >
                Discover patterns in your AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="6xlt78w">
              <div
                className="text-center p-8 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                data-oid="qr_ums0"
              >
                <BarChart3
                  className="h-16 w-16 text-primary mx-auto mb-4 animate-float"
                  data-oid="1xrdxob"
                />
                <h3
                  className="text-lg font-semibold text-foreground mb-2"
                  data-oid="wn14tsz"
                >
                  Advanced Analytics Coming Soon
                </h3>
                <p
                  className="text-sm text-muted-foreground max-w-md mx-auto"
                  data-oid=".sbmix7"
                >
                  Get detailed insights into your usage patterns, favorite
                  models, most productive times, and personalized
                  recommendations to enhance your AI experience.
                </p>
                <div
                  className="flex items-center justify-center space-x-4 mt-6"
                  data-oid="c79t5m0"
                >
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="0y3pi7p"
                  >
                    <Zap
                      className="h-4 w-4 mr-1 text-yellow-500"
                      data-oid="21cvz7s"
                    />
                    Performance tracking
                  </div>
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="wy7u9q0"
                  >
                    <Brain
                      className="h-4 w-4 mr-1 text-purple-500"
                      data-oid="i3vdl.1"
                    />
                    AI recommendations
                  </div>
                  <div
                    className="flex items-center text-sm text-muted-foreground"
                    data-oid="_zfa_vx"
                  >
                    <Calendar
                      className="h-4 w-4 mr-1 text-blue-500"
                      data-oid="g9vdz:y"
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
        data-oid="guzmfic"
      >
        <p data-oid="ms:.x0y">
          PyscoutAI - Your AI Companion • Activity Dashboard
        </p>
      </footer>
    </main>
  );
}
