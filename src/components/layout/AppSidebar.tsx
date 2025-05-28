
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
import { ThemeToggle } from '@/components/chat/ThemeToggle';
import { ModelSelector } from '@/components/chat/ModelSelector'; // New import
import { Button } from '@/components/ui/button';
import { Menu, SquarePen, Bot } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    // Add a timestamp to ensure the URL changes and triggers the effect in page.tsx
    router.push(`/?newChat=true&ts=${Date.now()}`);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-3 items-start space-y-2">
        <div className="flex items-center justify-between w-full">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu />
            </Button>
          </SidebarTrigger>
        </div>
        <div className="flex items-center gap-2 px-1 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hidden">
           <Bot className="h-6 w-6 text-primary" />
           <h1 className="text-lg font-semibold text-foreground">ChimpChat</h1>
        </div>
         {/* Model Selector Added Here */}
        <div className="w-full pt-1 group-data-[collapsible=icon]:px-1">
          <ModelSelector />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleNewChat}
              tooltip={{children: "New Chat", side: "right", align: "center"}}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9"
            >
              <SquarePen />
              <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Add more navigation items here if needed */}
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
