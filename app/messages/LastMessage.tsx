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
    console.log("listening");
    const listener = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Groups",
          filter: `gid=eq.${group.gid}`,
        },
        (payload) => {
          console.log(payload);
          if (payload.eventType === "UPDATE") {
            console.log(payload.new);
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
  const author = membersData[lastMessage.author];

  return (
    <p className="text-sm text-elipsis-2 ">
      {author.firstName} {author.lastName[0]}: {lastMessage.message}
    </p>
  );
};

export default LastMessage;
