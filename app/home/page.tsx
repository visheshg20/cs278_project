import LinkButton from "@/components/LinkButton";
import { redirect } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/server";
import { serverGetUser } from "@/app/actions";

export default async function HomePage() {
  const user = await serverGetUser();
  if (user?.status === 0) {
    return redirect("/onboarding");
  }

  return redirect("/home/flocks");
}
