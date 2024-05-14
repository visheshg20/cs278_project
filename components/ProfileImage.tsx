import { createClient } from "@/utils/supabase/server";
import React from "react";
import Image from "next/image";

// interface ProfileImageProps {
//   imageUrl: string;
//   altText: string;
// }

const ProfileImage: React.FC = async ({}) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: userData, error } = await supabase
    .from("Users")
    .select()
    .eq("uid", user?.id);
  const userObj = userData?.[0];
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
