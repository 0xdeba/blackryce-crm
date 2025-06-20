"use client";
import { useUser } from "@auth0/nextjs-auth0";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-700">
            You must be logged in to view this page.
          </p>
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
