import Link from "next/link";
import { serverGetUserAndSurveyByUid, serverGetUserByUid } from "@/app/actions";
import ProfileImage from "@/components/ProfileImage";

interface ProfilesPageProps {
  params: { uid: string };
}

export default async function ProfilesPage({
  params: { uid },
}: ProfilesPageProps) {
  const res = await serverGetUserAndSurveyByUid(uid);
  if (res.error) return <div></div>;
  const { Users: user, ...survey } = res;

  const topActivities = Object.keys(
    JSON.parse(survey.group_activities_rankings)
  )
    .sort(
      (a, b) =>
        parseInt(survey.group_activities_rankings[a]) -
        parseInt(survey.group_activities_rankings[b])
    )
    .splice(-3);

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col pt-[10%] items-center relative text-[#8A6697] gap-6">
      <div className="flex flex-col gap-3 items-center">
        <ProfileImage user={user} type="xl" />
        <h1 className="text-2xl">
          {user.firstName} {user.lastName[0]}
        </h1>
      </div>
      <div className="flex w-[85%] gap-3 sm:w-3/5 flex-col justify-center font-poppins text-center bg-[rgba(255,255,255,0.4)] rounded-xl p-8">
        <p>{user.bio}</p>
        <div className="flex gap-2 flex-wrap">
          Interests:
          <div className="flex gap-2 flex-wrap">
            {survey.activities.map((activity) => (
              <div className="text-white bg-[#8A6697] px-3 py-1 rounded-full">
                {activity}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          Top 3 activities:
          <div className="flex gap-2 flex-wrap">
            {topActivities.map((activity) => (
              <div className="text-white bg-[#8A6697] px-3 py-1 rounded-full">
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
