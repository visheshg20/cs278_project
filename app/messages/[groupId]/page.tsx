"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@/app/contexts/AuthContext";
import ChatTextBar from "@/app/chat/ChatTextBar";
import GroupChatMessages from "@/app/chat/GroupChatMessages";
import {
  serverGetDMById,
  serverGetUserByUid,
  serverGetGroupById,
} from "@/app/actions";
import { activitiesMap } from "@/types/types";
import GroupMemberBios from "@/app/messages/GroupMemberBios";
import ProfileImage from "@/components/ProfileImage";
import DMChatMessages from "@/app/chat/DMChatMessages";

export default function ChatPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const { user } = useContext(AuthContext);

  const [groupData, setGroupData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [repliedChat, setRepliedChat] = useState(null);

  useEffect(() => {
    async function getData() {
      let data = await serverGetGroupById(groupId);
      if (!data) data = await serverGetDMById(groupId);
      else {
        data = { ...data, type: "group" };
        return setGroupData(data);
      }
      if (!data) return console.log("No data found");
      else {
        data = {
          ...data,
          type: "dm",
          user: [data.user1, data.user2].filter((uid) => uid !== user.uid)[0],
        };
        setMemberData(await serverGetUserByUid(data.user));
        return setGroupData(data);
      }
    }
    getData();
  }, []);

  if (!groupData || !user) return null;
  return (
    <div className="flex-1 w-full sm:w-4/5 animate-in opacity-0 flex flex-col gap-3 px-0">
      <div className="flex gap-4 items-center justify-start">
        {groupData.type === "dm" && memberData ? (
          <ProfileImage user={memberData} type="lg" />
        ) : (
          <Image
            alt=""
            className="rounded-full"
            src={activitiesMap[groupData.activity].image}
            height={100}
            width={100}
          />
        )}
        {groupData.type === "dm" && memberData ? (
          <h2 className="text-white text-2xl">
            {memberData.firstName} {memberData.lastName}
          </h2>
        ) : (
          <h2 className="text-white text-2xl">{groupData.groupName}</h2>
        )}
      </div>
      <div className="flex-1 rounded-xl flex flex-col">
        <div className="flex flex-col w-full flex-1 relative">
          <div className="absolute bottom-0 w-full h-full overflow-scroll">
            {groupData.type === "group" ? (
              <>
                <GroupMemberBios groupData={groupData} uid={user.uid} />
                <GroupChatMessages
                  setRepliedChat={setRepliedChat}
                  groupId={groupId}
                  groupData={groupData}
                />
              </>
            ) : (
              <DMChatMessages
                setRepliedChat={setRepliedChat}
                DMId={groupId}
                DMData={groupData}
              />
            )}
          </div>
        </div>
        {groupData.type === "group" ? (
          <ChatTextBar
            setRepliedChat={setRepliedChat}
            repliedChat={repliedChat}
            groupId={groupId}
          />
        ) : (
          <DMTextBar
            setRepliedChat={setRepliedChat}
            repliedChat={repliedChat}
            groupId={groupId}
          />
        )}
      </div>
    </div>
  );
}
