"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export function useRole() {
  const { user, isLoading } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.email) {
      fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
          window.sessionStorage.setItem("userRole", data.role);
        });
    }
  }, [user, isLoading]);

  return { role, isLoading };
}
