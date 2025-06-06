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
  Rocket,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const mainFeatures = [
    {
      name: "Unlimited AI Chat Sessions",
      icon: Sparkles,
      description: "Chat without limits, anytime",
    },
    {
      name: "Access to 450+ Cutting-Edge Models",
      icon: Cpu,
      description: "Latest AI models at your fingertips",
    },
    {
      name: "Powered by Advanced AI Brains",
      icon: Brain,
      description: "GPT-4, Claude, Gemini, and more",
    },
    {
      name: "Lightning Fast Responses",
      icon: Zap,
      description: "Optimized for speed and performance",
    },
    {
      name: "Advanced System Prompt Customization",
      icon: CheckCircle,
      description: "Personalize your AI assistant",
    },
    {
      name: "All Future Updates Included",
      icon: Rocket,
      description: "Stay current with latest features",
    },
    {
      name: "Absolutely Zero Cost, Forever!",
      icon: InfinityIcon,
      description: "No hidden fees, ever",
    },
  ];

  const additionalFeatures = [
    {
      category: "Security & Privacy",
      items: ["End-to-end encryption", "No data retention", "GDPR compliant"],
    },
    {
      category: "Performance",
      items: ["99.9% uptime", "Global CDN", "Real-time responses"],
    },
    {
      category: "Support",
      items: [
        "24/7 community support",
        "Comprehensive documentation",
        "Regular updates",
      ],
    },
    {
      category: "Integrations",
      items: ["API access (coming soon)", "Browser extensions", "Mobile apps"],
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Developer",
      text: "PyscoutAI has transformed how I approach coding problems. The variety of models available is incredible!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Data Scientist",
      text: "Being completely free makes this accessible to everyone. The AI responses are consistently high-quality.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Student",
      text: "Perfect for learning and research. I love how I can customize the AI's personality for different tasks.",
      rating: 5,
    },
  ];

  return (
    <main
      className="flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20"
      data-oid="n9wg67z"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid="lqu03pb"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto"
          data-oid="euc7ihh"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid=".c7mjur"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="0_nhi-5" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="fhg9--d">
            Pricing
          </h1>
          <div className="w-16" data-oid="149m7d."></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full"
        data-oid="f3uqn7a"
      >
        <div
          className="space-y-12 animate-in fade-in-50 duration-500"
          data-oid="s_6pg3b"
        >
          {/* Hero Section */}
          <header className="text-center space-y-6" data-oid="mco8wge">
            <div className="relative" data-oid="jnld6re">
              <h1
                className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent py-2"
                data-oid="imegfbs"
              >
                PyscoutAI
              </h1>
              <Badge
                className="absolute -top-2 -right-8 bg-green-500 hover:bg-green-600 text-white animate-pulse"
                data-oid="4mnklgf"
              >
                FREE
              </Badge>
            </div>
            <h2
              className="text-xl sm:text-2xl font-semibold text-foreground"
              data-oid="r66c7mv"
            >
              Unrestricted Access, Completely Free!
            </h2>
            <p
              className="text-muted-foreground max-w-3xl mx-auto text-lg"
              data-oid="na-28bi"
            >
              Experience the full power of PyscoutAI with all features unlocked,
              at no cost. Ever.
            </p>
          </header>

          {/* Main Pricing Card */}
          <div className="flex justify-center" data-oid="nmld-vq">
            <Card
              className="w-full max-w-2xl glassmorphism shadow-2xl border-primary/20 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
              data-oid="-llg49g"
            >
              {/* Animated background */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-shimmer"
                data-oid="j6os5sn"
              ></div>

              <CardHeader
                className="text-center pb-6 relative"
                data-oid="eirijai"
              >
                <div
                  className="flex items-center justify-center space-x-2 mb-4"
                  data-oid="vy6axee"
                >
                  <InfinityIcon
                    className="h-8 w-8 text-primary animate-float"
                    data-oid="40c7_b:"
                  />

                  <Badge
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    data-oid="vhyp08w"
                  >
                    Forever Free
                  </Badge>
                </div>
                <CardTitle
                  className="text-3xl font-bold text-foreground"
                  data-oid="o0pdfz."
                >
                  PyscoutAI
                </CardTitle>
                <div
                  className="flex items-center justify-center space-x-2 mt-4"
                  data-oid="a7okpel"
                >
                  <span
                    className="text-4xl font-bold text-primary"
                    data-oid="o2-v:su"
                  >
                    $0
                  </span>
                  <div className="text-left" data-oid="oxci4:n">
                    <div
                      className="text-sm text-muted-foreground"
                      data-oid="u1hwilh"
                    >
                      / month
                    </div>
                    <div
                      className="text-xs text-muted-foreground"
                      data-oid="cl4d4:7"
                    >
                      Forever
                    </div>
                  </div>
                </div>
                <p
                  className="text-sm text-muted-foreground mt-2"
                  data-oid="dlj8xld"
                >
                  No catches, no hidden fees, no credit card required
                </p>
              </CardHeader>

              <CardContent className="space-y-6 relative" data-oid="pjkjd-8">
                {/* Main Features */}
                <div className="space-y-4" data-oid="x82hycc">
                  {mainFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                      data-oid="2pay-if"
                    >
                      <div className="flex-shrink-0 mt-0.5" data-oid="rtp4d0h">
                        <feature.icon
                          className="h-5 w-5 text-green-500"
                          data-oid="oe0g3bs"
                        />
                      </div>
                      <div className="flex-1" data-oid="x8:upj6">
                        <p
                          className="font-medium text-foreground"
                          data-oid="ze4qg09"
                        >
                          {feature.name}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-oid="5ghb08z"
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator data-oid=":ehff7n" />

                {/* CTA Button */}
                <Button
                  className="w-full h-14 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 text-primary-foreground text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => router.push("/")}
                  size="lg"
                  data-oid="9_pze1:"
                >
                  <Rocket className="h-5 w-5 mr-2" data-oid="_aca:r4" />
                  Start Chatting for Free
                </Button>

                <p
                  className="text-center text-xs text-muted-foreground"
                  data-oid="c04ior9"
                >
                  Join thousands of users already using PyscoutAI
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="space-y-6" data-oid="nv-obq9">
            <h3
              className="text-2xl font-bold text-center text-foreground"
              data-oid="rsja503"
            >
              Everything You Need, Included
            </h3>
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              data-oid="uaitllm"
            >
              {additionalFeatures.map((featureGroup, index) => (
                <Card
                  key={index}
                  className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                  data-oid="pt9gc:g"
                >
                  <CardHeader className="pb-3" data-oid="hy8081r">
                    <CardTitle
                      className="text-lg font-semibold text-foreground"
                      data-oid="_zt29sv"
                    >
                      {featureGroup.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2" data-oid=".o2dn-6">
                    {featureGroup.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-2"
                        data-oid="pcnp5bq"
                      >
                        <CheckCircle
                          className="h-4 w-4 text-green-500 flex-shrink-0"
                          data-oid="jz.k6yy"
                        />

                        <span
                          className="text-sm text-muted-foreground"
                          data-oid="cq8j3t-"
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-6" data-oid="n9o6cit">
            <h3
              className="text-2xl font-bold text-center text-foreground"
              data-oid="43og.uc"
            >
              What Users Are Saying
            </h3>
            <div className="grid gap-6 md:grid-cols-3" data-oid="kyixjwd">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                  data-oid="67s-q46"
                >
                  <CardContent className="p-6" data-oid=".e44pe5">
                    <div
                      className="flex items-center space-x-1 mb-4"
                      data-oid="xwrsf1t"
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          data-oid="1lx0r9r"
                        />
                      ))}
                    </div>
                    <p
                      className="text-sm text-muted-foreground mb-4 italic"
                      data-oid="h48_ena"
                    >
                      "{testimonial.text}"
                    </p>
                    <div data-oid="bpzu-qw">
                      <p
                        className="font-semibold text-foreground"
                        data-oid="qtsg6:2"
                      >
                        {testimonial.name}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="-j23kqm"
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <Card
            className="glassmorphism shadow-xl border-border/50"
            data-oid="m84_ctf"
          >
            <CardContent className="p-8" data-oid="xiovql2">
              <div
                className="grid gap-8 md:grid-cols-4 text-center"
                data-oid="9afml:i"
              >
                <div data-oid="_00nf60">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="0km3_-x"
                  >
                    <Users
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="4-lexei"
                    />

                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="bw68ja2"
                    >
                      10K+
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="kkrk476"
                  >
                    Active Users
                  </p>
                </div>
                <div data-oid="e1z8imz">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="w84:a22"
                  >
                    <Cpu
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="od.8gwf"
                    />

                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="su_1n21"
                    >
                      450+
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="ggup9qy"
                  >
                    AI Models
                  </p>
                </div>
                <div data-oid="g.05h88">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="nc.y86p"
                  >
                    <Globe
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="1k2z9mw"
                    />

                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="hd2jh-5"
                    >
                      99.9%
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="cqr:x3z"
                  >
                    Uptime
                  </p>
                </div>
                <div data-oid="hos2odn">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="8l4pj:v"
                  >
                    <InfinityIcon
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="qstxj91"
                    />

                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="ex-8.ea"
                    >
                      ∞
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="rx7wzt8"
                  >
                    Always Free
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card
            className="glassmorphism shadow-xl border-border/50"
            data-oid="tbam03p"
          >
            <CardHeader data-oid="n0___.r">
              <CardTitle
                className="text-xl font-bold text-foreground text-center"
                data-oid="fx_m8bk"
              >
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="zstj:nm">
              <div className="grid gap-4 md:grid-cols-2" data-oid="jw37dk4">
                <div className="space-y-2" data-oid="4p8jzm7">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="jx1xhm0"
                  >
                    Is PyscoutAI really free?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="6w6jlf9"
                  >
                    Yes! PyscoutAI is completely free with no hidden costs, no
                    premium tiers, and no credit card required.
                  </p>
                </div>
                <div className="space-y-2" data-oid="m588_p9">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="fcsx.68"
                  >
                    How many models can I use?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="f9p97yh"
                  >
                    You have unlimited access to all 450+ AI models including
                    GPT-4, Claude, Gemini, and many others.
                  </p>
                </div>
                <div className="space-y-2" data-oid="ae6skee">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="e4tk.yf"
                  >
                    Are there usage limits?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid=".e20pjb"
                  >
                    No usage limits! Chat as much as you want, when you want,
                    with any available model.
                  </p>
                </div>
                <div className="space-y-2" data-oid="qsq1gpp">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid=".:pp9vl"
                  >
                    How is this sustainable?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="h25_vi5"
                  >
                    We believe AI should be accessible to everyone. Our mission
                    is to democratize AI technology.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center p-6 text-xs text-muted-foreground border-t bg-background/50"
        data-oid="y27.io9"
      >
        <p data-oid="zyhx:n4">PyscoutAI - The Future of AI, Open to Everyone</p>
      </footer>
    </main>
  );
}
