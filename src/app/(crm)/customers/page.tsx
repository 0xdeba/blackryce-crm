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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

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
              ) : !customers || customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-red-500">
                    Error fetching customer
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
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all"
                      >
                        View
                      </button>
                      {selectedCustomer && (
                        <ViewDetails
                          close={() => setSelectedCustomer(null)}
                          customer={selectedCustomer}
                        />
                      )}
                      {Number(role.role) === 1 && (
                        <>
                          <Link
                            href={`customers/edit/${customer.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all"
                          >
                            Edit
                          </Link>
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

function ViewDetails({
  close,
  customer,
}: {
  close: () => void;
  customer: Customer;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl">
          <div className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <svg
              className="w-7 h-7 text-blue-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
            </svg>
            {customer.name}
          </div>
          <button
            onClick={close}
            className="text-white hover:text-blue-200 text-2xl font-bold px-2"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="border-b border-gray-100" />
        {/* Details */}
        <div className="px-8 py-8 flex flex-col gap-6 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <span className="w-20 text-xs text-gray-500 font-semibold">
              Email
            </span>
            <span className="text-base text-gray-800 font-medium">
              {customer.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-xs text-gray-500 font-semibold">
              Phone
            </span>
            <span className="text-base text-gray-800 font-medium">
              {customer.phone}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-xs text-gray-500 font-semibold">
              Address
            </span>
            <span className="text-base text-gray-800 font-medium">
              {customer.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
