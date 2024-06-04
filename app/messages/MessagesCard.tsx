"use client";

import { isIOS } from "@/utils";
import React, { useEffect, useState } from "react";
import { activitiesMap } from "@/types/types";
import Image from "next/image";
import { format } from "timeago.js";
import LastMessage from "@/app/messages/LastMessage";
import { serverGetGroupMembersData, serverGetUserByUid } from "@/app/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import ProfileImage from "@/components/ProfileImage";

interface MessagesCardProps {
  group: any;
}

const MessagesCard: React.FC<MessagesCardProps> = ({ group }) => {
  const [membersData, setMembersData] = useState(null);
  useEffect(() => {
    const fetchMembersData = async () => {
      if (group.type === "group") {
        const membersData = await serverGetGroupMembersData(group.gid);
        setMembersData(membersData);
      } else if (group.type === "dm") {
        const membersData = await serverGetUserByUid(group.user);
        setMembersData(membersData);
      }
    };
    fetchMembersData();
  }, []);
  const convoId = usePathname().split("/").splice(-1)[0];
  const isViewingChat = convoId !== "messages";

  if (membersData === null) return null;
  return (
    <Link
      href={`/messages/${group.type === "dm" ? group.id : group.gid}`}
      className={cn(
        convoId === group.gid || convoId === group.id
          ? "bg-[rgba(255,255,255,0.2)]"
          : "hover:bg-[rgba(255,255,255,0.1)]",
        "flex gap-5  rounded-lg cursor-pointer p-3"
      )}
    >
      {group.type === "dm" ? (
        <ProfileImage user={membersData} type="xl" />
      ) : (
        <Image
          alt=""
          className="rounded-full"
          src={activitiesMap[group.activity].image}
          height={100}
          width={100}
        />
      )}

      <div
        className={cn(
          !isViewingChat && isIOS() ? "flex" : "hidden",
          "text-white flex-col justify-around py-2  lg:flex"
        )}
      >
        <div>
          <div className="text-lg">
            {group.type === "dm"
              ? `${membersData?.firstName} ${membersData?.lastName}`
              : group.groupName}
          </div>
          <div className="text-sm">Matched {format(group.created_at)}</div>
        </div>
        <LastMessage group={group} membersData={membersData} />
      </div>
    </Link>
  );
};

export default MessagesCard;
