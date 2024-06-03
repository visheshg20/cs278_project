import { createClient } from "@/utils/supabase/server";
import { serverGetUser } from "@/app/actions";

export default async function MessagesPage() {
  const supabase = createClient();

  const user = await serverGetUser();
  // if (user?.status === 0) {
  //   return redirect("/onboarding");
  // }

  // return redirect("/home/flocks");
  return <div>pick a chat!</div>;
}
