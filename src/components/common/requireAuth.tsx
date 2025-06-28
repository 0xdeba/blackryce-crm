"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useRoleContext } from "@/providers/roleProvider";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const { role, isLoading: roleLoading } = useRoleContext();

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-700">
            You must be logged in to view this page.
          </p>
          <a href="/api/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user has no role assigned
  if (user && !role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Account Setup Required
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created but no role has been assigned yet.
                Please contact your system administrator to assign you a role
                and gain access to the CRM system.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Your Email:</strong> {user.email}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p>Contact your administrator to:</p>
                <ul className="mt-2 text-left list-disc list-inside space-y-1">
                  <li>Assign you an appropriate role</li>
                  <li>Grant access to CRM features</li>
                  <li>Complete your account setup</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <a
                  href="/auth/logout"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
