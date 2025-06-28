import { useRoleContext } from "@/providers/roleProvider";
import { useUser } from "@auth0/nextjs-auth0";

export function usePermissions() {
  const { role } = useRoleContext();
  const { user } = useUser();

  const isAdmin = Number(role) === 1;
  const isSales = Number(role) === 2;
  const hasRole = role !== null && role !== undefined;

  return {
    // Role checks
    isAdmin,
    isSales,
    hasRole,
    role: Number(role) || 0,

    // Permission checks
    canManageUsers: isAdmin,
    canManageAllLeads: isAdmin,
    canManageAllCustomers: isAdmin,
    canManageAssignedLeads: isAdmin || isSales,
    canCreateLeads: isAdmin || isSales,
    canCreateCustomers: isAdmin || isSales,
    canViewDashboard: hasRole,
    canViewStaff: isAdmin,

    // User info
    userId: user?.email,
    userEmail: user?.email,
  };
}

export default usePermissions;
