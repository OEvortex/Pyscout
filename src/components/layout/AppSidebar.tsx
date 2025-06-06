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
      data-oid="sr0n6ak"
    >
      <SidebarHeader
        className="p-3 flex flex-col items-start space-y-3"
        data-oid="k5n469e"
      >
        <div
          className="flex w-full items-center justify-between"
          data-oid="vs86goq"
        >
          <SidebarTrigger asChild data-oid="l4h5:ov">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 self-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
              data-oid="_wu41sp"
            >
              <Menu className="h-5 w-5" data-oid="7ogd.z5" />
            </Button>
          </SidebarTrigger>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 pt-1 group-data-[collapsible=icon]:hidden",
            "animate-in fade-in duration-300 ease-out",
          )}
          data-oid="v3e4y53"
        >
          <Bot className="h-7 w-7 text-primary" data-oid="a--6b9l" />
          <h1
            className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
            data-oid="9tlqpk7"
          >
            PyscoutAI
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2" data-oid="vci8aa9">
        <SidebarMenu data-oid="hql0:d2">
          <SidebarMenuItem data-oid="k-f9my0">
            <SidebarMenuButton
              onClick={handleNewChat}
              tooltip={{ children: "New Chat", side: "right", align: "center" }}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
              data-oid="y:_ylv6"
            >
              <SquarePen
                className="text-primary group-hover:text-sidebar-primary-foreground"
                data-oid="g81-3xy"
              />
              <span
                className="group-data-[collapsible=icon]:hidden"
                data-oid="v0zscvu"
              >
                New Chat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto" data-oid="tegw3-1">
        <SidebarMenu data-oid="_ykenjw">
          <SidebarMenuItem data-oid="8hf2d67">
            <SidebarMenuButton
              onClick={navigateToSettings}
              tooltip={{ children: "Settings", side: "right", align: "center" }}
              className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              data-oid="et35zj7"
            >
              <Settings className="h-5 w-5" data-oid="p5s7lc6" />
              <span
                className="group-data-[collapsible=icon]:hidden"
                data-oid="_0zd6oh"
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
