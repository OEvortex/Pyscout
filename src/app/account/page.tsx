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
      data-oid="3w227-f"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid="aysy:hd"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-4xl mx-auto"
          data-oid="7z0:zr_"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="f20v5ep"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="b9otqgx" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="mzf98oo">
            Account Management
          </h1>
          <div className="w-16" data-oid="66.vanh"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full"
        data-oid="c.1u4kt"
      >
        <div
          className="space-y-6 animate-in fade-in-50 duration-500"
          data-oid="6:g7eq1"
        >
          {/* Profile Card */}
          <Card
            className="glassmorphism shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            data-oid="ttrmj8s"
          >
            <CardHeader className="text-center pb-6" data-oid="oiu:k_c">
              <div className="relative mx-auto mb-4" data-oid="qqy6_eo">
                <div
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 mx-auto"
                  data-oid="lmain_h"
                >
                  <div
                    className="h-full w-full rounded-full bg-background flex items-center justify-center"
                    data-oid=".4eb1np"
                  >
                    <User
                      className="h-10 w-10 text-primary"
                      data-oid="ucmh62-"
                    />
                  </div>
                </div>
                <Badge
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600"
                  data-oid="iyjb7qq"
                >
                  Active
                </Badge>
              </div>
              <CardTitle
                className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                data-oid="6dopdp2"
              >
                PyscoutAI User
              </CardTitle>
              <CardDescription
                className="text-muted-foreground mt-2"
                data-oid="kcpdfjj"
              >
                Welcome to your account dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-oid="bvhxwbv">
              {/* Account Details */}
              <div className="grid gap-4 md:grid-cols-2" data-oid="6tvzvvm">
                {accountFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    data-oid="4ndi.u5"
                  >
                    <div className="flex-shrink-0" data-oid="ubahey4">
                      <feature.icon
                        className="h-5 w-5 text-primary"
                        data-oid="5y4y4ao"
                      />
                    </div>
                    <div className="flex-1 min-w-0" data-oid="jdco79d">
                      <p
                        className="text-sm font-medium text-foreground"
                        data-oid="2_zrd1h"
                      >
                        {feature.label}
                      </p>
                      <p
                        className="text-sm text-muted-foreground truncate"
                        data-oid="zckx3uq"
                      >
                        {feature.value}
                      </p>
                    </div>
                    {feature.verified && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-oid="qlgfaes"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <Separator data-oid="2go69lx" />

              {/* Quick Actions */}
              <div className="space-y-3" data-oid="0i8:hjq">
                <h3
                  className="text-lg font-semibold text-foreground"
                  data-oid="wjl6n:5"
                >
                  Quick Actions
                </h3>
                <div className="grid gap-3 md:grid-cols-2" data-oid="p935zqs">
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="lj1yl59"
                  >
                    <UserCog className="h-4 w-4 mr-3" data-oid="vnfky87" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="htkr.5l"
                  >
                    <Shield className="h-4 w-4 mr-3" data-oid="emak7xp" />
                    Security Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="eojjww8"
                  >
                    <Mail className="h-4 w-4 mr-3" data-oid=".6eco4d" />
                    Email Preferences
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 justify-start hover:bg-accent/50"
                    data-oid="bed8d97"
                  >
                    <Crown className="h-4 w-4 mr-3" data-oid="ajevsv:" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>

              <Separator data-oid="s9rn3_o" />

              {/* Coming Soon Notice */}
              <div
                className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                data-oid=".xd.86p"
              >
                <UserCog
                  className="h-12 w-12 text-primary mx-auto mb-3 animate-float"
                  data-oid="8kcmrb4"
                />
                <h3
                  className="text-lg font-semibold text-foreground mb-2"
                  data-oid="3n.01tk"
                >
                  Full Account Management Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground" data-oid="cg7270h">
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
        data-oid="x79ge71"
      >
        <p data-oid=".m7x:e2">
          PyscoutAI - Your AI Companion • Account Management
        </p>
      </footer>
    </main>
  );
}
