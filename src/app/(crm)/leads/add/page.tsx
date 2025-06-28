"use client";
import LeadForm from "../form";
import RequireAuth from "@/components/common/requireAuth";
import { useRoleContext } from "@/providers/roleProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddLeadPage() {
  const { role } = useRoleContext();
  const router = useRouter();

  useEffect(() => {
    // Only admin (role 1) can add leads
    if (role !== undefined && Number(role) !== 1) {
      router.push("/leads");
    }
  }, [role, router]);

  // Show loading while checking role
  if (role === undefined) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </RequireAuth>
    );
  }

  // Show access denied if not admin
  if (Number(role) !== 1) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You do not have permission to add leads.
            </p>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add Lead
          </h1>
          <LeadForm submitLabel="Add Lead" />
        </div>
      </div>
    </RequireAuth>
  );
}
