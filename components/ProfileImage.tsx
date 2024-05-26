"use client";

import React from "react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { cn } from "@/utils";

interface ProfileImageProps {
  userInfo?:
    | { firstName: string; lastName: string; profilePicture?: string }
    | User
    | null;
  type?: "sm" | "md";
}

const ProfileImage: React.FC<ProfileImageProps> = ({ user, type = "md" }) => {
  return (
    <>
      {user.profilePicture ? (
        <div
          className={cn(type === "md" ? "w-6 h-6" : "w-4 h-4", "rounded-full")}
        >
          <Image src={user.profilePicture} alt="" fill />
        </div>
      ) : (
        <div
          className={cn(
            type === "md" ? "w-6 h-6 p-5 text-md" : "w-4 h-4 text-sm p-4",
            "rounded-full bg-[#bbb]  flex justify-center items-center"
          )}
        >
          <span className="">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
