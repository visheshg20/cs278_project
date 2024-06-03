import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import {
  serverGetAvailableFeatherRecipients,
  serverGetReceivedFeathers,
  serverGetUser,
} from "@/app/actions";
import Feather from "@/app/home/feathers/Feather";
import ReceivedFeather from "@/app/home/feathers/ReceivedFeather";

export default async function HomePage() {
  const user = await serverGetUser();
  const membersMap = await serverGetAvailableFeatherRecipients(
    user.groups,
    user.uid
  );
  const receivedFeathers = await serverGetReceivedFeathers(user.uid);
  if (!receivedFeathers || !membersMap) return null;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-[26px] text-white">Send a Feather!</h1>
      <div className="flex overflow-scroll w-screen sm:w-full gap-5 -px-2.5 -ml-[34px] sm:ml-0">
        {Object.keys(membersMap).length > 0 ? (
          Object.entries(membersMap).map(
            ([key, value]: [string, any], index) => (
              <Feather
                member={{ ...value, uid: key }}
                key={`members-${index}`}
              />
            )
          )
        ) : (
          <div className="flex items-center gap-3 w-full justify-center my-10">
            <Image src="/feather.svg" alt="" width={30} height={30} />
            <p className="font-semibold text-white text-xl">
              No feathers to send
            </p>
          </div>
        )}
      </div>
      <h1 className="text-[26px] text-white">Your Feathers!</h1>
      <div className="flex overflow-scroll w-screen sm:w-full gap-5 -px-2.5 -ml-[34px] sm:ml-0">
        {receivedFeathers.length > 0 ? (
          receivedFeathers.map((feather, index) => (
            <ReceivedFeather feather={feather} key={`feather-${index}`} />
          ))
        ) : (
          <div className="flex items-center gap-3 w-full justify-center mt-10">
            <Image src="/feather.svg" alt="" width={30} height={30} />
            <p className="font-semibold text-white text-xl">No feathers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
