"use client";
import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/common/requireAuth";
import { useRoleContext } from "@/providers/roleProvider";
import Link from "next/link";
import { Customer } from "@/models/databaseModel";
import EntityTable, {
  EntityTableColumn,
} from "@/components/crm_comp/EntityTable";

export default function CustomersPage() {
  const { role } = useRoleContext();
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    const res = await fetch("/api/customer", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCustomer((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete customer. Please try again.");
    }
  };

  const columns: EntityTableColumn<Customer>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];
  return (
    <RequireAuth>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
            Customers
          </h1>
          {Number(role) === 1 && (
            <Link
              href="/customers/add"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150"
            >
              + Add Customer
            </Link>
          )}
        </div>
        <EntityTable
          data={customers}
          loading={loading}
          columns={columns}
          role={{ role: Number(role) || 0 }}
          selectedRow={selectedCustomer}
          setSelectedRow={setSelectedCustomer}
          handleDelete={handleDelete}
          editHref={(row) => `customers/edit/${row.id}`}
          entityLabel="customer"
        />
      </div>
    </RequireAuth>
  );
}
