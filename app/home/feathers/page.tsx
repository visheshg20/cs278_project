import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { serverGetUser } from "@/app/actions";

export default function HomePage() {
  const supabase = createClient();

  return <div>asd</div>;
}
