import { GeistSans } from "geist/font/sans";
import { Poppins } from "next/font/google";
import { IconBell, IconHome } from "@tabler/icons-react";

import "./globals.css";
import { cn } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { headers } from "next/headers";

import { AuthContext, AuthProvider } from "@/app/contexts/AuthContext";
import Link from "next/link";
import LinkButton from "@/components/LinkButton";
import ProfileImage from "@/components/ProfileImage";
import Button from "@/components/Button";
import LogoutButton from "@/components/LogoutButton";
import { useContext } from "react";
import AppWithProviders from "@/app/AppWithProviders";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

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

// function AppWithProviders({
//   children,
//   headers,
// }: {
//   children: React.ReactNode;
//   headers: Headers;
// }) {
//   "use client";
//   const { session } = useContext(AuthContext);

//   const fullUrl = headers.get("x-url") || "";

//   const path = new URL(fullUrl).pathname;

//   const NavRight = () => {
//     console.log(session);
//     if (session && path !== "/onboarding" && path !== "/survey") {
//       return (
//         <div className="h-full flex justify-center items-center gap-4 px-4">
//           <Link href="/home">
//             <IconHome width={30} height={30} />
//           </Link>
//           <Link href="/notifications">
//             <IconBell width={30} height={30} />
//           </Link>
//           <ProfileImage />
//           <LogoutButton />
//         </div>
//       );
//     } else if (session) {
//       return;
//     } else {
//       return (
//         <div className="flex gap-3">
//           <div className="shrink-0">
//             <LinkButton href="/login">
//               <p>Login</p>
//             </LinkButton>
//           </div>
//           <div className="shrink-0">
//             <LinkButton href="/login">
//               <p>Sign Up</p>
//             </LinkButton>
//           </div>
//         </div>
//       );
//     }
//   };
//   return (
//     <body className="bg-background text-foreground">
//       <main className="min-h-screen flex flex-col items-center">
//         <div className="w-full">
//           <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 p-3">
//             <div className="w-full max-w-4xl flex justify-between items-center  ">
//               <Link href="/home">
//                 <div className="flex gap-2 justify-center items-center">
//                   <Image src="/flock.svg" alt="" width={30} height={30} />
//                   <p className="font-poppins font-semibold text-lg">Flock</p>
//                 </div>{" "}
//               </Link>
//             </div>
//             <NavRight />
//           </nav>
//         </div>
//         {children}
//       </main>
//     </body>
//   );
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerURL = headers().get("x-url");
  console.log(headerURL);

  // const NavRight = () => {
  //   console.log(user);
  //   if (user && path !== "/onboarding" && path !== "/survey") {
  //     return (
  //       <div className="h-full flex justify-center items-center gap-4 px-4">
  //         <Link href="/home">
  //           <IconHome width={30} height={30} />
  //         </Link>
  //         <Link href="/notifications">
  //           <IconBell width={30} height={30} />
  //         </Link>
  //         <ProfileImage />
  //         <LogoutButton />
  //       </div>
  //     );
  //   } else if (user) {
  //     return;
  //   } else {
  //     return (
  //       <div className="flex gap-3">
  //         <div className="shrink-0">
  //           <LinkButton href="/login">
  //             <p>Login</p>
  //           </LinkButton>
  //         </div>
  //         <div className="shrink-0">
  //           <LinkButton href="/login">
  //             <p>Sign Up</p>
  //           </LinkButton>
  //         </div>
  //       </div>
  //     );
  //   }
  // };
  return (
    <html lang="en" className={cn(poppins.variable, GeistSans.className)}>
      <AuthProvider>
        <AppWithProviders headerURL={headerURL}> {children}</AppWithProviders>
      </AuthProvider>
    </html>
  );
}
