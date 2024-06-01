import Link from "next/link";
import ProfileImage from "@/components/ProfileImage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { serverGetUser } from "@/app/actions";

export default async function FlocksPage() {
  const supabase = createClient();

  const user = await serverGetUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("Users")
    .select()
    .eq("uid", user.id);
  if (error) {
    console.error(error);
    return;
  }
  if (userData[0].status === 0) {
    return redirect("/onboarding");
  }

  const { data: groupsData } = await supabase
    .from("Groups")
    .select()
    .in("gid", userData[0].groups);

  const allMembers = groupsData
    ?.reduce((acc, group) => [...acc, ...group.members], [])
    .filter((member) => member !== user.id);

  const { data: membersData } = await supabase
    .from("Users")
    .select()
    .in("uid", allMembers);

  const membersMap = membersData?.reduce((acc, member) => {
    return {
      ...acc,
      [member.uid]: { firstName: member.firstName, lastName: member.lastName },
    };
  }, {});

  const emojiMap = { Bowling: "🎳", Cooking: "🍳" };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <main className="flex-1 w-4/5 animate-in opacity-0 flex flex-col gap-6 p-6">
        <h2 className="font-bold text-black text-4xl mb-4 self-start">
          Welcome back to your Flocks
        </h2>
        <h4 className=" text-[#8A6697] text-lg mb-4 self-start">
          Next flocks released in 2 days, 18 hours
        </h4>
        <hr className="border-black" />
        <div className="">
          {groupsData.map((group, index: number) => (
            <Link
              href={`/chat/${group.gid}`}
              className="w-full"
              key={`${group.gid}-${index}`}
            >
              <div className="flex w-full justify-between">
                <div className="flex gap-4">
                  <div className="bg-purple-300 flex justify-center items-center w-24	h-24 text-4xl rounded-full">
                    {emojiMap[group.hobby]}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-black text-2xl">
                      {group.groupName}
                    </h3>
                    <div className="flex gap-4">
                      {Object.keys(membersMap)
                        .filter((member) => group.members.includes(member))
                        .map((member, index) => (
                          <ProfileImage
                            user={membersMap[member]}
                            key={`${group.gid}-${member}-${index}`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    Matched:{" "}
                    {new Date(group.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>In Common: {group.hobby}</div>
                  <div>Met Yet?: {group.haveMet ? "Yes!" : "No"}</div>
                </div>
              </div>

              <hr className="border-black m-5" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
