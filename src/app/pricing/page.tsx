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
      data-oid="f74x.st"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b"
        data-oid=".dyn16f"
      >
        <div
          className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto"
          data-oid="c-k5t6r"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
            data-oid="ni14hcd"
          >
            <ArrowLeft className="h-4 w-4 mr-2" data-oid="dlx3:zg" />
            Back
          </Button>
          <h1 className="text-xl font-semibold" data-oid="in:zhpn">
            Pricing
          </h1>
          <div className="w-16" data-oid=".29unsg"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full"
        data-oid="vqs223w"
      >
        <div
          className="space-y-12 animate-in fade-in-50 duration-500"
          data-oid="g1kej9x"
        >
          {/* Hero Section */}
          <header className="text-center space-y-6" data-oid="2l11r3-">
            <div className="relative" data-oid="n.m0x2l">
              <h1
                className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent py-2"
                data-oid="fi0iu06"
              >
                PyscoutAI
              </h1>
              <Badge
                className="absolute -top-2 -right-8 bg-green-500 hover:bg-green-600 text-white animate-pulse"
                data-oid="gdem.zl"
              >
                FREE
              </Badge>
            </div>
            <h2
              className="text-xl sm:text-2xl font-semibold text-foreground"
              data-oid="it3y1-a"
            >
              Unrestricted Access, Completely Free!
            </h2>
            <p
              className="text-muted-foreground max-w-3xl mx-auto text-lg"
              data-oid="7mt:5-h"
            >
              Experience the full power of PyscoutAI with all features unlocked,
              at no cost. Ever.
            </p>
          </header>

          {/* Main Pricing Card */}
          <div className="flex justify-center" data-oid="yp4b-:5">
            <Card
              className="w-full max-w-2xl glassmorphism shadow-2xl border-primary/20 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
              data-oid="hzx1lam"
            >
              {/* Animated background */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-shimmer"
                data-oid="x_ihsrt"
              ></div>

              <CardHeader
                className="text-center pb-6 relative"
                data-oid="caahr6b"
              >
                <div
                  className="flex items-center justify-center space-x-2 mb-4"
                  data-oid="fpavc3_"
                >
                  <InfinityIcon
                    className="h-8 w-8 text-primary animate-float"
                    data-oid="3e0edoj"
                  />
                  <Badge
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    data-oid="aw.72gk"
                  >
                    Forever Free
                  </Badge>
                </div>
                <CardTitle
                  className="text-3xl font-bold text-foreground"
                  data-oid="050icjv"
                >
                  PyscoutAI
                </CardTitle>
                <div
                  className="flex items-center justify-center space-x-2 mt-4"
                  data-oid="gcdi9yt"
                >
                  <span
                    className="text-4xl font-bold text-primary"
                    data-oid="-1foif8"
                  >
                    $0
                  </span>
                  <div className="text-left" data-oid="wjqcuo.">
                    <div
                      className="text-sm text-muted-foreground"
                      data-oid="39ebkky"
                    >
                      / month
                    </div>
                    <div
                      className="text-xs text-muted-foreground"
                      data-oid="csmi_ig"
                    >
                      Forever
                    </div>
                  </div>
                </div>
                <p
                  className="text-sm text-muted-foreground mt-2"
                  data-oid="5l_hxl3"
                >
                  No catches, no hidden fees, no credit card required
                </p>
              </CardHeader>

              <CardContent className="space-y-6 relative" data-oid="vw7ij6p">
                {/* Main Features */}
                <div className="space-y-4" data-oid="mewr:t1">
                  {mainFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                      data-oid="3.jc9ng"
                    >
                      <div className="flex-shrink-0 mt-0.5" data-oid="uj7b20x">
                        <feature.icon
                          className="h-5 w-5 text-green-500"
                          data-oid=".-4icnb"
                        />
                      </div>
                      <div className="flex-1" data-oid="or-t0r_">
                        <p
                          className="font-medium text-foreground"
                          data-oid="gh7z-ft"
                        >
                          {feature.name}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-oid="6ao187i"
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator data-oid="4k1:cjj" />

                {/* CTA Button */}
                <Button
                  className="w-full h-14 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 text-primary-foreground text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => router.push("/")}
                  size="lg"
                  data-oid="to718yr"
                >
                  <Rocket className="h-5 w-5 mr-2" data-oid="tvh9j_1" />
                  Start Chatting for Free
                </Button>

                <p
                  className="text-center text-xs text-muted-foreground"
                  data-oid="8gty3iv"
                >
                  Join thousands of users already using PyscoutAI
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="space-y-6" data-oid=".l8-nbl">
            <h3
              className="text-2xl font-bold text-center text-foreground"
              data-oid="tdma.0t"
            >
              Everything You Need, Included
            </h3>
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              data-oid="02h97f_"
            >
              {additionalFeatures.map((featureGroup, index) => (
                <Card
                  key={index}
                  className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                  data-oid="wp56io4"
                >
                  <CardHeader className="pb-3" data-oid=":r-v3q3">
                    <CardTitle
                      className="text-lg font-semibold text-foreground"
                      data-oid="78h-bv4"
                    >
                      {featureGroup.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2" data-oid="691.7x5">
                    {featureGroup.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-2"
                        data-oid="xu0june"
                      >
                        <CheckCircle
                          className="h-4 w-4 text-green-500 flex-shrink-0"
                          data-oid="9vofp_v"
                        />
                        <span
                          className="text-sm text-muted-foreground"
                          data-oid="_3ft-30"
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
          <div className="space-y-6" data-oid="ohlvqd7">
            <h3
              className="text-2xl font-bold text-center text-foreground"
              data-oid="3ye.b5w"
            >
              What Users Are Saying
            </h3>
            <div className="grid gap-6 md:grid-cols-3" data-oid="7jppm9q">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="glassmorphism hover:shadow-lg transition-all duration-300 border-border/50"
                  data-oid="4.w3nbl"
                >
                  <CardContent className="p-6" data-oid="00nyn6r">
                    <div
                      className="flex items-center space-x-1 mb-4"
                      data-oid="d0r9._j"
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          data-oid="lg36ogo"
                        />
                      ))}
                    </div>
                    <p
                      className="text-sm text-muted-foreground mb-4 italic"
                      data-oid="cwofj:9"
                    >
                      "{testimonial.text}"
                    </p>
                    <div data-oid="actj9ny">
                      <p
                        className="font-semibold text-foreground"
                        data-oid="o8f83ev"
                      >
                        {testimonial.name}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="usfm1n2"
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
            data-oid="-7eqfmp"
          >
            <CardContent className="p-8" data-oid="o:jpp5_">
              <div
                className="grid gap-8 md:grid-cols-4 text-center"
                data-oid="d_uftn9"
              >
                <div data-oid="mpg:64.">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="tvywa-x"
                  >
                    <Users
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="u8t0p.r"
                    />
                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="7gj39lu"
                    >
                      10K+
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="-dsxwnh"
                  >
                    Active Users
                  </p>
                </div>
                <div data-oid="c35gmb3">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="zh5r-3c"
                  >
                    <Cpu
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="vz__n9p"
                    />
                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="r:f:vp2"
                    >
                      450+
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid=":saaarq"
                  >
                    AI Models
                  </p>
                </div>
                <div data-oid="htosyky">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="7cv.oue"
                  >
                    <Globe
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="nsxomdi"
                    />
                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="sri1rfu"
                    >
                      99.9%
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="b:qplwd"
                  >
                    Uptime
                  </p>
                </div>
                <div data-oid="6ua7c7u">
                  <div
                    className="flex items-center justify-center mb-2"
                    data-oid="loazciq"
                  >
                    <InfinityIcon
                      className="h-6 w-6 text-primary mr-2"
                      data-oid="ajqsyda"
                    />
                    <span
                      className="text-2xl font-bold text-foreground"
                      data-oid="em5fgfc"
                    >
                      ∞
                    </span>
                  </div>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="7z:jnn-"
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
            data-oid="cb23izl"
          >
            <CardHeader data-oid="hk45-jo">
              <CardTitle
                className="text-xl font-bold text-foreground text-center"
                data-oid="eqvx2e4"
              >
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="c_lqyaq">
              <div className="grid gap-4 md:grid-cols-2" data-oid="x5ujpkr">
                <div className="space-y-2" data-oid="k_ku4y1">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="r19p55o"
                  >
                    Is PyscoutAI really free?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="oxeyc_n"
                  >
                    Yes! PyscoutAI is completely free with no hidden costs, no
                    premium tiers, and no credit card required.
                  </p>
                </div>
                <div className="space-y-2" data-oid="jk723g5">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="d9g8pz8"
                  >
                    How many models can I use?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid=".ps9z0b"
                  >
                    You have unlimited access to all 450+ AI models including
                    GPT-4, Claude, Gemini, and many others.
                  </p>
                </div>
                <div className="space-y-2" data-oid="20j2c:5">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="wab1en3"
                  >
                    Are there usage limits?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="z.g3vkw"
                  >
                    No usage limits! Chat as much as you want, when you want,
                    with any available model.
                  </p>
                </div>
                <div className="space-y-2" data-oid="09psip6">
                  <h4
                    className="font-semibold text-foreground"
                    data-oid="jgleovm"
                  >
                    How is this sustainable?
                  </h4>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="9qhkno2"
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
        data-oid="6-t3b5w"
      >
        <p data-oid="zmfxy9x">PyscoutAI - The Future of AI, Open to Everyone</p>
      </footer>
    </main>
  );
}
