import { createClient } from "@/utils/supabase/server";
import React from "react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

interface ProfileImageProps {
  userInfo?:
    | { firstName: string; lastName: string; profilePicture?: string }
    | User
    | null;
}

const ProfileImage: React.FC<ProfileImageProps> = async ({ userInfo }) => {
  let userObj = userInfo;
  if (!userInfo) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: userData, error } = await supabase
      .from("Users")
      .select()
      .eq("uid", user?.id);
    userObj = userData?.[0];
  }
  if (!userObj) return;
  return (
    <>
      {userObj.profilePicture ? (
        <div className="w-6 h-6 rounded-full">
          <Image src={userObj.profilePicture} alt="" fill />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-[#bbb] p-5 flex justify-center items-center">
          <span className="text-md">
            {userObj.firstName[0]}
            {userObj.lastName[0]}
          </span>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
