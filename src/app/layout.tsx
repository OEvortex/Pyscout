import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// Removed SidebarProvider and AppSidebar imports

export const metadata: Metadata = {
  title: "PyscoutAI",
  description: "A modern chatbot web app inspired by Gemini",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-oid="iefzxg3">
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
        data-oid="059e64g"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Default to dark theme like Gemini
          enableSystem
          disableTransitionOnChange
          data-oid="fouc.d6"
        >
          {/* Removed SidebarProvider and AppSidebar */}
          {children}
          <Toaster data-oid="2211p.g" />
        </ThemeProvider>
      </body>
    </html>
  );
}
