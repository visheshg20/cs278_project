"use client";

import React, { useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { questions } from "@/app/onboarding/onboardingQuestions";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FullScreenQuestion from "@/app/onboarding/FullScreenQuestion";
import { AuthContext } from "@/app/contexts/AuthContext";

interface FormData {
  firstName: string;
  lastName: string;
  prefName: string;
  studentStatus: "Undergraduate Student" | "Graduate Student" | "";
  school: string;
  phoneNumber: string;
  values: string[];
  activities: string[];
  groupActivitiesRankings: { [key: string]: number };
  excitementLevel: number | undefined;
  bio: string;
}

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const ref = React.useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    prefName: "",
    studentStatus: "",
    school: "",
    phoneNumber: "",
    values: [],
    activities: [],
    groupActivitiesRankings: {
      "Casual soccer match": -1,
      "Super Smash Bros & Mario Kart Tournament": -1,
      "Board Game Nights": -1,
      "Group Hikes": -1,
      "Rock Climbing": -1,
      "Cooking Classes": -1,
      "Wine & Cheese Night": -1,
      Volunteering: -1,
    },
    excitementLevel: -1,
    bio: "",
  });

  const handleSubmit = async () => {
    console.info("Form Data Submitted:", formData);
    const userFields = questions
      .filter((question) => question.table === "Users")
      .map((question) => question.field);
    const surveyFields = questions
      .filter((question) => question.table === "Survey")
      .map((question) => question.field);
    const userObject = Object.entries(formData).reduce((acc, [key, value]) => {
      if (userFields.includes(key)) return { ...acc, [key]: value };
      else return acc;
    }, {});
    const surveyObject = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (key === "groupActivitiesRankings")
          return { ...acc, [key]: JSON.stringify(value) };
        else if (surveyFields.includes(key)) return { ...acc, [key]: value };
        else return acc;
      },
      {}
    );

    const { error: userError } = await supabase
      .from("Users")
      .update({ ...userObject, status: 1 })
      .eq("uid", user?.uid);

    if (userError) {
      console.error(userError);
      return;
    }

    const { error: surveyError } = await supabase.from("Survey").insert({
      group_activities_rankings: surveyObject.groupActivitiesRankings,
      excitement_level: surveyObject.excitementLevel,
      activities: surveyObject.activities,
      values: surveyObject.values,
      uid: user?.uid,
    });
    if (surveyError) {
      console.error(surveyError);
      return;
    }

    router.push("/onboarding/complete");
  };

  const flattenedObj = Object.entries(formData).reduce((acc, [key, value]) => {
    if (key === "groupActivitiesRankings") {
      return { ...acc, ...value };
    } else {
      return { ...acc, [key]: value };
    }
  }, {});
  const completedQuestions = Object.values(flattenedObj).filter((entry) => {
    if (typeof entry === "object") return Object.values(entry).length > 0;
    if (typeof entry === "number") return entry >= 0;
    return entry?.length > 0;
  }).length;

  const handleQuestionChange = (dir: number) => {
    if (dir > 0) {
      setDirection(1);
      setQuestionIndex(Math.min(questions.length - 1, questionIndex + 1));
    } else {
      setDirection(-1);
      setQuestionIndex(Math.max(0, questionIndex - 1));
    }
  };

  if (user?.status === 1) router.push("/home");
  return (
    <div className="flex-1 w-full overflow-hidden flex justify-center relative">
      <div className="flex w-[85%] sm:w-1/2 flex-col justify-center mt-8">
        <h1 className="text-3xl text-white font-poppins m-4 mt-0 text-center">
          Tell us about yourself!
        </h1>
        <div className="bg-[rgba(0,0,0,0.5)] h-1.5 my-4 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-1.5 bg-white rounded-full transition-all transition-duration-300"
            style={{
              width: `${(100 * completedQuestions) / questions.length}%`,
            }}
          ></div>
        </div>
        <div className="h-full">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={questionIndex}
              variants={{
                enter: {
                  y: direction > 0 ? 200 : -200,
                  opacity: 0,
                },
                center: {
                  y: 0,
                  opacity: 1,
                },
                exit: {
                  y: direction < 0 ? 200 : -200,
                  opacity: 0,
                },
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.2,
                y: { type: "spring", stiffness: 400, damping: 50 },
                opacity: { duration: 0.2 },
              }}
              className="h-full"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, dragInfo) => {
                if (Math.abs(dragInfo.velocity.y) > 50) {
                  handleQuestionChange(-Math.sign(dragInfo.velocity.y));
                }
              }}
            >
              <FullScreenQuestion
                question={questions[questionIndex]}
                index={questionIndex + 1}
                isLast={questionIndex === questions.length - 1}
                currentFormData={
                  questions[questionIndex].field === "bio" && formData
                }
                value={
                  questions[questionIndex].subfield
                    ? formData[questions[questionIndex].field][
                        questions[questionIndex].subfield
                      ]
                    : formData[questions[questionIndex].field]
                }
                onAnswer={(answer) => {
                  if (questions[questionIndex].subfield) {
                    setFormData({
                      ...formData,
                      [questions[questionIndex].field]: {
                        ...formData[questions[questionIndex].field],
                        [questions[questionIndex].subfield]: answer,
                      },
                    });
                  } else {
                    setFormData({
                      ...formData,
                      [questions[questionIndex].field]: answer,
                    });
                  }
                  handleQuestionChange(1);
                  console.log(completedQuestions, questions.length - 1);
                  if (completedQuestions >= questions.length - 1) {
                    console.log("Submitting form");
                    handleSubmit();
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 bg-[rgba(255,255,255,0.3)] flex drop-shadow-sm rounded-lg gap-1 h-9 px-1 items-center">
        <button onClick={() => handleQuestionChange(-1)}>
          <Image alt="" src="/chevron-up.svg" height={30} width={30} />
        </button>
        <div className="w-0.5 bg-white h-full" />
        <button onClick={() => handleQuestionChange(1)}>
          <Image alt="" src="/chevron-down.svg" height={30} width={30} />
        </button>
      </div>
    </div>
  );
}
