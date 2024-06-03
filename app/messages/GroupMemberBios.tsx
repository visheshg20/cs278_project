import React, { useEffect } from "react";
import { serverGetGroupMembersData } from "@/app/actions";
import ProfileImage from "@/components/ProfileImage";

interface GroupMemberBiosProps {
  groupData: any;
  uid: any;
}

const GroupMemberBios: React.FC<GroupMemberBiosProps> = ({
  groupData,
  uid,
}) => {
  const [groupMembers, setGroupMembers] = React.useState([]);
  useEffect(() => {
    const getData = async () => {
      const groupMembers = await serverGetGroupMembersData(groupData.gid, uid);
      setGroupMembers(groupMembers);
    };
    getData();
  }, []);

  return (
    <div className="flex gap-3 flex-wrap w-full pb-3 relative z-0">
      {Object.entries(groupMembers).map(([key, member], index) => (
        <div
          key={`${key}-index`}
          className="flex flex-col gap-2 items-center bg-[rgba(255,255,255,0.2)] py-3 px-4 rounded-xl flex-1"
        >
          <ProfileImage user={member} />
          <p className="text-white text-sm">
            {member.firstName} {member.lastName[0]}.
          </p>
          <p className="text-white text-sm text-center">{member.bio}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupMemberBios;
