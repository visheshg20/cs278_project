"use server";

import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

export async function serverLogout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function serverGetAuth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;
  else return null;
}

export async function serverGetUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData, error } = await supabase
    .from("Users")
    .select()
    .eq("uid", user.id)
    .limit(1)
    .single();

  if (userData) return userData;
  else return null;
}

export async function serverGetGroupById(gid: string) {
  const supabase = createClient();
  const { data: groupData, error } = await supabase
    .from("Groups")
    .select()
    .eq("gid", gid)
    .limit(1)
    .single();

  if (groupData) return groupData;
  else return null;
}

export async function serverGetGroupsByIds(gids: string[]) {
  const supabase = createClient();
  const { data: groupData, error } = await supabase
    .from("Groups")
    .select()
    .in("gid", gids);

  if (groupData) return groupData;
  else return null;
}

export async function serverGetGroupMembersData(gid: string, uid?: string) {
  const supabase = createClient();
  const groupData = await serverGetGroupById(gid);
  const allMembers = groupData.members;
  let { data: membersData, error } = await supabase
    .from("Users")
    .select()
    .in("uid", allMembers);
  if (!membersData) return null;

  if (uid) membersData = membersData.filter((member) => member.uid !== uid);

  const membersMap = membersData?.reduce((acc, member) => {
    const { uid, groups, ...rest } = member;
    return {
      ...acc,
      [uid]: { ...rest, groupName: groupData.groupName },
    };
  }, {});

  return membersMap;
}

export async function serverGetMembersDataByGroups(
  gids: string[],
  uid: string
) {
  const supabase = createClient();
  const groupsData = await serverGetGroupsByIds(gids);
  const allMembers = groupsData
    ?.reduce((acc, group) => [...acc, ...group.members], [])
    .filter((member) => member !== uid);

  const { data: membersData } = await supabase
    .from("Users")
    .select()
    .in("uid", allMembers);

  const membersMap = membersData?.reduce((acc, member) => {
    const { uid, ...rest } = member;
    return {
      ...acc,
      [uid]: rest,
    };
  }, {});
  return membersMap;
}

export async function serverGetAvailableFeatherRecipients(
  gids: string[],
  uid: string
) {
  const supabase = createClient();
  const AWAIT_sentFeathersUsers = supabase
    .from("Feathers")
    .select("recipient")
    .eq("sender", uid);
  const groupsData = await serverGetGroupsByIds(gids);
  const { data: sentFeathersUsers } = await AWAIT_sentFeathersUsers;
  const sentFeathersUsersList = sentFeathersUsers.map((user) => user.recipient);

  groupsData?.filter((group) => group.hasMet);
  let promises: Promise<{}>[] = [];
  groupsData?.forEach((group) => {
    promises.push(serverGetGroupMembersData(group.gid, uid));
  });

  const membersMaps = await Promise.all(promises);
  console.log(membersMaps);
  const flattenedMembersMap = membersMaps.reduce((acc, membersMap) => {
    const filteredMembersMap = Object.entries(membersMap).reduce(
      (acc, [key, value]) => {
        if (!sentFeathersUsersList.includes(key))
          return { ...acc, [key]: value };
        else return acc;
      },
      {}
    );
    return { ...acc, ...filteredMembersMap };
  }, {});

  if (!groupsData) return null;

  return flattenedMembersMap;
}

export async function serverSendFeather(
  sender: string,
  recipient: string,
  message: string,
  groupName: string
) {
  const supabase = createClient();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { data: feathersData, error: fetchError } = await supabase
    .from("Feathers")
    .select()
    .eq("sender", sender)
    .eq("recipient", recipient);
  if (feathersData.length > 0 || fetchError) return null;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a tool for content moderation, meant to check the appropriateness of messages being sent between users. Output your confidence on how appropriate a message is as a decimal value between 0 and 1. Your output should only be this number. Check the appropriateness for this message: ${message}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  if (completion?.choices?.[0]?.message?.content) {
    const confidence = parseFloat(completion.choices[0].message.content);
    if (confidence < 0.35) return { error: "That's not very nice!" };
  }

  const { error } = await supabase.from("Feathers").insert([
    {
      sender,
      recipient,
      message,
      groupName,
      accepted: false,
    },
  ]);
  if (!error) return { error: null };
  else return { error: "Failed to send feather" };
}

export async function serverGetReceivedFeathers(uid: string) {
  const supabase = createClient();
  const { data: feathersData, error } = await supabase
    .from("Feathers")
    .select(`*, Users:sender (*)`)
    .eq("recipient", uid)
    .eq("accepted", false);

  if (feathersData) return feathersData;
  else return null;
}

export async function serverCreateDM(uid1: string, uid2: string) {
  const supabase = createClient();

  const { data: DMData, error: DMError } = await supabase
    .from("DMs")
    .select()
    .in("user1", [uid1, uid2])
    .in("user2", [uid1, uid2]);

  if (DMData?.length > 0) {
    return DMData?.[0];
  } else if (DMError) return { error: DMError };

  const { data: newDMData, error } = await supabase
    .from("DMs")
    .upsert({
      user1: uid1,
      user2: uid2,
    })
    .select()
    .single();

  if (error) return { error: error };
  else return newDMData;
}

export async function serverAcceptFeather(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Feathers")
    .update({
      accepted: true,
    })
    .eq("id", id);

  return { error: error ?? null };
}
