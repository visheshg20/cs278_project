"use client";

import React, { useEffect, useState } from "react";
import { activitiesMap } from "@/types/types";
import Image from "next/image";
import { format } from "timeago.js";
import LastMessage from "@/app/messages/LastMessage";
import { serverGetGroupMembersData } from "@/app/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

interface MessagesCardProps {
  group: any;
}

const MessagesCard: React.FC<MessagesCardProps> = ({ group }) => {
  const [membersData, setMembersData] = useState(null);
  useEffect(() => {
    const fetchMembersData = async () => {
      const membersData = await serverGetGroupMembersData(group.gid);
      setMembersData(membersData);
    };
    fetchMembersData();
  }, []);
  const convoId = usePathname().split("/").splice(-1)[0];
  console.log(convoId, group.gid);

  if (membersData === null) return null;
  return (
    <Link
      href={`/messages/${group.gid}`}
      className={cn(
        convoId === group.gid
          ? "bg-[rgba(255,255,255,0.2)]"
          : "hover:bg-[rgba(255,255,255,0.1)]",
        "flex gap-5  rounded-lg cursor-pointer p-3"
      )}
    >
      <Image
        alt=""
        className="rounded-full"
        src={activitiesMap[group.activity].image}
        height={100}
        width={100}
      />
      <div className="text-white flex-col justify-around py-2 hidden lg:flex">
        <div>
          <div className="text-lg">{group.groupName}</div>
          <div className="text-sm">Matched {format(group.created_at)}</div>
        </div>
        <LastMessage group={group} membersData={membersData} />
      </div>
    </Link>
  );
};

export default MessagesCard;
