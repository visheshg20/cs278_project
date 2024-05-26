"use client";

import LinkButton from "@/components/LinkButton";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);

  if (user?.status === 0) {
    return redirect("/onboarding");
  }

  return (
    user && (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <main className="flex-1 w-4/5 animate-in opacity-0 flex flex-col gap-6 p-6">
          <h2 className="font-bold text-black text-4xl mb-4 self-start">
            Welcome Back, {user.firstName}
          </h2>
          <h4 className=" text-[#8A6697] text-lg mb-4 self-start">
            Next flocks released in 2 days, 18 hours
          </h4>
          <hr className="border-black" />
          <div className="flex gap-10 w-full justify-center">
            <LinkButton href="/flocks">
              <p>View Flocks</p>
            </LinkButton>
            <LinkButton href="/flocks">
              <p>Send a feather</p>
            </LinkButton>
          </div>
        </main>
      </div>
    )
  );
}
