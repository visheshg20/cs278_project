"use client";

import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";

interface ChatTextBarProps {
  groupId: string;
}

const ChatTextBar: React.FC<ChatTextBarProps> = ({ groupId }) => {
  const [text, setText] = useState("");

  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const sendMessage = async () => {
    if (!text || !user) return;
    const message = {
      gid: groupId,
      message: text,
      author: user.uid,
      reactions: "[]",
    };
    const { error } = await supabase.from("Chats").insert([message]);
    if (error) console.error(error);
    setText("");
  };

  return (
    <div className="relative w-full">
      <input
        className="rounded-full h-10 px-4 mt-2 min-w-full"
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code == "Enter") sendMessage();
        }}
      />
      <div className="absolute bottom-0 right-2 flex items-center h-10">
        <button
          disabled={!text}
          onClick={sendMessage}
          className={cn(
            "rounded-full flex justify-center items-center p-1",
            text ? "bg-blue-600" : "bg-gray-500"
          )}
        >
          <Image src="/sendMessage.svg" alt="" width={18} height={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatTextBar;
