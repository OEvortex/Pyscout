
"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render placeholder to avoid hydration mismatch
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="cursor-pointer border-2 opacity-50">
            <CardContent className="p-4 text-center space-y-2">
              <div className="h-8 w-8 mx-auto bg-muted rounded-full animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const themes = [
    { 
      name: "Light", 
      value: "light", 
      icon: Sun,
      description: "Clean and bright",
      preview: "bg-gradient-to-br from-white to-gray-50"
    },
    { 
      name: "Dark", 
      value: "dark", 
      icon: Moon,
      description: "Easy on the eyes",
      preview: "bg-gradient-to-br from-gray-900 to-black"
    },
    { 
      name: "System", 
      value: "system", 
      icon: Laptop,
      description: "Matches your device",
      preview: "bg-gradient-to-br from-gray-400 to-gray-600"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Choose how PyscoutAI appears on your device
      </div>
      
      <div className="grid gap-3 md:grid-cols-3">
        {themes.map((t) => (
          <Card
            key={t.value}
            className={cn(
              "cursor-pointer border-2 transition-all duration-200 hover:shadow-md",
              theme === t.value 
                ? "border-primary shadow-lg ring-2 ring-primary/20" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setTheme(t.value)}
          >
            <CardContent className="p-4 text-center space-y-3">
              {/* Preview */}
              <div className={cn(
                "h-12 w-full rounded-md border relative overflow-hidden",
                t.preview
              )}>
                {theme === t.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Icon and Label */}
              <div className="space-y-1">
                <t.icon className={cn(
                  "h-5 w-5 mx-auto transition-colors",
                  theme === t.value ? "text-primary" : "text-muted-foreground"
                )} />
                <h3 className={cn(
                  "font-medium text-sm transition-colors",
                  theme === t.value ? "text-primary" : "text-foreground"
                )}>
                  {t.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Alternative Button Style */}
      <div className="pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(t.value)}
              className={cn("justify-start min-w-[100px]", {
                "bg-primary text-primary-foreground hover:bg-primary/90": theme === t.value,
              })}
              aria-pressed={theme === t.value}
            >
              <t.icon className="mr-2 h-4 w-4" />
              {t.name}
              {theme === t.value && <Check className="ml-auto h-3 w-3" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
