import { createClient } from "@/utils/supabase/server";
import { serverGetUser } from "@/app/actions";

export default async function MessagesPage() {
  const supabase = createClient();

  const user = await serverGetUser();
  // if (user?.status === 0) {
  //   return redirect("/onboarding");
  // }

  // return redirect("/home/flocks");
  return (
    <div className="text-white w-full min-h-full flex-1 flex items-center justify-center ">
      Select a chat!
    </div>
  );
}
