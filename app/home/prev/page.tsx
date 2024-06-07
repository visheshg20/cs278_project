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
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 w-full justify-center mt-10">
        <Image src="/feather.svg" alt="" width={30} height={30} />
        <p className="font-semibold text-white text-xl">
          No Previous Flocks yet
        </p>
      </div>
    </div>
  );
}
