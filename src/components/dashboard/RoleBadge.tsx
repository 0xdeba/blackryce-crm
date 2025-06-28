"use client";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

interface RoleBadgeProps {
  role?: string | number | null | undefined;
}

export default function RoleBadge({ role: propRole }: RoleBadgeProps) {
  const { user } = useUser();
  const [localRole, setLocalRole] = useState<
    string | number | null | undefined
  >(propRole);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use prop role if provided, otherwise use local state
  const currentRole = propRole !== undefined ? propRole : localRole;

  // Function to fetch role independently
  const fetchRole = async () => {
    if (!user?.sub) return;

    try {
      setIsRefreshing(true);
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sub: user.sub }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalRole(data.role);
      } else {
        setLocalRole("error");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setLocalRole("error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch role on mount if no prop role provided
  useEffect(() => {
    if (propRole === undefined && user?.sub) {
      fetchRole();
    }
  }, [user?.sub, propRole]);

  // Handle refresh button click
  const handleRefresh = () => {
    if (propRole !== undefined) {
      // If role is passed as prop, reload the page
      window.location.reload();
    } else {
      // If managing own state, just refetch
      fetchRole();
    }
  };
  // Show reload button if role is not loaded and error
  if (
    currentRole === undefined ||
    currentRole === null ||
    currentRole === "error" ||
    Number(currentRole) === 0
  ) {
    return (
      <button
        onClick={handleRefresh}
        className="mr-2 px-3 py-1 rounded-full text-sm font-medium shadow border border-red-300 bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 transition-colors duration-200"
        title="Reload"
        disabled={isRefreshing}
      >
        {isRefreshing ? "Loading..." : "Reload Role"}
      </button>
    );
  }

  // Show role badge for valid roles
  if (Number(currentRole) === 1 || Number(currentRole) === 2) {
    return (
      <span
        className={`mr-2 px-3 py-1 rounded-full text-sm font-medium shadow border transition-colors duration-200 ${
          Number(currentRole) === 1
            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
            : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
        }`}
      >
        {Number(currentRole) === 1 ? "Admin" : "Sales"}
      </span>
    );
  }

  return null;
}
