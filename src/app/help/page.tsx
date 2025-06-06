"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
      ],
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
      ],
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
      ],
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
      ],
    },
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      action: "mailto:support@pyscoutai.com",
      color: "bg-blue-500",
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      icon: Book,
      action: "#",
      color: "bg-purple-500",
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: Users,
      action: "#",
      color: "bg-green-500",
    },
    {
      title: "Feature Requests",
      description: "Suggest new features",
      icon: Star,
      action: "#",
      color: "bg-orange-500",
    },
  ];

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          searchQuery === "" ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.articles.length > 0);

  return (
    <main
      className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20"
      data-oid="lhag.67"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid="c9-4y7v"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto"
          data-oid="kr5u5x_"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="jchxc5m"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="pc52c47" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="0rnuxg2">
            Help & Support
          </h1>
          <div className="w-16" data-oid="p-uxmmb"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full"
        data-oid="7bc4qhu"
      >
        <div
          className="space-y-8 animate-in fade-in-50 duration-500"
          data-oid="ovxb8v."
        >
          {/* Hero Section */}
          <div className="text-center space-y-4" data-oid="8mbe_ct">
            <div
              className="h-20 w-20 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 mx-auto"
              data-oid="4s:hi.r"
            >
              <div
                className="h-full w-full rounded-full bg-background flex items-center justify-center"
                data-oid="y9l:y3a"
              >
                <HelpCircle
                  className="h-8 w-8 text-primary"
                  data-oid="9djijta"
                />
              </div>
            </div>
            <h2
              className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              data-oid="472jwjt"
            >
              How can we help you?
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              data-oid="6m9hzdb"
            >
              Find answers to common questions, explore our documentation, or
              get in touch with our support team.
            </p>
          </div>

          {/* Search */}
          <Card
            className="glassmorphism shadow-lg border-border/50 max-w-2xl mx-auto"
            data-oid="io96zwm"
          >
            <CardContent className="p-6" data-oid="z2uplj2">
              <div className="relative" data-oid="q:nz-1y">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  data-oid=".2gs3f:"
                />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base focus:border-primary"
                  data-oid="m-k2vpf"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-oid="t-ww78s"
          >
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50 cursor-pointer group"
                data-oid="pone3xj"
              >
                <CardContent className="p-6 text-center" data-oid="ezasri9">
                  <div
                    className={`h-12 w-12 rounded-full ${action.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                    data-oid="27j8lj7"
                  >
                    <action.icon
                      className="h-6 w-6 text-white"
                      data-oid="sgyyiiw"
                    />
                  </div>
                  <h3
                    className="font-semibold text-foreground mb-2"
                    data-oid="yc1a4gu"
                  >
                    {action.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="bsp79nd"
                  >
                    {action.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-oid="qqpgrmy"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" data-oid="pv0w7x3" />
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6" data-oid="8xtm1ow">
            <h3
              className="text-2xl font-bold text-foreground"
              data-oid="nnijnbd"
            >
              Frequently Asked Questions
            </h3>

            {searchQuery && (
              <p className="text-sm text-muted-foreground" data-oid="48qlp58">
                {filteredCategories.reduce(
                  (total, cat) => total + cat.articles.length,
                  0,
                )}{" "}
                results found for "{searchQuery}"
              </p>
            )}

            {filteredCategories.length === 0 && searchQuery && (
              <Card
                className="glassmorphism border-border/50"
                data-oid="-5cjp2p"
              >
                <CardContent className="p-8 text-center" data-oid="xx8g.zf">
                  <Search
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                    data-oid="4k9h8y4"
                  />
                  <h3
                    className="font-semibold text-foreground mb-2"
                    data-oid="y_8_tbn"
                  >
                    No results found
                  </h3>
                  <p className="text-muted-foreground" data-oid="dbau:zc">
                    Try adjusting your search terms or browse our categories
                    below.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2" data-oid="n7:j1zg">
              {(searchQuery ? filteredCategories : faqCategories).map(
                (category, index) => (
                  <Card
                    key={index}
                    className="glassmorphism shadow-lg border-border/50 hover:shadow-xl transition-all duration-300"
                    data-oid="dl_w11j"
                  >
                    <CardHeader data-oid="tedb6il">
                      <CardTitle
                        className="flex items-center text-lg"
                        data-oid="5v.2b:n"
                      >
                        <category.icon
                          className={`h-5 w-5 mr-3 ${category.color}`}
                          data-oid="h76:py7"
                        />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3" data-oid="95vco_v">
                      {category.articles.map((article, articleIndex) => (
                        <div key={articleIndex} data-oid="t6ncx_k">
                          <div
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
                            data-oid="fxf20dd"
                          >
                            <div className="flex-1" data-oid="htqnb.2">
                              <p
                                className="text-sm font-medium text-foreground group-hover:text-primary transition-colors"
                                data-oid="4j5.aa8"
                              >
                                {article.title}
                              </p>
                            </div>
                            <div
                              className="flex items-center space-x-2"
                              data-oid="npgsn0u"
                            >
                              <Badge
                                variant={
                                  article.popularity === "high"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                                data-oid="or9mgn4"
                              >
                                {article.popularity === "high" && (
                                  <ThumbsUp
                                    className="h-3 w-3 mr-1"
                                    data-oid="cx-cxlo"
                                  />
                                )}
                                {article.popularity}
                              </Badge>
                              <ExternalLink
                                className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                data-oid="lziess-"
                              />
                            </div>
                          </div>
                          {articleIndex < category.articles.length - 1 && (
                            <Separator className="ml-3" data-oid="324q3bl" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>

          {/* Contact Section */}
          <Card
            className="glassmorphism shadow-xl border-border/50"
            data-oid="op-ouil"
          >
            <CardContent className="p-8 text-center" data-oid="8_-y3aa">
              <MessageCircle
                className="h-16 w-16 text-primary mx-auto mb-4 animate-float"
                data-oid="86:9y_r"
              />
              <h3
                className="text-xl font-bold text-foreground mb-2"
                data-oid="g4ynlrd"
              >
                Still need help?
              </h3>
              <p
                className="text-muted-foreground mb-6 max-w-2xl mx-auto"
                data-oid="_jxdm4."
              >
                Can't find what you're looking for? Our support team is here to
                help you get the most out of PyscoutAI.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                data-oid="p.qlp8o"
              >
                <Button
                  className="bg-primary hover:bg-primary/90"
                  data-oid="xjdhlj1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" data-oid="q9i:5-x" />
                  Contact Support
                </Button>
                <Button variant="outline" data-oid="cfr1e_3">
                  <Book className="h-4 w-4 mr-2" data-oid="3f:.oiv" />
                  Browse Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50"
        data-oid="9dlifzk"
      >
        <p data-oid="b4-.quy">
          PyscoutAI - Your AI Companion • Help & Support Center
        </p>
      </footer>
    </main>
  );
}
