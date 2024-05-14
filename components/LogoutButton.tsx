"use client";

import { createClient } from "@/utils/supabase/client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default async function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <Button
      onClick={async () => {
        console.log("clicked");
        await supabase.auth.signOut();
        router.push("/login");
      }}
    >
      <p>Logout</p>
    </Button>
  );
}
