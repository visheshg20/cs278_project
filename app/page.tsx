import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 ">
          <div className="flex gap-2 justify-center items-center">
            <Link href="/home">
              <Image src="/flock.svg" alt="" width={30} height={30} />
            </Link>
            <p className="font-poppins font-semibold text-lg">Flock</p>
          </div>
          <div className="flex gap-3">
            <LinkButton href="/login">
              <p>Login</p>
            </LinkButton>
            <LinkButton href="/login">
              <p>Sign Up</p>
            </LinkButton>
          </div>
        </div>
      </nav> */}
      o
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3"></div>
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p></p>
      </footer>
    </div>
  );
}
