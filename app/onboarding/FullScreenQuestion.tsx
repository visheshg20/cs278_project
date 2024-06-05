import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import range from "lodash/range";
import TextareaInput from "@/app/onboarding/TextareaInput";
import GenerateBioButton from "@/app/onboarding/GenerateBioButton";
import { rest } from "lodash";
import { serverGenerateBio } from "@/app/actions";

interface FullScreenQuestionProps {
  question: {
    type: string;
    question: string;
    options?: string[];
    validation: (input: any) => string;
  };
  currentFormData?: any;
  index: number;
  questionChange: (index: number) => void;
  isLast?: boolean;
  value: any;
  onAnswer: (answer: string) => void;
}

const FullScreenQuestion: React.FC<FullScreenQuestionProps> = ({
  question,
  index,
  onAnswer,
  currentFormData,
  questionChange,
  value,
  isLast,
}) => {
  const [response, setResponse] = useState<any>(value);
  const [error, setError] = useState("");

  const handleSubmit = (event?: React.FormEvent) => {
    if (question.type === "info") questionChange(1);
    else if (!question.validation(response)) onAnswer(response);
    else setError(question.validation(response));
  };

  const handleTextChange = (e) => {
    setResponse(e.target.value);
  };

  const handleRadioChange = (e) => {
    setResponse(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    if (!e.target.value) return;
    if (response.includes(e.target.value)) {
      setResponse(response.filter((item) => item !== e.target.value));
    } else setResponse([...response, e.target.value]);
  };

  const handleNumericalChange = (e) => {
    if (response === e.target.value) setResponse(-1);
    else if (e.target.value) setResponse(e.target.value);
  };

  const generateBio = async () => {
    const { groupActivitiesRankings, phoneNumber, ...rest } = currentFormData;
    const { bio } = await serverGenerateBio(rest);
    setResponse(bio);
  };

  let inputElem;
  if (question.type === "text") {
    inputElem = (
      <input
        className="bg-transparent border-b-[1.5px] border-white drop-shadow-md !text-base px-3 py-2 outline-none transition-all focus:bg-[rgba(255,255,255,0.2)] focus:border-b-[3px]"
        type="text"
        value={response}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleSubmit();
          }
        }}
        onChange={handleTextChange}
      />
    );
  } else if (question.type === "radio") {
    inputElem = (
      <div className="text-base flex gap-x-10 gap-y-2 flex-wrap">
        {question.options?.map((option, index) => (
          <label
            key={`options-${index}`}
            className="relative rounded-lg px-4 py-1.5 bg-gray-400 opacity-100 cursor-pointer text-center"
          >
            <div
              className={cn(
                response === option && "!opacity-100",
                "opacity-0 transition-all absolute w-full h-full rounded-[7px] left-0 top-0 !duration-[350ms] cursor-pointer bg-gradient-to-r !from-[#fff700c2] via-30% via-[#FFBF00] !to-[#FF0000]"
              )}
            />
            <div className={cn("relative z-[1]")}>
              {option}
              <input
                type="radio"
                className="appearance-none"
                checked={response === option}
                value={option}
                onChange={handleRadioChange}
              />
            </div>
          </label>
        ))}
      </div>
    );
  } else if (question.type === "checkbox") {
    inputElem = (
      <div className="text-base flex gap-x-5 gap-y-3 flex-wrap items-stretch">
        {question.options?.map((option, index) => (
          <label
            key={`checkbox-options-${index}`}
            className="relative rounded-lg px-4 py-1.5 bg-gray-400 opacity-100 cursor-pointer text-center"
            onClick={handleCheckboxChange}
          >
            <div
              className={cn(
                response.includes(option) && "!opacity-100",
                "opacity-0 transition-all absolute w-full h-full rounded-[7px] left-0 top-0 !duration-[350ms] cursor-pointer bg-gradient-to-r !from-[#fff700c2] via-30% via-[#FFBF00] !to-[#FF0000]"
              )}
            />
            <div className={cn("relative z-[1]")}>
              {option}
              <input
                type="radio"
                className="appearance-none"
                checked={response.includes(option)}
                value={option}
                onChange={() => {}}
              />
            </div>
          </label>
        ))}
      </div>
    );
  } else if (question.type === "numeric") {
    inputElem = (
      <div className="text-base flex gap-x-0 gap-y-3 flex-wrap">
        {range(question.range[0], question.range[1] + 1).map(
          (number, index) => (
            <label
              className="relative flex-[1_1_25%] sm:flex-1  px-4 py-1.5 bg-[rgba(255,255,255,0.3)] flex items-center justify-center border -mr-[1px] border-white opacity-100 cursor-pointer text-center"
              onClick={handleNumericalChange}
              key={`numeric-options-${index}`}
            >
              <div
                className={cn(
                  parseInt(response) === number && "!opacity-100",
                  "opacity-0 transition-all absolute w-full h-full left-0 top-0 !duration-[350ms] cursor-pointer bg-gradient-to-r !from-[#fff700c2] via-30% via-[#FFBF00] !to-[#FF0000]"
                )}
              />
              <div className={cn("relative z-[1]")}>
                {number}
                <input
                  type="radio"
                  className="appearance-none"
                  checked={parseInt(response) === number}
                  value={number}
                  onChange={() => {}}
                />
              </div>
            </label>
          )
        )}
      </div>
    );
  } else if (question.type === "textarea") {
    inputElem = (
      <TextareaInput
        value={response}
        setValue={handleTextChange}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleSubmit();
          }
        }}
      />
    );
  }

  return (
    <div className="font-poppins text-white h-full shrink-0 flex pt-16 pb-16 sm:pt-24">
      <div className="flex w-full">
        <div className="flex items-center h-fit text-xl gap-2 pr-2">
          {index}
          <Image src="/arrow.svg" alt="" width={16} height={12} />
        </div>
        <div className="flex flex-1 flex-col h-fit text-xl gap-2 flex-wrap max-w-full">
          {question.question}
          {inputElem}
          <p className="text-sm text-red-500">{error}</p>
          <div className="flex gap-4 justify-end">
            {question.field === "bio" && (
              <GenerateBioButton onClick={generateBio} />
            )}
            <button
              className={cn(
                (!response || response.length === 0 || response < 0) &&
                  question.type !== "info"
                  ? "bg-gray-400"
                  : "bg-purple-500",
                "text-base py-2 px-4 pr-3 w-fit rounded-md self-end mt-5 flex items-center gap-2"
              )}
              disabled={
                (!response || response.length === 0 || response < 0) &&
                question.type !== "info"
              }
              onClick={handleSubmit}
            >
              {isLast ? (
                <>
                  Finish <Image src="/done.svg" alt="" width={16} height={12} />
                </>
              ) : (
                <>
                  Next <Image src="/arrow.svg" alt="" width={16} height={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenQuestion;
