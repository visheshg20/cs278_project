"use client";

import AuthButton from "@/components/AuthButton";
import LinkButton from "@/components/LinkButton";
import ProfileImage from "@/components/ProfileImage";
import { createClient } from "@/utils/supabase/client";
import { data } from "autoprefixer";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { group } from "console";

export default function ChatPage({ params }: { params: { groupId: string } }) {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [membersData, setMembersData] = useState(null);
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
    if (!user || userData) return;
    supabase
      .from("Users")
      .select()
      .eq("uid", user.id)
      .then(({ data: userData, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setUserData(userData[0]);
      });
  }, [user]);

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
    if (!groupData || !userData) return;
    const members = groupData.members.filter(
      (member) => member !== userData.uid
    );
    console.log(members);
    supabase
      .from("Users")
      .select()
      .in("uid", members)
      .then((res) => {
        console.log(data);
        const membersMap = res.data?.reduce((acc, member) => {
          return {
            ...acc,
            [member.uid]: {
              firstName: member.firstName,
              lastName: member.lastName,
            },
          };
        }, {});
        setMembersData({
          ...membersMap,
          [userData.uid]: {
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
        });
      });
  }, [groupData, userData]);

  useEffect(() => {
    if (!groupData) return;
    supabase
      .from("Chats")
      .select()
      .order("created_at", { ascending: false })
      .eq("gid", groupData.gid)
      .then((res) => {
        console.log(data);
        setChats(res.data);
      });
  }, [groupData]);

  const sendMessage = async () => {
    if (!text || !userData || !groupData) return;
    const message = {
      gid: groupData.gid,
      message: text,
      author: userData.uid,
      reactions: "",
    };
    await supabase.from("Chats").insert([message]);
    setText("");
  };

  const emojiMap = { Bowling: "🎳", Cooking: "🍳" };

  if (!groupData || !userData || !membersData) return null;
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
          <div className="flex flex-col gap-4 py-4">
            {chats.map((chat) => (
              <div key={chat.cid} className="flex gap-4">
                <div className="rounded-full w-6 h-6 bg-gray-400"></div>
                <div>
                  <p>{membersData[chat.author]?.firstName}</p>
                  <p>{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
