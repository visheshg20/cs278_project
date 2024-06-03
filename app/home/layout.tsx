import { cn } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { serverGetUser } from "@/app/actions";
import RouteTabs from "@/app/home/RouteTabs";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const headerURL = new URL(headers().get("x-url") ?? "");
  // const pathname = headerURL.pathname;
  const user = await serverGetUser();

  const routes = [
    { route: "/home/flocks", name: "Flocks" },
    { route: "/home/feathers", name: "Feathers" },
    { route: "/home/prev", name: "Previous Flocks" },
  ];
  console.log(user);
  if (user?.status === 0) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-[95%] sm:w-4/5 animate-in opacity-0 flex flex-col gap-4 p-6 font-poppins">
        <h2 className="font-semibold text-white text-4xl self-start">
          Welcome Back, {user.firstName}
        </h2>
        <h4 className=" text-[#8A6697] text-lg mb-4 self-start">
          Next flocks released in 2 days, 18 hours
        </h4>
        <hr className="border-black" />
        <RouteTabs routes={routes} />
        {children}
      </main>
    </div>
  );
}
