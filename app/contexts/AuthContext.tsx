"use client";

import { User } from "@supabase/supabase-js";
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: (user: User | null) => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
