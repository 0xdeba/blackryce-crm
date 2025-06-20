"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

type RoleContextType = {
  role: string | null;
  isLoading: boolean;
};

const RoleContext = createContext<RoleContextType>({
  role: null,
  isLoading: true,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: userLoading } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && !userLoading) {
      setRole(null);
      setIsLoading(false);
      return;
    }
    if (user) {
      fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user, userLoading]);

  return (
    <RoleContext.Provider value={{ role, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  return useContext(RoleContext);
}
