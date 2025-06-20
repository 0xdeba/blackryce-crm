"use client";
import { useUser } from "@auth0/nextjs-auth0";
import RequireAuth from "@/components/common/requireAuth";
import { useRoleContext } from "@/providers/roleProvider";

export default function Dashboard() {
  const { user } = useUser();
  const { role } = useRoleContext();
  // const { role, isLoading } = useRole();

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
  //         <p className="text-gray-700">
  //           You must be logged in to view this page.
  //         </p>
  //         <a href="/auth/login" className="text-blue-500 hover:underline">
  //           Login
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <RequireAuth>
      <main className="min-h-screen">
        <div className="  p-8 w-full h-screen">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div>Your role is: {role}</div>
          <p className="text-gray-700">Welcome back, {user?.name}!</p>
        </div>
      </main>
    </RequireAuth>
  );
}
