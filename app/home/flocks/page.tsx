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
import UpcomingFlock from "./UpcomingFlock";

export default async function FlocksPage() {
  const user = await serverGetUser();
  const AWAIT_groupsData = serverGetGroupsByIds(user.groups);
  const AWAIT_membersData = serverGetMembersDataByGroups(user.groups, user.uid);
  let groupsData = await AWAIT_groupsData;
  const membersData = await AWAIT_membersData;

  return (
    <div className="flex overflow-scroll w-screen sm:w-full gap-5 -ml-[34px]">
      {groupsData?.map((group) => (
        <Link
          href={`/messages/${group.gid}`}
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
            {group.scheduledMeet ? (
              <div className="absolute top-2 left-2 drop-shadow-sm py-0.5 px-3 text-sm bg-white text-[#8A6697] rounded-full">
                {new Date(group.scheduledMeet)
                  .toLocaleString("en-US", {
                    weekday: "short",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                  .split(",")
                  .join(" ")}
              </div>
            ) : (
              <div className="absolute top-2 left-2 drop-shadow-sm py-0.5 px-3 text-sm bg-blue-400 text-white rounded-full">
                TBD
              </div>
            )}
          </div>
          <div className="flex max-w-[250px] justify-between text-lg pt-1.5">
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
      <UpcomingFlock />
    </div>
  );
}
