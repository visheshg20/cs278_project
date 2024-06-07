import ProfileImage from "@/components/ProfileImage";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import { cn, isIOS } from "@/utils";
import { Reaction } from "@/types/types";
import { AuthContext } from "@/app/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { padZero } from "@/utils";
import { ModalContext } from "@/app/contexts/ModalContext";
import { set } from "lodash";
import { serverFlagChat } from "@/app/actions";

interface ChatMessageProps {
  chat: any;
  groupName: string;
  member: any;
  authorIsUser: boolean;
  prevAuthorIsSame: boolean;
  nextAuthorIsSame: boolean;
  setRepliedChat: (chat: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  chat,
  member,
  groupName,
  authorIsUser,
  prevAuthorIsSame,
  nextAuthorIsSame,
  setRepliedChat,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showReactions, setShowReactions] = useState<boolean>(false);

  const { setShowModal, setModalContent } = useContext(ModalContext);
  const reactionRef = useRef<HTMLButtonElement>(null);
  const { user } = useContext(AuthContext);
  const supabase = createClient();

  const updateModal = () => {
    setShowModal(true);
    setModalContent(
      <>
        <div
          className="fixed flex items-center justify-center bottom-0 right-0 h-screen w-screen z-10 animate-in inset-0 bg-[rgba(0,0,0,0.5)]"
          onClick={() => {
            setShowModal(false);
          }}
        >
          <div
            className="max-w-[80vw] sm:max-w-[60vw] animate-in bg-white z-[50] rounded-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4"
              onClick={() => {
                setModalContent(null);
                setShowModal(false);
              }}
            >
              <Image alt="" src="/gray_close.svg" height={20} width={20} />
            </button>
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg p-4">
                <h1 className="text-2xl font-semibold">Report Message</h1>
                <p className="text-sm text-gray-500">
                  Are you sure you want to report this message? This will hide
                  the message until a moderator approves it.
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={async () => {
                      await serverFlagChat(chat.cid);
                      setModalContent(null);
                      setShowModal(false);
                    }}
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSpecialChat = (chat: any) => {
    if (chat.special === "schedule") {
      const date = new Date(chat.message);

      const year = date.getFullYear();
      const month = padZero(date.getMonth() + 1); // Months are zero-based
      const day = padZero(date.getDate());
      const startHours = padZero(date.getHours());
      const endHours = padZero(date.getHours() + 2);
      const minutes = padZero(date.getMinutes());
      const seconds = padZero(date.getSeconds());

      const timeString1 = `${year}${month}${day}T${startHours}${minutes}${seconds}`;
      const timeString2 = `${year}${month}${day}T${endHours}${minutes}${seconds}`;

      return (
        <div className="text-center text-sm flex flex-col justify-center text-[#8A6697] py-3">
          <p className="">
            Congrats! You've scheduled your flock meetup for <br />
            {date.toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            <br />
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${groupName.replace(
              " ",
              "+"
            )}+Flock+Meetup&dates=${timeString1}/${timeString2}&ctz=America/Los_Angeles`}
            className=" text-blue-500"
          >
            Calendar Link
          </a>
        </div>
      );
    } else if (chat.special === "icebreaker") {
      return (
        <div className="text-center text-2xl flex flex-col items-center justify-center text-white py-3">
          <h1 className="">
            Break the ice!
            <br />
          </h1>
          <Image src="/icebreaker.png" alt="" width={100} height={100} />
          <p className="text-sm text-[#8A6697] pt-1">{chat.message}</p>
          <p className="text-sm text-[#8A6697]">
            Type /icebreaker to generate another icebreaker!
          </p>
        </div>
      );
    }
  };

  if (chat.special) {
    return renderSpecialChat(chat);
  }

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
        "absolute flex bg-white px-2 py-1 rounded-full bottom-8 transition-transform transition-duration-350 scale-0 z-20",
        showReactions && "scale-100"
      )}
    >
      {Object.keys(Reaction)
        .filter((key) => isNaN(Number(key)))
        .map((key, index) => (
          <div
            key={`${key}-${index}`}
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
          <Link href={`/profiles/${chat.author}`}>
            <ProfileImage user={member} type="sm" />
          </Link>
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
          <div
            className={cn(
              authorIsUser ? "bg-blue-600" : "bg-gray-500",
              "px-3 py-1 text-white rounded-2xl text-md max-w-[70%] relative "
            )}
          >
            {chat.userFlagged || chat.moderatorFlagged ? (
              <em>This message has been flagged for review.</em>
            ) : (
              chat.message
            )}
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
          </div>
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
              <button
                className="hover:bg-[rgba(255,255,255,0.7)] rounded-full p-1"
                onClick={(e) => {
                  e.preventDefault();
                  updateModal();
                }}
              >
                <Image src="/flag.svg" alt="" width={20} height={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
