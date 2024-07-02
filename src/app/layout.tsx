// the global layout, which provides the styling, context, and other things
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import AuthProvider from "@context/AuthProvider";
import { Toaster } from "@components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "mystrymessage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={GeistSans.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
