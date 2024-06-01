"use server";

import { createClient } from "@/utils/supabase/server";

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
  message: string
) {
  const supabase = createClient();
  const { data: feathersData, error: fetchError } = await supabase
    .from("Feathers")
    .select()
    .eq("sender", sender)
    .eq("recipient", recipient);
  if (feathersData.length > 0 || fetchError) return null;
  const { error } = await supabase.from("Feathers").insert([
    {
      sender,
      recipient,
      message,
    },
  ]);
  if (!error) return 1;
  else return null;
}
