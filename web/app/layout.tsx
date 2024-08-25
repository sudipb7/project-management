import type { Metadata } from "next";
import { Space_Grotesk as FontSans, Space_Mono as FontMono } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

export const metadata: Metadata = {
  title: "Columnz",
  description: "Project Management made easy.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <AuthProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontMono.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="columnz-theme"
          >
            <ModalProvider>
              {children}
              <Toaster />
            </ModalProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
