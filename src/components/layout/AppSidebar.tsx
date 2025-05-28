
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
import { Button } from '@/components/ui/button';
import { Menu, SquarePen, Bot } from 'lucide-react'; // SquarePen for New Chat
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push(`/?newChat=true&ts=${Date.now()}`);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-3 items-start">
        <div className="flex items-center justify-between w-full mb-2">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu />
            </Button>
          </SidebarTrigger>
          {/* Placeholder for model selector if needed in future */}
        </div>
        <div className="flex items-center gap-2 px-1 w-full group-data-[collapsible=icon]:justify-center">
           <Bot className="h-6 w-6 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
           <h1 className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">ChimpChat</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleNewChat}
              tooltip={{children: "New Chat", side: "right", align: "center"}}
            >
              <SquarePen />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Add more navigation items here if needed */}
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto">
         {/* ThemeToggle is now styled as a settings button */}
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

