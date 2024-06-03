"use client";

import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import sample from "lodash/sample";
import { icebreakers, adminUser } from "@/types/types";
import { cn } from "@/utils";
import { times } from "lodash";

interface DMChatBarProps {
  setRepliedChat: (chat: any) => void;
  repliedChat: any;
  DMId: string;
}

const DMChatBar: React.FC<DMChatBarProps> = ({
  setRepliedChat,
  repliedChat,
  DMId,
}) => {
  const [text, setText] = useState("");
  const [failedCommand, setFailedCommand] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const sendMessage = async () => {
    if (!text || !user) return;
    const message = {
      DMId: DMId,
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

    if (text.startsWith("/icebreaker")) {
      const { error } = await supabase.from("Chats").insert([
        {
          DMId: DMId,
          message: sample(icebreakers),
          author: adminUser,
          special: "icebreaker",
        },
      ]);

      if (error) console.error(error);
    }
    setText("");
    setRepliedChat(null);
  };

  useEffect(() => {
    if (repliedChat) inputRef.current?.focus();
  }, [repliedChat]);

  let toolbarElem;
  if (repliedChat) {
    toolbarElem = (
      <div className="w-full bg-gray-600 text-white rounded-full pl-5 pr-2 py-1 relative">
        <div className="flex justify-between pr-2">
          <p>Replying to {repliedChat.authorName}:</p>{" "}
          <button
            onClick={() => setRepliedChat(null)}
            className="flex justify-center items-center p-0.5 rounded-full hover:bg-red-600 bg-gray-500 h-fit mt-1"
          >
            <Image src="/close.svg" alt="" width={12} height={12} />
          </button>
        </div>

        <p className="text-sm relative z-[1]">{repliedChat.message}</p>
        <div className="absolute w-full h-[46px] bg-gray-600 left-0 top-[50%] z-0" />
      </div>
    );
  } else if (text.startsWith("/icebreaker")) {
    toolbarElem = (
      <div className="w-full bg-gray-600 text-white rounded-full pl-5 pr-2 py-1 relative">
        <div className="flex justify-between pr-2 relative z-[1]">
          <p>/icebreaker: sending this message will send an icebreaker!</p>{" "}
        </div>
        <div className="absolute w-full h-[46px] bg-gray-600 left-0 top-[50%] z-0" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="mt-1">
        {toolbarElem}

        <input
          ref={inputRef}
          className={cn(
            failedCommand ? "outline-red-500" : "outline-none",
            "rounded-full h-10 pl-4 pr-10 min-w-full relative z-[1] "
          )}
          type="text"
          value={text}
          onChange={(e) => {
            setFailedCommand(false);
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code == "Enter") sendMessage();
          }}
        />
      </div>
      <div className="absolute bottom-0 right-2 flex items-center h-10 z-[1]">
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

export default DMChatBar;
