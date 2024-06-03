"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

interface LastMessageProps {
  group: any;
  membersData: any;
}

const LastMessage: React.FC<LastMessageProps> = ({ group, membersData }) => {
  const supabase = createClient();
  const [lastMessage, setLastMessage] = useState(group.lastMessage);
  useEffect(() => {
    const listener = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: group.type === "dm" ? "DMs" : "Groups",
          filter:
            group.type === "dm" ? `id=eq.${group.id}` : `gid=eq.${group.gid}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setLastMessage(payload.new.lastMessage);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("unmounting");
      listener.unsubscribe();
    };
  }, []);

  return (
    <p className="text-sm text-elipsis-2 ">
      {group.type === "dm"
        ? lastMessage?.message
        : `${membersData[lastMessage.author].firstName} ${
            membersData[lastMessage.author].lastName[0]
          }: ${lastMessage.message}`}{" "}
    </p>
  );
};

export default LastMessage;
