
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
import { Menu, SquarePen, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push(`/?newChat=true&ts=${Date.now()}`);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-3 flex flex-col items-start space-y-3">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 self-start">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>

        <div className="flex items-center gap-2 pt-1 group-data-[collapsible=icon]:hidden">
           <Bot className="h-7 w-7 text-primary" />
           <h1 className="text-2xl font-semibold text-sidebar-foreground">PyscoutAI</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewChat}
              tooltip={{children: "New Chat", side: "right", align: "center"}}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150"
            >
              <SquarePen />
              <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
