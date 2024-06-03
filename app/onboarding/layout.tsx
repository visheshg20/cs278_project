import React, { ReactNode } from "react";
import { serverGetUser } from "@/app/actions";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
};

const OnboardingLayout = async ({ children }: LayoutProps) => {
  const user = await serverGetUser();
  if (user?.status === 1) {
    return redirect("/home/flocks");
  }
  return <>{children}</>;
};

export default OnboardingLayout;
