// components/OnboardingForm.tsx

"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";

interface FormData {
  firstName: string;
  lastName: string;
  prefName: string;
  studentStatus: "Undergraduate Student" | "Graduate Student" | "";
  school: string;
}

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();

  //HANDLE UNAUTHENTICATED USER HERE URGENT
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // console.log(user);
  // if (!user) {
  //   return redirect("/login");
  // }

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    prefName: "",
    studentStatus: "",
    school: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) {
      throw new Error("No user found");
    }

    console.log("Form Data Submitted:", formData);
    const { error: updateError } = await supabase
      .from("Users")
      .update({ ...formData, status: 1 })
      .eq("uid", uid);

    if (updateError) {
      console.error(updateError);
      return;
    }

    router.push("/survey");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClasses = "p-4 border border-gray-300 rounded-xl";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-8 rounded-xl bg-white/50 backdrop-blur-md border border-gray-300">
        <h1 className="text-2xl m-4 mt-0">Tell us about yourself!</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              className={inputClasses}
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className={inputClasses}
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className={inputClasses}
            type="text"
            placeholder="Preferred Name or nickname"
            name="prefName"
            value={formData.prefName}
            onChange={handleChange}
            required
          />
          <select
            name="studentStatus"
            value={formData.studentStatus}
            onChange={handleChange}
            className={cn(
              inputClasses,
              formData.studentStatus === "" && "text-[#9e9e9e]"
            )}
          >
            <option disabled value="">
              Select School Status
            </option>
            <option value="Undergraduate Student">Undergraduate Student</option>
            <option value="Graduate Student">Graduate Student</option>
          </select>
          <input
            className={inputClasses}
            type="text"
            placeholder="School"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
