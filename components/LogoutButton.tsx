"use client";

import { createClient } from "@/utils/supabase/client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { serverLogout } from "@/app/actions";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <Button
      onClick={async () => {
        await supabase.auth.signOut();
        await serverLogout();
        router.push("/login");
      }}
    >
      <p>Logout</p>
    </Button>
  );
}
