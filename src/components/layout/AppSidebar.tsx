
"use client"

import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, SquarePen, Bot, Settings } from 'lucide-react'; // Added Settings
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push(`/?newChat=true&ts=${Date.now()}`);
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-3 flex flex-col items-start space-y-3">
        <div className="flex w-full items-center justify-between">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 self-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className={cn(
            "flex items-center gap-2 pt-1 group-data-[collapsible=icon]:hidden",
            "animate-in fade-in duration-300 ease-out"
          )}
        >
           <Bot className="h-7 w-7 text-primary" />
           <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">PyscoutAI</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewChat}
              tooltip={{children: "New Chat", side: "right", align: "center"}}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
            >
              <SquarePen className="text-primary group-hover:text-sidebar-primary-foreground" />
              <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={navigateToSettings}
              tooltip={{children: "Settings", side: "right", align: "center"}}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
