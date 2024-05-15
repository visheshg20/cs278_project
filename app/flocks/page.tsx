import AuthButton from "@/components/AuthButton";
import LinkButton from "@/components/LinkButton";
import ProfileImage from "@/components/ProfileImage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function FlocksPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
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

  const { data: groupsData, error: groupsError } = await supabase
    .from("Groups")
    .select()
    .in("gid", userData[0].groups);

  // console.log(groupsData);

  const allMembers = groupsData
    ?.reduce((acc, group) => [...acc, ...group.members], [])
    .filter((member) => member !== user.id);
  // console.log(allMembers);

  const { data: membersData, error: membersError } = await supabase
    .from("Users")
    .select()
    .in("uid", allMembers);

  const membersMap = membersData?.reduce((acc, member) => {
    return {
      ...acc,
      [member.uid]: { firstName: member.firstName, lastName: member.lastName },
    };
  }, {});

  // console.log(membersMap);

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
            <div className="flex w-full justify-around">
              <div className="flex">
                <div className="bg-purple-300 flex justify-center items-center w-24	h-24 text-4xl rounded-full">
                  {emojiMap[group.hobby]}
                </div>
                <div>
                  <h3 className="font-bold text-black text-2xl">
                    {group.groupName}
                  </h3>
                  {Object.keys(membersMap)
                    .filter((member) => group.members.includes(member))
                    .map((member) => (
                      <ProfileImage userInfo={membersMap[member]} />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}