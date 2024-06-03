"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { cn } from "@/utils";
import ProfileImage from "@/components/ProfileImage";
import ChatMessage from "./ChatMessage";
import { serverGetGroupMembersData } from "@/app/actions";

interface GroupChatMessagesProps {
  groupData: any;
  groupId: string;
  setRepliedChat: (chat: any) => void;
}

const GroupChatMessages: React.FC<GroupChatMessagesProps> = ({
  groupData,
  groupId,
  setRepliedChat,
}) => {
  const supabase = createClient();
  const { user } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [membersData, setMembersData] = useState({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupData || chats.length > 0) return;
    supabase
      .from("Chats")
      .select()
      .order("created_at", { ascending: true })
      .eq("gid", groupData.gid)
      .then((res) => {
        setChats(res.data);
      });
  }, [groupData]);

  useEffect(() => {
    async function getData() {
      const membersData = await serverGetGroupMembersData(groupId);
      setMembersData(membersData);
    }
    getData();
  }, [user, groupData]);

  useEffect(() => {
    const listener = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Chats",
          filter: `gid=eq.${groupId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChats([
              ...chats,
              {
                ...payload.new,
                reactions: JSON.stringify(payload.new.reactions),
                reply: JSON.stringify(payload.new.reply),
              },
            ]);
          }
          if (payload.eventType === "UPDATE") {
            const updatedChats = chats.map((chat) =>
              chat.cid === payload.new.cid
                ? {
                    ...payload.new,
                    reactions: JSON.stringify(payload.new.reactions),
                    reply: JSON.stringify(payload.new.reply),
                  }
                : chat
            );
            setChats(updatedChats);
          }
        }
      )
      .subscribe();

    return () => {
      listener.unsubscribe();
    };
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [chats, scrollRef.current]);

  if (!chats.length || !Object.keys(membersData).length) return null;

  return (
    <div className="w-full overflow-x-hidden">
      {chats.map((chat, index) => (
        <ChatMessage
          key={chat.cid}
          groupName={groupData.groupName}
          chat={chat}
          member={membersData[chat.author]}
          authorIsUser={chat.author === user.uid}
          prevAuthorIsSame={chats[index - 1]?.author === chat.author}
          nextAuthorIsSame={chats[index + 1]?.author === chat.author}
          setRepliedChat={setRepliedChat}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default GroupChatMessages;
