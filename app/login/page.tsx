import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/home");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const email_domain = email.split("@").pop();
    if (email_domain !== "stanford.edu") {
      return redirect("/login?message=Only stanford.edu accounts are allowed");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return redirect("/login?message=Email is invalid");
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (authError || !authData.user) {
      console.error(authError);
      return redirect("/login?message=Could not authenticate user");
    }

    const { error: userCreationError } = await supabase.from("Users").insert({
      uid: authData.user.id,
      email: email,
      firstName: null,
      lastName: null,
      prefName: null,
      studentStatus: null,
      groups: null,
      status: 0,
      school: "Stanford University",
    });

    if (userCreationError) {
      console.error(userCreationError);
      return redirect("/login?message=Could not create new user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <>
      <div className="w-full pl-6 pt-4">
        <Link
          href="/"
          className=" py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
      </div>
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signIn}
            className="text-[#8A6697] bg-white w-full text-center flex items-center justify-center px-4 py-2 text-md rounded-xl no-underline hover:shadow-[0_0px_10px_rgb(255,0,255)] transition duration-250"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className="border border-foreground/20 rounded-xl px-4 py-2 text-foreground mb-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
