
"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render placeholder buttons or null to avoid hydration mismatch
    return (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" disabled className="w-24 justify-start">
          <Sun className="mr-2 h-4 w-4" /> Light
        </Button>
        <Button variant="outline" size="sm" disabled className="w-24 justify-start">
          <Moon className="mr-2 h-4 w-4" /> Dark
        </Button>
        <Button variant="outline" size="sm" disabled className="w-24 justify-start">
          <Laptop className="mr-2 h-4 w-4" /> System
        </Button>
      </div>
    );
  }

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Laptop },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((t) => (
        <Button
          key={t.value}
          variant={theme === t.value ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(t.value)}
          className={cn("w-full sm:w-auto justify-start min-w-[100px]", {
            "bg-primary text-primary-foreground hover:bg-primary/90": theme === t.value,
          })}
          aria-pressed={theme === t.value}
        >
          <t.icon className="mr-2 h-4 w-4" />
          {t.name}
        </Button>
      ))}
    </div>
  )
}
