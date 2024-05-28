import ProfileImage from "@/components/ProfileImage";
import React, { useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { cn } from "@/utils";

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
  return (
    <div
      key={chat.cid}
      className={cn(authorIsUser && "flex-row-reverse", "flex gap-2")}
    >
      <div className="self-end">
        {nextAuthorIsSame ? (
          <div className="p-4"></div>
        ) : (
          <ProfileImage user={member} type="sm" />
        )}
      </div>
      <div className="relative pb-1">
        {!prevAuthorIsSame && !authorIsUser && (
          <p className={cn("text-gray-500 text-xs pl-2")}>{member.firstName}</p>
        )}
        <p
          className={cn(
            authorIsUser ? "bg-blue-600" : "bg-gray-500",
            "px-3 py-1 text-white rounded-2xl text-md"
          )}
        >
          {chat.message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
