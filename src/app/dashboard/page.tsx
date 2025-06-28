"use client";
import RequireAuth from "@/components/common/requireAuth";
import Header from "@/components/dashboard/Header";
import { useEffect, useState } from "react";
import { useRoleContext } from "@/providers/roleProvider";
import { Lead, Customer } from "@/models/databaseModel";
import Link from "next/link";

interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  totalUsers: number;
  conversionRate: number;
}

export default function Dashboard() {
  const { role } = useRoleContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalCustomers: 0,
    totalUsers: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch leads, customers, and users in parallel
        const [leadsResponse, customersResponse, usersResponse] =
          await Promise.all([
            fetch("/api/lead/getdata"),
            fetch("/api/customer"),
            fetch("/api/auth/user"),
          ]);

        if (leadsResponse.ok && customersResponse.ok) {
          const leadsData = await leadsResponse.json();
          const customersData = await customersResponse.json();
          const leads = leadsData.data || [];
          const customers = customersData.data || [];

          // Calculate stats
          const totalLeads = leads.length;
          const totalCustomers = customers.length;
          const conversionRate =
            totalLeads > 0
              ? Math.round((totalCustomers / totalLeads) * 100)
              : 0;

          let totalUsers = 0;
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            totalUsers = (usersData.roles || []).length;
          }

          setStats({
            totalLeads,
            totalCustomers,
            totalUsers,
            conversionRate,
          });

          // Set recent data (last 5 items)
          setRecentLeads(leads.slice(-5).reverse());
          setRecentCustomers(customers.slice(-5).reverse());
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Error loading dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <RequireAuth>
        <main className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </RequireAuth>
    );
  }
  return (
    <RequireAuth>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl shadow-sm p-6 flex flex-col items-center bg-blue-100 text-blue-700">
              <div className="text-3xl font-bold mb-2">{stats.totalLeads}</div>
              <div className="text-lg font-medium">Total Leads</div>
            </div>

            <div className="rounded-xl shadow-sm p-6 flex flex-col items-center bg-green-100 text-green-700">
              <div className="text-3xl font-bold mb-2">
                {stats.totalCustomers}
              </div>
              <div className="text-lg font-medium">Customers</div>
            </div>

            {Number(role) === 1 && (
              <div className="rounded-xl shadow-sm p-6 flex flex-col items-center bg-purple-100 text-purple-700">
                <div className="text-3xl font-bold mb-2">
                  {stats.totalUsers}
                </div>
                <div className="text-lg font-medium">Team Members</div>
              </div>
            )}

            <div className="rounded-xl shadow-sm p-6 flex flex-col items-center bg-yellow-100 text-yellow-700">
              <div className="text-3xl font-bold mb-2">
                {stats.conversionRate}%
              </div>
              <div className="text-lg font-medium">Conversion Rate</div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-lg font-semibold mb-3">Recent Leads</div>
              {recentLeads.length > 0 ? (
                <ul className="space-y-2">
                  {recentLeads.map((lead) => (
                    <li
                      key={lead.id}
                      className="text-gray-800 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="font-medium">{lead.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString()
                          : "No date"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No leads yet</p>
              )}
            </div>

            {/* Recent Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-lg font-semibold mb-3">Recent Customers</div>
              {recentCustomers.length > 0 ? (
                <ul className="space-y-2">
                  {recentCustomers.map((customer) => (
                    <li
                      key={customer.id}
                      className="text-gray-800 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString()
                          : "No date"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No customers yet</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-lg font-semibold mb-4">Quick Actions</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                href="/leads/add"
                className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span className="text-blue-600 font-medium">
                  + Add New Lead
                </span>
              </Link>

              <Link
                href="/customers/add"
                className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <span className="text-green-600 font-medium">
                  + Add Customer
                </span>
              </Link>

              {Number(role) === 1 && (
                <Link
                  href="/staff"
                  className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <span className="text-purple-600 font-medium">
                    Manage Staff
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
