"use client";
import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/common/requireAuth";
import { useRoleContext } from "@/providers/roleProvider";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import EntityTable, {
  EntityTableColumn,
} from "@/components/crm_comp/EntityTable";
import { Lead } from "@/models/databaseModel";

interface LeadWithNames extends Lead {
  status_name: string;
  assigned_to_name: string;
}

const columns: EntityTableColumn<LeadWithNames>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "status_name", label: "Status" },
  { key: "assigned_to_name", label: "Assigned To" },
];

export default function LeadsPage() {
  const { role } = useRoleContext();
  const { user } = useUser();
  const [leads, setLeads] = useState<LeadWithNames[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadWithNames | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.email) return;

      setLoading(true);
      const url = `/api/lead/getdata?email=${encodeURIComponent(user.email)}`;
      const res = await fetch(url);
      const data = await res.json();
      setLeads(data.data);
      setLoading(false);
    }
    fetchData();
  }, [user?.email]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const res = await fetch("/api/lead", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete lead. Please try again.");
    }
  };

  // Permission functions for role-based access
  const canEditLead = () => {
    const userRole = Number(role);
    if (userRole === 1) return true; // Admin can edit all leads
    if (userRole === 2) {
      // Sales user can edit assigned leads
      return true;
    }
    return false;
  };

  const canDeleteLead = () => {
    // Only admin can delete leads
    return Number(role) === 1;
  };

  return (
    <RequireAuth>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
            Leads
          </h1>
          {Number(role) === 1 && (
            <Link
              href="/leads/add"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150"
            >
              + Add Lead
            </Link>
          )}
        </div>
        <EntityTable
          data={leads}
          loading={loading}
          columns={columns}
          role={{ role: Number(role) || 0 }}
          selectedRow={selectedLead}
          setSelectedRow={setSelectedLead}
          handleDelete={handleDelete}
          editHref={(row) => `leads/edit/${row.id}`}
          entityLabel="lead"
          canEdit={canEditLead}
          canDelete={canDeleteLead}
        />
      </div>
    </RequireAuth>
  );
}
