"use client";

import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import sample from "lodash/sample";
import { icebreakers, adminUser } from "@/types/types";
import { cn } from "@/utils";
import { times } from "lodash";

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
  const [failedCommand, setFailedCommand] = useState(false);
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

    if (text.startsWith("/icebreaker")) {
      const { error } = await supabase.from("Chats").insert([
        {
          gid: groupId,
          message: sample(icebreakers),
          author: adminUser,
          special: "icebreaker",
        },
      ]);

      if (error) console.error(error);
    } else if (text.startsWith("/schedule")) {
      const timeString = text.trim().split(" ").splice(-2).join(" ");
      const regex = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/;
      const matches = timeString.match(regex);

      if (matches) {
        const [_, month, day, year, hour, minute] = matches;
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );
        if (new Date() > date) {
          setFailedCommand(true);
          return;
        }
        const { error } = await supabase.from("Chats").insert([
          {
            gid: groupId,
            message: date.toLocaleString(),
            special: "schedule",
            author: adminUser,
          },
        ]);
        await supabase
          .from("Groups")
          .update({ scheduledMeet: date })
          .eq("gid", groupId);
        setFailedCommand(false);
      } else {
        setFailedCommand(true);
        return;
      }
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
          <p>
            /icebreaker: sending this message will send everyone an icebreaker!
          </p>{" "}
        </div>
        <div className="absolute w-full h-[46px] bg-gray-600 left-0 top-[50%] z-0" />
      </div>
    );
  } else if (text.startsWith("/schedule")) {
    toolbarElem = (
      <div className="w-full bg-gray-600 text-white rounded-full pl-5 pr-2 py-1 relative">
        <div className="flex justify-between pr-2 relative z-[1]">
          <p>
            /schedule: Tell us the date and time of your meetup! Must be in this
            format: MM-DD-YYYY HH:MM (24hr time)
          </p>{" "}
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

export default ChatTextBar;
