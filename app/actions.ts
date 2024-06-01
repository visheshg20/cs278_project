"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function serverLogout() {
  await supabase.auth.signOut();
}

export async function serverGetAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;
  else return null;
}

export async function serverGetUser() {
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
  const { data: groupData, error } = await supabase
    .from("Groups")
    .select()
    .eq("gid", gid)
    .single();

  if (groupData) return groupData;
  else return null;
}

export async function serverGetGroupsByIds(gids: string[]) {
  const { data: groupData, error } = await supabase
    .from("Groups")
    .select()
    .in("gid", gids);

  if (groupData) return groupData;
  else return null;
}

export async function serverGetGroupMembersData(gid: string, uid?: string) {
  const groupData = await serverGetGroupById(gid);
  const allMembers = groupData.members;
  let { data: membersData, error } = await supabase
    .from("Users")
    .select()
    .in("uid", allMembers);
  console.log(membersData, error);
  if (!membersData) return null;

  if (uid) membersData = membersData.filter((member) => member.uid !== uid);

  const membersMap = membersData?.reduce((acc, member) => {
    const { uid, ...rest } = member;
    return {
      ...acc,
      [uid]: rest,
    };
  }, {});

  return membersMap;
}

export async function serverGetMembersDataByGroups(
  gids: string[],
  uid: string
) {
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
