import ProfileImage from "@/components/ProfileImage";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Reaction } from "@/types/types";
import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";

interface ChatMessageProps {
  chat: any;
  member: any;
  authorIsUser: boolean;
  prevAuthorIsSame: boolean;
  nextAuthorIsSame: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  chat,
  member,
  authorIsUser,
  prevAuthorIsSame,
  nextAuthorIsSame,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const reactionRef = useRef<HTMLButtonElement>(null);
  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const isReactionOnRight = () => {
    if (reactionRef.current)
      return (
        window.innerWidth - reactionRef.current?.getBoundingClientRect().left >
        window.innerHeight / 2
      );
    return null;
  };

  const handleReaction = async (reaction: string) => {
    console.log(chat.reactions);
    const updated = [...chat.reactions, { uid: user.uid, reaction }];
    const updatedString = JSON.stringify(updated);
    const { error } = await supabase
      .from("Chats")
      .update({ reactions: updatedString })
      .eq("cid", chat.cid);
    if (error) console.error(error);

    setShowReactions(false);
  };

  const reactionsElement = (
    <div
      className={cn(
        isReactionOnRight()
          ? "-left-4 origin-bottom-left"
          : "-right-4 origin-bottom-right",
        "absolute flex gap-1 bg-white px-2 py-1 rounded-full bottom-8 transition-transform transition-duration-350 scale-0",
        showReactions && "scale-100"
      )}
    >
      {Object.keys(Reaction)
        .filter((key) => isNaN(Number(key)))
        .map((key) => (
          <div className="text-[2rem]" onClick={() => handleReaction(key)}>
            {Reaction[key]}
          </div>
        ))}
    </div>
  );

  return (
    <div
      key={chat.cid}
      className={cn(
        authorIsUser && "flex-row-reverse",
        "flex gap-2 w-full pb-1"
      )}
      onMouseOver={() => setShowOptions(true)}
      onMouseLeave={() => {
        if (!showReactions) setShowOptions(false);
      }}
    >
      <div className="self-end">
        {nextAuthorIsSame ? (
          <div className="p-4"></div>
        ) : (
          <ProfileImage user={member} type="sm" />
        )}
      </div>
      <div className="relative w-full">
        {!prevAuthorIsSame && !authorIsUser && (
          <p className={cn("text-gray-500 text-xs pl-2")}>{member.firstName}</p>
        )}
        <div className={authorIsUser ? "flex flex-row-reverse" : "flex"}>
          <p
            className={cn(
              authorIsUser ? "bg-blue-600" : "bg-gray-500",
              "px-3 py-1 text-white rounded-2xl text-md max-w-[70%]"
            )}
          >
            {chat.message}
          </p>
          {showOptions && (
            <div
              className={cn(
                "items-center justify-center, flex px-2",
                authorIsUser && "flex-row-reverse"
              )}
            >
              <button
                ref={reactionRef}
                className="hover:bg-[rgba(255,255,255,0.7)] rounded-full p-1 relative"
                onBlur={() => {
                  setShowReactions(false);
                  setShowOptions(false);
                }}
                onClick={() => {
                  setShowReactions(true);
                }}
              >
                <Image
                  className=""
                  src="/emoji.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                {reactionsElement}
              </button>
              <button className="hover:bg-[rgba(255,255,255,0.7)] rounded-full p-1">
                <Image src="/reply.svg" alt="" width={20} height={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
