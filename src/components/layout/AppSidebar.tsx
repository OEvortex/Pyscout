"use client";

import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, SquarePen, Bot, Settings } from "lucide-react"; // Added Settings
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push(`/?newChat=true&ts=${Date.now()}`);
  };

  const navigateToSettings = () => {
    router.push("/settings");
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      side="left"
      data-oid="5vs35d-"
    >
      <SidebarHeader
        className="p-3 flex flex-col items-start space-y-3"
        data-oid="kq0c4fo"
      >
        <div
          className="flex w-full items-center justify-between"
          data-oid="7tgf2hb"
        >
          <SidebarTrigger asChild data-oid="641w1yk">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 self-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
              data-oid="-ytz3ed"
            >
              <Menu className="h-5 w-5" data-oid="1f8z-9i" />
            </Button>
          </SidebarTrigger>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 pt-1 group-data-[collapsible=icon]:hidden",
            "animate-in fade-in duration-300 ease-out",
          )}
          data-oid="w0osl4e"
        >
          <Bot className="h-7 w-7 text-primary" data-oid="3vvdxvb" />
          <h1
            className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
            data-oid="ourne50"
          >
            PyscoutAI
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2" data-oid="da98x.y">
        <SidebarMenu data-oid="c0ba.ji">
          <SidebarMenuItem data-oid="y2u99pl">
            <SidebarMenuButton
              onClick={handleNewChat}
              tooltip={{ children: "New Chat", side: "right", align: "center" }}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
              data-oid="um56-69"
            >
              <SquarePen
                className="text-primary group-hover:text-sidebar-primary-foreground"
                data-oid="o3fxzwy"
              />

              <span
                className="group-data-[collapsible=icon]:hidden"
                data-oid="z1qj3vo"
              >
                New Chat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto" data-oid="j6w7man">
        <SidebarMenu data-oid="ootj6c0">
          <SidebarMenuItem data-oid="xqwd:2d">
            <SidebarMenuButton
              onClick={navigateToSettings}
              tooltip={{ children: "Settings", side: "right", align: "center" }}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              data-oid="gs1nofr"
            >
              <Settings className="h-5 w-5" data-oid=":_igqgm" />
              <span
                className="group-data-[collapsible=icon]:hidden"
                data-oid="3ms6_6a"
              >
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
