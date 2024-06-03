"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { cn } from "@/utils";
import ProfileImage from "@/components/ProfileImage";
import ChatMessage from "./ChatMessage";
import { serverGetGroupMembersData, serverGetUserByUid } from "@/app/actions";
import DMMessage from "@/app/chat/DMMessage";

interface DMChatMessagesProps {
  DMData: any;
  DMId: string;
  setRepliedChat: (chat: any) => void;
}

const DMChatMessages: React.FC<DMChatMessagesProps> = ({
  DMData,
  DMId,
  setRepliedChat,
}) => {
  const supabase = createClient();
  const { user } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [membersData, setMembersData] = useState({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!DMData || chats.length > 0) return;
    supabase
      .from("Chats")
      .select()
      .order("created_at", { ascending: true })
      .eq("DMId", DMData.id)
      .then((res) => {
        setChats(res.data);
      });
  }, [DMData]);

  useEffect(() => {
    async function getData() {
      const memberData = await serverGetUserByUid(DMData.user);
      const membersMap = [memberData, user].reduce((acc, member) => {
        return { ...acc, [member.uid]: member };
      }, {});
      console.log(membersMap);
      setMembersData(membersMap);
    }
    getData();
  }, [user, DMData]);

  useEffect(() => {
    const listener = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Chats",
          filter: `DMId=eq.${DMId}`,
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
        <DMMessage
          key={chat.cid}
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

export default DMChatMessages;
