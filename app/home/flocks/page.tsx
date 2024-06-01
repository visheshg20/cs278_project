import {
  serverGetGroupsByIds,
  serverGetMembersDataByGroups,
  serverGetUser,
} from "@/app/actions";
import Image from "next/image";
import { activitiesMap } from "@/types/types";
import { format } from "timeago.js";
import ProfileImage from "@/components/ProfileImage";
import Link from "next/link";

export default async function FlocksPage() {
  const user = await serverGetUser();
  const groupsData = await serverGetGroupsByIds(user.groups);
  const membersData = await serverGetMembersDataByGroups(user.groups, user.uid);

  console.log("data", membersData);
  return (
    <div className="flex overflow-scroll w-full gap-5 -ml-2.5">
      {groupsData?.map((group) => (
        <Link
          href={`/chat/${group.gid}`}
          className="flex flex-col shrink-0 hover:bg-[rgba(255,255,255,0.3)] cursor-pointer p-2.5 text-white"
        >
          <div className="relative">
            <Image
              alt=""
              src={activitiesMap[group.activity].image}
              width={250}
              height={250}
              draggable={false}
            />
            <div className="absolute top-2 left-2 drop-shadow-sm py-0.5 px-3 text-sm bg-black rounded-full">
              hello
            </div>
          </div>
          <div className="flex justify-between text-lg pt-1.5">
            {group.groupName}
            <div className="flex">
              {group.members
                .filter((elem) => elem !== user.uid)
                .map((member) => (
                  <div className="-ml-3 drop-shadow-md">
                    <ProfileImage type="xs" user={membersData[member]} />
                  </div>
                ))}
            </div>
          </div>
          <p className="text-sm">
            Matched {format(new Date(group.created_at))}
          </p>
        </Link>
      ))}
    </div>
  );
}
