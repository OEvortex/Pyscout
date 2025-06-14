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
  UserCog,
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const accountFeatures = [
    { icon: Mail, label: "Email", value: "user@example.com", verified: true },
    { icon: Calendar, label: "Member Since", value: "January 2024" },
    { icon: Shield, label: "Security", value: "2FA Enabled" },
    { icon: Crown, label: "Plan", value: "Free Forever" },
  ];

  return (
    <main
      className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20"
      data-oid="w6d-b1p"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid="8ce_7e8"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-4xl mx-auto"
          data-oid="f2t:03d"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="4z-hnrd"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="d6n77f_" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="lv_1cqe">
            Account Management
          </h1>
          <div className="w-16" data-oid="_--mvci"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full"
        data-oid="ann5hk_"
      >
        <div
          className="space-y-6 animate-in fade-in-50 duration-500"
          data-oid="8ulm:_v"
        >
          {/* Profile Card */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="l409v:p"
          >
            <CardHeader className="text-center pb-6" data-oid="q902o0v">
              <div className="relative mx-auto mb-4" data-oid="wevg7jw">
                <div
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 mx-auto"
                  data-oid="l5jw.92"
                >
                  <div
                    className="h-full w-full rounded-full bg-background flex items-center justify-center"
                    data-oid="6jl7-4y"
                  >
                    <User
                      className="h-10 w-10 text-primary"
                      data-oid="elc6933"
                    />
                  </div>
                </div>
                <Badge
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600"
                  data-oid="65z0hvn"
                >
                  Active
                </Badge>
              </div>
              <CardTitle
                className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                data-oid="qo_24uv"
              >
                PyscoutAI User
              </CardTitle>
              <CardDescription
                className="text-muted-foreground mt-2"
                data-oid="zt9nhoe"
              >
                Welcome to your account dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="sdx4axl">
              {/* Account Details */}
              <div className="grid gap-4 md:grid-cols-2" data-oid="hj4padu">
                {accountFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    data-oid="24v:of1"
                  >
                    <div className="flex-shrink-0" data-oid="ims9.lb">
                      <feature.icon
                        className="h-5 w-5 text-primary"
                        data-oid="yt7xn5u"
                      />
                    </div>
                    <div className="flex-1 min-w-0" data-oid="sbz0puh">
                      <p
                        className="text-sm font-medium text-foreground"
                        data-oid="7xgw65f"
                      >
                        {feature.label}
                      </p>
                      <p
                        className="text-sm text-muted-foreground truncate"
                        data-oid="ab-jm6_"
                      >
                        {feature.value}
                      </p>
                    </div>
                    {feature.verified && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-oid="vhvkrhs"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <Separator data-oid="wxehw7t" />

              {/* Quick Actions */}
              <div className="space-y-3" data-oid="ndgcp16">
                <h3
                  className="text-lg font-semibold text-foreground"
                  data-oid="w7kg5is"
                >
                  Quick Actions
                </h3>
                <div className="grid gap-3 md:grid-cols-2" data-oid="xwxmh12">
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="p2.68np"
                  >
                    <UserCog className="h-4 w-4 mr-3" data-oid="pmk.nws" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="xu:t_jq"
                  >
                    <Shield className="h-4 w-4 mr-3" data-oid="likwwmi" />
                    Security Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="_1fdemd"
                  >
                    <Mail className="h-4 w-4 mr-3" data-oid="bkz.gwe" />
                    Email Preferences
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="askvr0."
                  >
                    <Crown className="h-4 w-4 mr-3" data-oid="hgh4mtz" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>

              <Separator data-oid="pcqgttz" />

              {/* Coming Soon Notice */}
              <div
                className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                data-oid="jpafycm"
              >
                <UserCog
                  className="h-12 w-12 text-primary mx-auto mb-3 animate-float"
                  data-oid="znv1w97"
                />

                <h3
                  className="text-lg font-semibold text-foreground mb-2"
                  data-oid="k21fjbv"
                >
                  Full Account Management Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground" data-oid="lnup2nv">
                  Advanced profile management, security settings, and
                  personalization options are currently in development.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50"
        data-oid="bjyk2gt"
      >
        <p data-oid="hgh-hgr">
          PyscoutAI - Your AI Companion • Account Management
        </p>
      </footer>
    </main>
  );
}
