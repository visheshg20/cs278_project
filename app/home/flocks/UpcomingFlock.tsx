"use client";

import React from "react";
import Image from "next/image";
import useCountdownTimer from "@/utils/useCountdown";
import { getNextWednesdayAt6PM } from "@/utils";

interface UpcomingFlockProps {
  // Define the props for your component here
}

const UpcomingFlock: React.FC<UpcomingFlockProps> = (props) => {
  const targetTime = getNextWednesdayAt6PM();
  const timer = useCountdownTimer(targetTime.toISOString());

  return (
    <div
      className="flex relative p-2.5 m-2.5 text-center items-center flex-col justify-center shrink-0 w-[250px] h-[250px] select-none text-[#8A6697]"
      // style={{
      //   backgroundImage:
      //     "url('data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23000000FF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='12' stroke-linecap='square'/%3e%3c/svg%3e')",
      // }}
    >
      <Image
        alt=""
        height={250}
        width={250}
        className="absolute top-0 left-0"
        src="data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='12' stroke-linecap='square'/%3e%3c/svg%3e"
      />
      New flock in
      <span className="font-semibold">{timer}</span>
    </div>
  );
};

export default UpcomingFlock;
