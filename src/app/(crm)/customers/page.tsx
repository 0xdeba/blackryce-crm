"use client";
import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/common/requireAuth";
import { useRoleContext } from "@/providers/roleProvider";
import Link from "next/link";
import { Customer } from "@/models/databaseModel";

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-lg mr-3">
      {initials}
    </div>
  );
}

export default function CustomersPage() {
  const role = useRoleContext();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomer] = useState<Customer[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/customer");
      const data = await res.json();
      setCustomer(data.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <RequireAuth>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
            Customers
          </h1>
          {Number(role.role) === 1 && (
            <Link
              href="/customers/add"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150"
            >
              + Add Customer
            </Link>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-blue-50 transition-all"
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <CustomerAvatar name={customer.name} />
                      <span className="font-medium text-gray-900">
                        {customer.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {customer.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all">
                        View
                      </button>
                      {Number(role.role) === 1 && (
                        <>
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all">
                            Edit
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all">
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  );
}
