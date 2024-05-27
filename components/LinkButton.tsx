"use client";

import { cn } from "@/utils";
import Link from "next/link";
import React from "react";

interface LinkButtonProps {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  disabled,
  children,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        disabled && "pointer-events-none",
        "text-[#8A6697] bg-white text-center flex items-center justify-center px-4 py-2 text-md rounded-xl no-underline hover:shadow-[0_0px_10px_rgb(255,0,255)] transition duration-250"
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
