"use client";

import { cn } from "@/utils";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface RouteTabsProps {
  routes: { route: string; name: string }[];
}

const RouteTabs: React.FC<RouteTabsProps> = ({ routes }) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 sm:gap-5 w-full justify-start text-[#8A6697] items-center text-sm">
      {routes.map((route) => (
        <Link
          key={route.route}
          href={route.route}
          className={cn(
            route.route === pathname && "!bg-[rgba(255,255,255,0.6)]",
            "py-0.5 px-4 rounded-full hover:bg-[rgba(255,255,255,0.3)]"
          )}
        >
          {route.name}
        </Link>
      ))}
    </div>
  );
};

export default RouteTabs;
