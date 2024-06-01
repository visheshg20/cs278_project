import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  serverGetAvailableFeatherRecipients,
  serverGetUser,
} from "@/app/actions";
import Feather from "@/app/home/feathers/Feather";

export default async function HomePage() {
  const user = await serverGetUser();
  const membersMap = await serverGetAvailableFeatherRecipients(
    user.groups,
    user.uid
  );

  console.log(membersMap);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-[26px] text-white">Send a Feather!</h1>
      <div className="flex overflow-scroll w-full gap-5 -ml-2.5">
        {Object.entries(membersMap).map(([key, value]: [string, any]) => (
          <Feather member={{ ...value, uid: key }} />
        ))}
      </div>
    </div>
  );
}
