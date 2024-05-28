"use client";

import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";

interface ChatTextBarProps {
  setRepliedChat: (chat: any) => void;
  repliedChat: any;
  groupId: string;
}

const ChatTextBar: React.FC<ChatTextBarProps> = ({
  setRepliedChat,
  repliedChat,
  groupId,
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const sendMessage = async () => {
    if (!text || !user) return;
    const message = {
      gid: groupId,
      message: text,
      author: user.uid,
      reactions: "[]",
      reply: repliedChat
        ? JSON.stringify({
            to: repliedChat.authorName,
            from: user.firstName,
            message: repliedChat.message,
          })
        : null,
    };
    const { error } = await supabase.from("Chats").insert([message]);
    if (error) console.error(error);
    setText("");
    setRepliedChat(null);
  };

  useEffect(() => {
    if (repliedChat) inputRef.current?.focus();
  }, [repliedChat]);

  return (
    <div className="relative w-full">
      <div className="mt-1">
        {repliedChat && (
          <div className="w-full bg-gray-300 text-black">
            <div className="flex justify-between pr-2">
              <p>Replying to {repliedChat.authorName}</p>{" "}
              <button
                onClick={() => setRepliedChat(null)}
                className="flex justify-center items-center p-0.5 rounded-full hover:bg-red-600 bg-gray-600 h-fit mt-1"
              >
                <Image src="/close.svg" alt="" width={12} height={12} />
              </button>
            </div>

            <p>{repliedChat.message}</p>
          </div>
        )}

        <input
          ref={inputRef}
          className="rounded-full h-10 px-4 min-w-full"
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code == "Enter") sendMessage();
          }}
        />
      </div>
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
