"use client";

import { useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { IconBell, IconHome } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import ProfileImage from "@/components/ProfileImage";
import LogoutButton from "@/components/LogoutButton";
import LinkButton from "@/components/LinkButton";
import { ModalContext } from "@/app/contexts/ModalContext";

export default function AppWithProviders({
  children,
  headerURL,
}: {
  children: React.ReactNode;
  headerURL: string | null;
}) {
  const { session, user } = useContext(AuthContext);
  const { showModal, modalContent } = useContext(ModalContext);

  const pathname = usePathname();

  const NavRight = () => {
    if (session && pathname !== "/onboarding") {
      return (
        <div className="h-full flex justify-center items-center gap-4 px-4">
          <Link href="/home" className="w-8 h-8">
            <Image alt="" src="/home.svg" width={30} height={30} />
          </Link>
          <Link href="/messages" className="w-8 h-8">
            <Image alt="" src="/messages.svg" width={30} height={30} />
          </Link>
          {user && (
            <Link href={`/profiles/${user.uid}`}>
              <ProfileImage user={user} />
            </Link>
          )}
          <LogoutButton />
        </div>
      );
    } else if (session) {
      return <div></div>;
    } else {
      return (
        <div className="flex gap-3">
          <div className="shrink-0">
            <LinkButton href="/login">
              <p>Login</p>
            </LinkButton>
          </div>
          <div className="shrink-0">
            <LinkButton href="/login">
              <p>Sign Up</p>
            </LinkButton>
          </div>
        </div>
      );
    }
  };

  return (
    <body className="bg-background text-foreground">
      <main className="min-h-screen flex flex-col items-center">
        <div className="w-full">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 p-3">
            <div className="w-full max-w-4xl flex justify-between items-center  ">
              <Link href="/home">
                <div className="flex gap-2 justify-center items-center">
                  <Image src="/logo.png" alt="" width={30} height={30} />
                  <p className="font-poppins font-semibold text-lg">Flock</p>
                </div>{" "}
              </Link>
            </div>
            <NavRight />
          </nav>
        </div>
        {children}
      </main>
      {showModal && modalContent}
    </body>
  );
}
