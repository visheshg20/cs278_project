"use client";

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
      className="text-[#8A6697] bg-white text-center flex items-center justify-center px-4 py-2 text-xl rounded-xl no-underline hover:bg-btn-background-hover"
    >
      {children}
    </Link>
  );
};

export default LinkButton;
