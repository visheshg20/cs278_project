"use client";

import ProfileImage from "@/components/ProfileImage";
import { cn } from "@/utils";
import Image from "next/image";
import { serverSendFeather } from "@/app/actions";
import React, { useState, useLayoutEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

interface FeatherProps {
  member: any;
}

const Feather: React.FC<FeatherProps> = ({ member }) => {
  const [messageView, setMessageView] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState<boolean | null>(null);

  const { user } = useContext(AuthContext);

  useLayoutEffect(adjustHeight, []);

  const textRef = React.useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    if (!textRef.current) return;
    textRef.current.style.height = "inherit";
    textRef.current.style.height = `${
      messageView ? textRef.current?.scrollHeight : 0
    }px`;
  }

  return (
    <div>
      <div className="flex flex-col items-center p-5 rounded-lg text-[#8A6697]">
        <ProfileImage type="xl" user={member} />

        <p className="font-semibold text-lg pt-2">
          {member?.firstName} {member?.lastName?.[0]}.
        </p>
        <p className="text-sm text-gray-500">{member.groupName}</p>
        <textarea
          ref={textRef}
          placeholder="Write a nice message!"
          onChange={(e) => {
            setMessage(e.target.value);
            adjustHeight();
          }}
          className={cn(
            messageView
              ? "scale-100 min-h-10 max-h-32 px-4 py-2 mt-2 opacity-100 w-[200px]"
              : "m-0 min-h-0 !h-0 p-0 opacity-100 scale-0 w-0",
            "rounded-lg text-sm duration-500 transition-all resize-none outline-none"
          )}
        />
        <button
          className={cn(
            messageSent ? "bg-green-600" : "bg-purple-500",
            " text-sm text-white py-1 px-3 pr-3 w-fit rounded-md mt-3 flex items-center gap-2"
          )}
          onClick={async () => {
            if (!messageView && !messageSent) setMessageView(true);
            else if (messageView && !messageSent) {
              const res = await serverSendFeather(
                user.uid,
                member.uid,
                message
              );
              if (res) setMessageSent(true);
              else setMessageSent(false);
              setMessageView(false);
            }
          }}
        >
          {messageSent ? "Feather Sent!" : "Send Feather"}
          {messageSent ? (
            <Image src="/sendMessage.svg" alt="" width={20} height={12} />
          ) : (
            <Image src="/feather.svg" alt="" width={20} height={12} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Feather;
