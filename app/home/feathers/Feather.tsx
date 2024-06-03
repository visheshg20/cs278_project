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
  const [messageError, setMessageError] = useState("");

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
    <div className="flex flex-col items-center p-5 rounded-lg text-[#8A6697] shrink-0">
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
      {messageError && <p className="text-red-500 text-sm">{messageError}</p>}
      <div className="flex justify-center mt-3">
        <button
          className={cn(
            messageSent ? "bg-green-600" : "bg-purple-500",
            " text-sm text-white py-1 px-3 pr-3 w-fit rounded-md flex items-center gap-2"
          )}
          onClick={async () => {
            if (!messageView && !messageSent) {
              if (textRef.current) textRef.current.focus();
              setMessageView(true);
            } else if (messageView && !messageSent) {
              if (!message) return setMessageError("Please enter a message!");
              const res = await serverSendFeather(
                user.uid,
                member.uid,
                message,
                member.groupName
              );
              if (res?.error) {
                setMessageSent(false);
                setMessageError(res?.error);
              } else {
                setMessageError("");
                setMessageSent(true);
                setMessageView(false);
              }
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
        <button
          className={cn(
            messageView
              ? "opacity-100 scale-x-100 p-1.5 ml-2 h-7"
              : "opacity-0 scale-x-0 w-0 p-0 ",
            "bg-red-600 text-sm text-white rounded-md transition-all duration-500"
          )}
          onClick={() => setMessageView(false)}
        >
          <Image
            className="h-fit"
            src="/close.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
};

export default Feather;
