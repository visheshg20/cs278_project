"use client";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormData {
  values: string[];
  activities: string[];
  groupActivitiesRankings: { [key: string]: number };
  excitementLevel: number;
}

const groupActivities = [
  "Casual soccer match",
  "Super Smash Bros & Mario Kart Tournament",
  "Board Game Nights",
  "Group Hikes",
  "Rock Climbing",
  "Cooking Classes",
  "Wine & Cheese Night",
  "Volunteering",
];

const SurveyPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    values: [],
    activities: [],
    groupActivitiesRankings: groupActivities.reduce(
      (acc, activity) => ({ ...acc, [activity]: 0 }),
      {}
    ),
    excitementLevel: 3,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info("Form Data Submitted:", formData);
    router.push("/home");
  };

  const handleValueChange = (value: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.values.includes(value);
      const numSelected = prev.values.length;

      if (!alreadySelected && numSelected >= 3) {
        alert("You can select only up to three values.");
        return prev; // Do not add more if three are already selected
      }

      return {
        ...prev,
        values: alreadySelected
          ? prev.values.filter((item) => item !== value)
          : [...prev.values, value],
      };
    });
  };

  const handleActivityChange = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((item) => item !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleGroupActivityRankChange = (activity: string, rank: number) => {
    setFormData((prev) => ({
      ...prev,
      groupActivitiesRankings: {
        ...prev.groupActivitiesRankings,
        [activity]: rank,
      },
    }));
  };

  const handleExcitementLevelChange = (level: number) => {
    setFormData((prev) => ({
      ...prev,
      excitementLevel: level,
    }));
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-8 w-4/5 h-4/5 rounded-xl bg-white/50 backdrop-blur-md border border-gray-300 overflow-auto">
        <h1 className="text-2xl m-4 mt-0">Let{"'"}s get to know you better!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="">
            <h2>
              Which values are most important to you in a friendship? (Select up
              to three)
            </h2>
            <div className="grid grid-cols-3 break-words gap-x-4 gap-y-4">
              {[
                "Dark Humor",
                "Sarcasm",
                "Empathy",
                "Loyalty",
                "Honesty",
                "Open-mindedness",
                "Reliability",
                "Adventurousness",
                "Supportiveness",
                "Intellectual Curiosity",
                "Creativity",
                "Optimism",
                "Social Conscience",
              ].map((value) => (
                <label
                  key={value}
                  className={cn(
                    formData.values.includes(value) &&
                      "border border-[#64a3f0]",
                    "bg-white/70 w-fit p-3 rounded-xl select-none	box-border"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.values.includes(value)}
                    onChange={() => handleValueChange(value)}
                  />
                  &nbsp;&nbsp;
                  {value}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2>
              How do you prefer to spend your free time? (Select all that apply)
            </h2>
            <div className="grid grid-cols-3 break-words gap-x-4 gap-y-4">
              {[
                "Outdoors",
                "Gaming",
                "Reading/Writing",
                "Sports & Working Out",
                "Arts & Crafts",
                "Watching TV & Movies",
                "Going out & Nightlife",
              ].map((activity) => (
                <label
                  key={activity}
                  className={cn(
                    formData.values.includes(activity) &&
                      "border border-[#64a3f0]",
                    "bg-white/70 w-fit p-3 rounded-xl select-none	box-border"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.activities.includes(activity)}
                    onChange={() => handleActivityChange(activity)}
                  />
                  &nbsp;&nbsp;
                  {activity}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2>
              What type of group activities interest you? (Please rank these
              options)
            </h2>
            {groupActivities.map((activity) => (
              <div key={activity}>
                <label>
                  {activity}:
                  <select
                    value={formData.groupActivitiesRankings[activity]}
                    onChange={(e) =>
                      handleGroupActivityRankChange(
                        activity,
                        Number(e.target.value)
                      )
                    }
                    style={{ color: "black" }} // Ensure the dropdown text is visible
                  >
                    <option value={0}>Select rank</option>
                    {Array.from(
                      { length: groupActivities.length },
                      (_, i) => i + 1
                    ).map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
          <div>
            <h2>How excited are you to meet IRL?</h2>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.excitementLevel}
              onChange={(e) =>
                handleExcitementLevelChange(parseInt(e.target.value))
              }
            />
            <span>{formData.excitementLevel}</span>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SurveyPage;
