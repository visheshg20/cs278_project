import { GeistSans } from "geist/font/sans";
import { Poppins } from "next/font/google";

import "./globals.css";
import { cn } from "@/utils";
import { headers } from "next/headers";

import { AuthProvider } from "@/app/contexts/AuthContext";
import AppWithProviders from "@/app/AppWithProviders";
import { ModalProvider } from "./contexts/ModalContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Flock",
  description: "The best way to make new friends at Stanford",
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

  return (
    <html lang="en" className={cn(poppins.variable, GeistSans.className)}>
      <AuthProvider>
        <ModalProvider>
          <AppWithProviders headerURL={headerURL}> {children}</AppWithProviders>
        </ModalProvider>
      </AuthProvider>
    </html>
  );
}
