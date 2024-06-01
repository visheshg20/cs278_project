import ProfileImage from "@/components/ProfileImage";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import { cn, isIOS } from "@/utils";
import { Reaction } from "@/types/types";
import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";

interface ChatMessageProps {
  chat: any;
  member: any;
  authorIsUser: boolean;
  prevAuthorIsSame: boolean;
  nextAuthorIsSame: boolean;
  setRepliedChat: (chat: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  chat,
  member,
  authorIsUser,
  prevAuthorIsSame,
  nextAuthorIsSame,
  setRepliedChat,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const reactionRef = useRef<HTMLButtonElement>(null);
  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const reactions = JSON.parse(chat.reactions);
  const reply = chat.reply ? JSON.parse(chat.reply) : null;
  const userReaction = reactions.find((reaction) => reaction.uid === user.uid);

  const getEmojiString = () => {
    const emojiList = Array.from(
      new Set(reactions.map((reaction) => Reaction[reaction.reaction]))
    ).splice(0, 3);
    return emojiList.join("");
  };

  const isReactionOnRight = () => {
    if (reactionRef.current)
      return (
        window.innerWidth - reactionRef.current?.getBoundingClientRect().left >
        window.innerWidth / 2
      );
    return null;
  };

  const handleReaction = async (reaction: string) => {
    const parsed = JSON.parse(chat.reactions);
    let updated;
    if (userReaction && userReaction.reaction === reaction)
      updated = [...parsed.filter((reaction) => reaction.uid !== user?.uid)];
    else if (userReaction)
      updated = [
        ...parsed.filter((reaction) => reaction.uid !== user?.uid),
        { uid: user.uid, reaction },
      ];
    else updated = [...parsed, { uid: user.uid, reaction }];
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
        "absolute flex bg-white px-2 py-1 rounded-full bottom-8 transition-transform transition-duration-350 scale-0 z-[15]",
        showReactions && "scale-100"
      )}
    >
      {Object.keys(Reaction)
        .filter((key) => isNaN(Number(key)))
        .map((key) => (
          <div
            className={cn(
              userReaction?.reaction === key && "bg-gray-300",
              "text-[2rem] rounded-full px-0.5 h-fit"
            )}
            onClick={() => handleReaction(key)}
          >
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
        reactions.length > 0 ? "pb-3" : "pb-1",
        "flex gap-2 w-full"
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
        {!prevAuthorIsSame && !authorIsUser && !reply && (
          <p className={cn("text-gray-500 text-xs pl-2")}>{member.firstName}</p>
        )}
        {reply && (
          <div
            className={cn(
              authorIsUser ? "justify-end" : "justify-start",
              "flex relative"
            )}
          >
            <div
              className={cn(
                authorIsUser ? "items-end" : "items-start",
                "flex flex-col w-full"
              )}
            >
              <p className={cn("text-gray-500 text-xs pl-2")}>
                {reply.from} replied to {reply.to}
              </p>
              <p className="text-white bg-gray-600 w-fit max-w-[25%] truncate px-3 py-1 rounded-full overflow-hidden relative z-[1]">
                {reply.message}
              </p>
            </div>
            <div
              className={cn(
                authorIsUser ? "rounded-bl-xl" : "rounded-br-xl",
                "absolute select-none w-fit max-w-[25%] truncate px-3 py-1 bg-gray-600 text-gray-600 -bottom-[16px] -z-[0]"
              )}
            >
              {reply.message}
            </div>
          </div>
        )}
        <div className={authorIsUser ? "flex flex-row-reverse" : "flex"}>
          <p
            className={cn(
              authorIsUser ? "bg-blue-600" : "bg-gray-500",
              "px-3 py-1 text-white rounded-2xl text-md max-w-[70%] relative "
            )}
          >
            {chat.message}
            {reactions.length > 0 && (
              <div
                className={cn(
                  authorIsUser ? "-left-2" : "-right-2",
                  "absolute -bottom-2.5 z-10 bg-white rounded-full text-black font-semibold text-xs py-0.5 px-1 select-none	"
                )}
              >
                {reactions.length > 1 && reactions.length} {getEmojiString()}
              </div>
            )}
          </p>
          {showOptions && (
            <div
              className={cn(
                "items-center justify-center z-[1] flex px-2",
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
                onMouseOut={() => {
                  if (isIOS()) {
                    setShowReactions(false);
                    setShowOptions(false);
                  }
                }}
                onClick={() => {
                  setShowReactions(!showReactions);
                }}
                onContextMenu={() => {
                  setShowReactions(!showReactions);
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
              <button
                className="hover:bg-[rgba(255,255,255,0.7)] rounded-full p-1"
                onClick={(e) => {
                  e.preventDefault();
                  setRepliedChat({ ...chat, authorName: member.firstName });
                }}
              >
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
