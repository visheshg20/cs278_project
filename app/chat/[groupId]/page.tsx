"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/utils";
import { AuthContext } from "@/app/contexts/AuthContext";
import ChatTextBar from "@/app/chat/ChatTextBar";
import GroupChatMessages from "@/app/chat/GroupChatMessages";

export default function ChatPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const supabase = createClient();

  const { user } = useContext(AuthContext);

  const [groupData, setGroupData] = useState(null);
  const [repliedChat, setRepliedChat] = useState(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("Groups")
      .select()
      .eq("gid", groupId)
      .then(({ data: groupData, error }) => {
        if (error) console.error(error);
        setGroupData(groupData?.[0]);
      });
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    console.log(scrollRef.current);
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [scrollRef.current]);

  const emojiMap = { Bowling: "🎳", Cooking: "🍳" };

  if (!groupData || !user) return null;
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-full sm:w-4/5 animate-in opacity-0 flex flex-col gap-6 px-0 sm:px-6 py-6">
        <div className="flex gap-4 items-center justify-start">
          <div className="bg-purple-300 flex justify-center items-center w-24	h-24 text-4xl rounded-full">
            {emojiMap[groupData.hobby]}
          </div>
          <h2 className="font-bold text-black text-4xl">
            {groupData.groupName}
          </h2>
        </div>
        <div className="bg-gray-300/30 flex-1 rounded-xl flex p-4 flex-col">
          <div className="flex flex-col w-full flex-1 relative">
            <div
              className="absolute bottom-0 w-full h-full overflow-scroll"
              ref={scrollRef}
            >
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
      </main>
    </div>
  );
}
