
"use client"

import * as React from "react"
import { Settings, Moon, Sun } from "lucide-react" // Added Settings
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"


export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { state: sidebarState } = useSidebar(); // Get sidebar state

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-full group-data-[collapsible=icon]:w-9" /> 
  }

  const currentThemeIcon = theme === "light" || (theme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? <Sun className="h-[1.1rem] w-[1.1rem]" /> 
    : <Moon className="h-[1.1rem] w-[1.1rem]" />;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9"
            onClick={() => setTheme(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Settings className="h-[1.1rem] w-[1.1rem]" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            <div className="ml-auto group-data-[collapsible=icon]:hidden">
              {currentThemeIcon}
            </div>
          </Button>
        </TooltipTrigger>
        {sidebarState === "collapsed" && (
          <TooltipContent side="right" align="center">
            <p>Settings ({theme === "dark" ? "Dark" : "Light"} Theme)</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
