"use server";

import { createClient } from "@/utils/supabase/server";

export async function serverLogout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
