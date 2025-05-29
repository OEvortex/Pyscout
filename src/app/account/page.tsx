
"use client";

import React from 'react';
// Removed SidebarInset import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen overflow-y-auto p-4 md:p-8 items-center justify-center bg-background"> {/* Replaced SidebarInset */}
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <UserCog className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-semibold">Manage Account</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            This is a placeholder page for account management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            In a real application, you would be able to update your profile,
            change your password, manage subscriptions, etc.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-xs text-muted-foreground">
        PyscoutAI - Account Settings
      </footer>
    </main>
  );
}
