import { GeistSans } from "geist/font/sans";
import { Poppins } from "next/font/google";

import "./globals.css";
import { cn } from "@/utils";
import { headers } from "next/headers";

import { AuthProvider } from "@/app/contexts/AuthContext";
import AppWithProviders from "@/app/AppWithProviders";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const revalidate = 0;

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  style: "normal",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerURL = headers().get("x-url");
  // console.log(headerURL);

  return (
    <html lang="en" className={cn(poppins.variable, GeistSans.className)}>
      <AuthProvider>
        <AppWithProviders headerURL={headerURL}> {children}</AppWithProviders>
      </AuthProvider>
    </html>
  );
}
