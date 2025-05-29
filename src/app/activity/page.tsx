
"use client";

import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActivityPage() {
  const router = useRouter();

  return (
    <SidebarInset className="flex flex-col h-screen overflow-y-auto p-4 md:p-8 items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <History className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-semibold">Activity</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            This is a placeholder page for viewing your activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Here, you would typically see a log of your recent actions,
            chat history summaries, or other relevant activity data.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-xs text-muted-foreground">
        PyscoutAI - Your Activity
      </footer>
    </SidebarInset>
  );
}
