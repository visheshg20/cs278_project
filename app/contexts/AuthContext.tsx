"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  session: User | null;
  setSession: (session: User | null) => void;
}>({
  user: null,
  setUser: (user: User | null) => {},
  session: null,
  setSession: (session: User | null) => {},
});

export const AuthProvider = ({
  children,
  accessToken,
}: {
  children: JSX.Element;
  accessToken: string | null;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<User | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const getUserObject = async () => {
    const { data: sbUserObject } = await supabase
      .from("Users")
      .select()
      .eq("uid", session?.id)
      .single();
    setUser(sbUserObject);
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: sbUser },
      } = await supabase.auth.getUser();
      setSession(sbUser);
    };

    getUser();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === "SIGNED_IN" && currentSession) {
          setSession(currentSession.user);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
        }
        if (currentSession?.access_token && !session) {
          setSession(currentSession?.user);
        }
      }
    );
  });

  useEffect(() => {
    if (session) getUserObject();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        session,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
