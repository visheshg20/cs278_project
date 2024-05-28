"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { cn } from "@/utils";
import ProfileImage from "@/components/ProfileImage";
import ChatMessage from "./ChatMessage";

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
    if (!groupData || !user) return;
    const members = groupData.members.filter((member) => member !== user.uid);
    supabase
      .from("Users")
      .select()
      .in("uid", members)
      .then((res) => {
        const membersMap = res.data?.reduce((acc, member) => {
          return {
            ...acc,
            [member.uid]: {
              firstName: member.firstName,
              lastName: member.lastName,
            },
          };
        }, {});
        setMembersData({
          ...membersMap,
          [user.uid]: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      });
  }, [groupData, user]);

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

  if (!chats.length || !Object.keys(membersData).length) return null;

  return (
    <div className="w-full">
      {chats.map((chat, index) => (
        <ChatMessage
          chat={chat}
          member={membersData[chat.author]}
          authorIsUser={chat.author === user.uid}
          prevAuthorIsSame={chats[index - 1]?.author === chat.author}
          nextAuthorIsSame={chats[index + 1]?.author === chat.author}
          setRepliedChat={setRepliedChat}
        />
      ))}
    </div>
  );
};

export default GroupChatMessages;
