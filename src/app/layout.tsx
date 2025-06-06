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
    <html lang="en" suppressHydrationWarning data-oid="12:c2hz">
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
        data-oid="wxpb0os"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Default to dark theme like Gemini
          enableSystem
          disableTransitionOnChange
          data-oid="1pjh7_n"
        >
          {/* Removed SidebarProvider and AppSidebar */}
          {children}
          <Toaster data-oid="7o34:k_" />
        </ThemeProvider>
      </body>
    </html>
  );
}
