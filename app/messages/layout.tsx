import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import {
  serverGetGroupsByIds,
  serverGetUser,
  serverGetDMsByUser,
} from "@/app/actions";
import MessagesCard from "@/app/messages/MessagesCard";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await serverGetUser();
  const groupsData = await serverGetGroupsByIds(user.groups);
  const DMData = await serverGetDMsByUser(user.uid);

  if (groupsData.error || DMData.error) return <div></div>;

  const updatedDMData = DMData.map((DM) => {
    return {
      ...DM,
      user: [DM.user1, DM.user2].filter((uid) => uid !== user.uid)[0],
      type: "dm",
    };
  });
  const updatedGroupData = groupsData.map((group) => {
    return {
      ...group,
      type: "group",
    };
  });

  const sortedAllChats = [...updatedGroupData, ...updatedDMData].sort(
    (a, b) => {
      if (!a?.lastMessage?.sent_at) return -1;
      if (!b?.lastMessage?.sent_at) return 1;
      return new Date(a.lastMessage.sent_at) - new Date(b.lastMessage.sent_at);
    }
  );
  // console.log(sortedAllChats, user.uid);
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-[95%] sm:w-[95%] animate-in opacity-0 flex gap-4 py-6 font-poppins">
        <div className="max-w-[350px] relative flex flex-col">
          <h2 className="font-medium text-white text-2xl lg:text-4xl self-start pb-3">
            Messages
          </h2>
          <div className="flex-1 lg:w-[350px] relative flex flex-col">
            <div className="max-h-full h-full w-full overflow-y-scroll absolute bottom-0 flex-1">
              {sortedAllChats.map((group) => (
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
