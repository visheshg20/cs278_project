import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { serverGetGroupsByIds, serverGetUser } from "@/app/actions";
import MessagesCard from "@/app/messages/MessagesCard";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await serverGetUser();
  const groupsData = await serverGetGroupsByIds(user.groups);

  if (!groupsData) return <div></div>;

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-[95%] sm:w-[95%] animate-in opacity-0 flex gap-4 py-6 font-poppins">
        <div className="max-w-[350px] relative flex flex-col">
          <h2 className="font-medium text-white text-2xl lg:text-4xl self-start pb-3">
            Messages
          </h2>
          <div className="flex-1 lg:w-[350px] relative flex flex-col">
            <div className="max-h-full h-full w-full overflow-y-scroll absolute bottom-0 flex-1">
              {groupsData.map((group) => (
                <div className="">
                  <hr className="border-[#8A6697]" />
                  <MessagesCard group={group} />
                </div>
              ))}
              <hr className="border-[#8A6697]" />
            </div>
          </div>
        </div>
        <div className="h-100 w-[1.5px] bg-[#8A6697]"></div>
        {children}
      </main>
    </div>
  );
}
