"use client";

import { SessionProviderProps, SessionProvider } from "next-auth/react";

export const AuthProvider = (props: SessionProviderProps) => {
  return <SessionProvider {...props} />;
};
