import React from "react";
import Image from "next/image";
import { cn } from "@/utils";

interface ProfileImageProps {
  user: { firstName: string; lastName: string; profilePicture?: string };
  type?: "xs" | "sm" | "md" | "lg" | "xl";
}

const ProfileImage: React.FC<ProfileImageProps> = ({ user, type = "md" }) => {
  let fallbackClasses, imageClasses;
  if (type === "xs") {
    fallbackClasses = "w-3 h-3 text-xs p-3.5";
    imageClasses = "w-4 h-4";
  } else if (type === "sm") {
    fallbackClasses = "w-4 h-4 text-sm p-4";
    imageClasses = "w-4 h-4";
  } else if (type === "md") {
    fallbackClasses = "w-6 h-6 p-5 text-md";
    imageClasses = "w-6 h-6";
  } else if (type === "lg") {
    fallbackClasses = "w-[60px] h-[60px] text-lg p-6";
    imageClasses = "w-[60px] h-[60px]";
  } else {
    fallbackClasses = "w-[100px] h-[100px] text-lg";
    imageClasses = "w-[100px] h-[100px]";
  }

  return (
    <>
      {user.profilePicture ? (
        <div className={cn(imageClasses, "rounded-full")}>
          <Image src={user.profilePicture} alt="" fill />
        </div>
      ) : (
        <div
          className={cn(
            fallbackClasses,
            "rounded-full bg-[#bbb] flex justify-center items-center"
          )}
        >
          <span className="!text-black">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
