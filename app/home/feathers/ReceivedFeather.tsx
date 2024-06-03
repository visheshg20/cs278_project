"use client";

import ProfileImage from "@/components/ProfileImage";
import { cn } from "@/utils";
import Image from "next/image";
import {
  serverCreateDM,
  serverAcceptFeather,
  serverPushDMMessage,
} from "@/app/actions";
import React, { useState, useLayoutEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ReceivedFeatherProps {
  feather: any;
}

const ReceivedFeather: React.FC<ReceivedFeatherProps> = ({ feather }) => {
  const { user } = useContext(AuthContext);
  const [expandText, setExpandText] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const router = useRouter();

  const acceptFeather = async () => {
    const newDM = await serverCreateDM(feather.Users.uid, user.uid);
    if (newDM.error) return setErrorMessage(newDM.error);
    const featherUpdate = await serverAcceptFeather(feather.id);
    if (featherUpdate.error) return setErrorMessage(featherUpdate.error);

    await serverPushDMMessage(newDM.id, feather.Users.uid, feather.message);

    router.push(`/messages/${newDM.id}`);
  };

  return (
    <div className="flex flex-col items-center rounded-lg text-[#8A6697] shrink-0 p-5">
      <div className="px-5 flex flex-col items-center">
        <ProfileImage type="xl" user={feather.Users} />
        <p className="font-semibold text-lg pt-2">
          {feather.Users?.firstName} {feather.Users?.lastName?.[0]}.
        </p>
        <p className="text-sm text-gray-500">{feather.groupName}</p>
      </div>
      <div
        className={cn(
          expandText
            ? "w-[300px]"
            : "w-[200px] text-elipsis-3 whitespace-nowrap",
          "mt-3 text-wrap text-center"
        )}
        onClick={() => setExpandText(true)}
      >
        {feather.message}{" "}
        {expandText && (
          <span
            className="font-semibold cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setExpandText(false);
            }}
          >
            Show less
          </span>
        )}
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        className={cn(
          "bg-purple-500 text-sm text-white py-1 px-3 pr-3 mt-2 w-fit rounded-md flex items-center gap-2"
        )}
        onClick={acceptFeather}
      >
        Accept Feather!
        <Image src="/feather.svg" alt="" width={20} height={12} />
      </button>
    </div>
  );
};

export default ReceivedFeather;
