"use client";

import LinkButton from "@/components/LinkButton";
import { createClient } from "@/utils/supabase/client";
import { data } from "autoprefixer";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { group } from "console";
import ProfileImage from "@/components/ProfileImage";
import { cn } from "@/utils";

export default function ChatPage({ params }: { params: { groupId: string } }) {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      console.log(res.data.user);
      setUser(res.data.user);
    });
  }, []);

  useEffect(() => {
    supabase
      .from("Groups")
      .select()
      .eq("gid", params.groupId)
      .then(({ data: groupData, error }) => {
        setGroupData(groupData?.[0]);
      });
  }, []);

  useEffect(() => {
    if (!groupData) return;
    supabase
      .from("Chats")
      .select(`*, Users (firstName, lastName)`)
      .order("created_at", { ascending: false })
      .eq("gid", groupData.gid)
      .then((res) => {
        console.log(res.data);
        setChats(res.data);
      });
  }, [groupData]);

  // useEffect(() => {
  //   if (!groupData || !userData) return;
  //   const members = groupData.members.filter(
  //     (member) => member !== userData.uid
  //   );
  //   console.log(members);
  //   supabase
  //     .from("Users")
  //     .select()
  //     .in("uid", members)
  //     .then((res) => {
  //       console.log(data);
  //       const membersMap = res.data?.reduce((acc, member) => {
  //         return {
  //           ...acc,
  //           [member.uid]: {
  //             firstName: member.firstName,
  //             lastName: member.lastName,
  //           },
  //         };
  //       }, {});
  //       setMembersData({
  //         ...membersMap,
  //         [userData.uid]: {
  //           firstName: userData.firstName,
  //           lastName: userData.lastName,
  //         },
  //       });
  //     });
  // }, [groupData, userData]);

  const sendMessage = async () => {
    if (!text || !user || !groupData) return;
    const message = {
      gid: groupData.gid,
      message: text,
      author: user.id,
      reactions: "",
    };
    await supabase.from("Chats").insert([message]);
    setText("");
  };

  const emojiMap = { Bowling: "🎳", Cooking: "🍳" };

  if (!groupData || !chats) return null;
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-4/5 animate-in opacity-0 flex flex-col gap-6 p-6">
        <div className="flex gap-4 items-center justify-start">
          <div className="bg-purple-300 flex justify-center items-center w-24	h-24 text-4xl rounded-full">
            {emojiMap[groupData.hobby]}
          </div>
          <h2 className="font-bold text-black text-4xl">
            {groupData.groupName}
          </h2>
        </div>
        <div className="bg-gray-300/30 flex-1 rounded-xl flex p-4 flex-col-reverse">
          <input
            className="rounded-xl h-10 px-4"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.code == "Enter") sendMessage();
            }}
          ></input>
          <div className="flex flex-col gap-5 py-4">
            {chats.map((chat) => (
              <div key={chat.cid} className="flex gap-4">
                <ProfileImage user={chat.Users} type="sm" />
                <div className="relative">
                  <p className="text-gray-500 text-xs absolute -top-4">
                    {chat.Users.firstName}
                  </p>
                  <p
                    className={cn(
                      chat.author === user.id ? "bg-blue-600" : "",
                      "px-3 py-1 text-white rounded-2xl text-md"
                    )}
                  >
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
