"use client";

import { usePathname } from "next/navigation";
import { cn, isIOS } from "@/utils";

export default function RenderIOS({
  children,
  target,
}: {
  children: React.ReactNode;
  target: string;
}) {
  const pathname = usePathname();
  const isViewingChat = pathname.split("/").splice(-1)[0] !== "messages";
  console.log(isViewingChat);

  if (target === "right") {
    if (!isViewingChat && isIOS()) return <></>;
    else return children;
  } else if (target === "left") {
    if (!isIOS()) return children;
    return (
      <div
        className={cn(
          isViewingChat ? "hidden" : "flex",
          "flex-1 min-h-full relative flex-col max-w-[350px]"
        )}
      >
        {children}
      </div>
    );
  }
}
