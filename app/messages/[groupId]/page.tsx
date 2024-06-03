"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@/app/contexts/AuthContext";
import ChatTextBar from "@/app/chat/ChatTextBar";
import GroupChatMessages from "@/app/chat/GroupChatMessages";
import { serverGetGroupById } from "@/app/actions";
import { activitiesMap } from "@/types/types";

export default function ChatPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const supabase = createClient();

  const { user } = useContext(AuthContext);

  const [groupData, setGroupData] = useState(null);
  const [repliedChat, setRepliedChat] = useState(null);

  useEffect(() => {
    async function getData() {
      setGroupData(await serverGetGroupById(groupId));
    }
    getData();
  }, []);

  if (!groupData || !user) return null;
  return (
    <div className="flex-1 w-full sm:w-4/5 animate-in opacity-0 flex flex-col gap-1 px-0">
      <div className="flex gap-4 items-center justify-start">
        <Image
          alt=""
          className="rounded-full w-10 h-10"
          src={activitiesMap[groupData.activity].image}
          height={100}
          width={100}
        />
        <h2 className="text-white text-2xl">{groupData.groupName}</h2>
      </div>
      <div className="flex-1 rounded-xl flex flex-col">
        <div className="flex flex-col w-full flex-1 relative">
          <div className="absolute bottom-0 w-full h-full overflow-scroll">
            <GroupChatMessages
              setRepliedChat={setRepliedChat}
              groupId={groupId}
              groupData={groupData}
            />
          </div>
        </div>
        <ChatTextBar
          setRepliedChat={setRepliedChat}
          repliedChat={repliedChat}
          groupId={groupId}
        />
      </div>
    </div>
  );
}
