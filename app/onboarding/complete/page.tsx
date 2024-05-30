import Link from "next/link";

export default function CompleteOnboardingPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex justify-center relative">
      <div className="flex w-[85%] sm:w-1/2 flex-col justify-center font-poppins mt-8 text-white text-center">
        <h1 className="text-2xl font-bold  m-4 mt-0 ">Thank you!</h1>
        <p>
          We’ll use this information to match you people with similar interests
          to you!
        </p>
        <p>You’ll get a text from us once we match you!</p>
        <Link
          href="/home"
          className="bg-[rgba(255,255,255,0.3)] rounded-md drop-shadow-lg py-1"
        >
          Continue to Home
        </Link>
      </div>
    </div>
  );
}
