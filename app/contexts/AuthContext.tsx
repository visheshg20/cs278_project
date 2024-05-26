"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useState, useEffect } from "react";

// Create the context
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

// Create a provider component
export const AuthProvider = async ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<User | null>(null);

  const supabase = createClient();

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
    const getUserObject = async () => {
      const { data: sbUserObject } = await supabase
        .from("Users")
        .select()
        .eq("uid", session?.id)
        .single();
      console.log(sbUserObject);
      setUser(sbUserObject);
    };
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
