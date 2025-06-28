"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useRoleContext } from "@/providers/roleProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/common/requireAuth";
import { User } from "@/models/databaseModel";

export default function StaffPage() {
  const { user, isLoading } = useUser();
  const { role } = useRoleContext();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !user) {
      router.push("/api/auth/login");
      return;
    }

    // Redirect if not admin (role 1)
    if (role !== undefined && Number(role) !== 1) {
      router.push("/dashboard");
      return;
    }
  }, [user, role, isLoading, router]);

  // Fetch users when component mounts and user is admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (Number(role) === 1) {
        try {
          setLoadingUsers(true);
          const response = await fetch("/api/auth/user");
          const data = await response.json();

          if (response.ok) {
            setUsers(data.roles || []);
          } else {
            setError(data.error || "Failed to fetch users");
          }
        } catch (err) {
          setError("Failed to fetch users");
          console.error("Error fetching users:", err);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [role]);

  // Function to update user role
  const updateUserRole = async (userId: number, newRoleId: number | null) => {
    try {
      setUpdatingRole(true);
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id: newRoleId }),
      });

      if (response.ok) {
        // Update the local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role_id: newRoleId } : user
          )
        );
        setEditingUser(null);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update user role");
      }
    } catch (err) {
      setError("Failed to update user role");
      console.error("Error updating user role:", err);
    } finally {
      setUpdatingRole(false);
    }
  };

  console.log(users);
  // Show loading while checking authentication and role
  if (isLoading || role === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show access denied if not admin
  if (Number(role) !== 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">Manage sales staff and admin users</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loadingUsers ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Display actual users from API */}
              {users.map((staffUser) => (
                <div
                  key={staffUser.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        staffUser.role_id === 1
                          ? "bg-purple-500"
                          : staffUser.role_id === 2
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {staffUser.name
                        ? staffUser.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {staffUser.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-600">{staffUser.email}</p>
                      <p className="text-xs text-gray-500">
                        {staffUser.role_id === 1
                          ? "Administrator"
                          : staffUser.role_id === 2
                          ? "Sales Representative"
                          : "No Role Assigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staffUser.role_id === 1
                          ? "bg-purple-100 text-purple-800"
                          : staffUser.role_id === 2
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {staffUser.role_id === 1
                        ? "Admin"
                        : staffUser.role_id === 2
                        ? "Sales"
                        : "No Role"}
                    </span>
                    <button
                      onClick={() => setEditingUser(staffUser)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Staff
            </h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-600 mt-1">All users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Administrators
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role_id === 1).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Admin users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sales Team
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.role_id === 2).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Sales representatives</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Role
            </h3>
            <p className="text-3xl font-bold text-gray-600">
              {
                users.filter(
                  (u) => u.role_id === null || u.role_id === undefined
                ).length
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Unassigned users</p>
          </div>
        </div>

        {/* Edit Role Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit User Role
              </h3>

              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      editingUser.role_id === 1
                        ? "bg-purple-500"
                        : editingUser.role_id === 2
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {editingUser.name
                      ? editingUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {editingUser.name}
                    </h4>
                    <p className="text-sm text-gray-600">{editingUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="1"
                      checked={editingUser.role_id === 1}
                      onChange={() =>
                        setEditingUser({ ...editingUser, role_id: 1 })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Administrator</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="2"
                      checked={editingUser.role_id === 2}
                      onChange={() =>
                        setEditingUser({ ...editingUser, role_id: 2 })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Sales Representative</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value=""
                      checked={editingUser.role_id === null}
                      onChange={() =>
                        setEditingUser({ ...editingUser, role_id: null })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">No Role</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={updatingRole}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateUserRole(editingUser.id, editingUser.role_id)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={updatingRole}
                >
                  {updatingRole ? "Updating..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
