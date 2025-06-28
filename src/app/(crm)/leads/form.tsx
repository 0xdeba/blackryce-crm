"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/models/databaseModel";
import { useRoleContext } from "@/providers/roleProvider";

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  status_id: string;
  assigned_to: string;
}

export default function LeadForm({
  submitLabel = "Add Lead",
  edit = false,
  data,
}: {
  submitLabel?: string;
  edit?: boolean;
  data?: Lead;
}) {
  const { role } = useRoleContext();
  const [formData, setFormData] = useState<LeadFormData>({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    status_id: data?.status_id ? String(data.status_id) : "",
    assigned_to: data?.assigned_to ? String(data.assigned_to) : "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const router = useRouter();

  // Check if current user is admin
  const isAdmin = Number(role) === 1;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // For sales users editing leads, assigned_to is not required (will use existing value)
    const requireAssignedTo = isAdmin || !edit;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.status_id ||
      (requireAssignedTo && !formData.assigned_to)
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      let res;
      if (edit && data?.id) {
        // For sales users editing leads, preserve the original assigned_to value
        const assignedToValue = isAdmin
          ? Number(formData.assigned_to)
          : data.assigned_to;

        res = await fetch("/api/lead", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.id,
            ...formData,
            status_id: Number(formData.status_id),
            assigned_to: assignedToValue,
          }),
        });
      } else {
        res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status_id: Number(formData.status_id),
            assigned_to: Number(formData.assigned_to),
          }),
        });
      }
      if (res.ok) {
        const respData = await res.json();
        setSuccess(
          edit
            ? `Lead updated (ID: ${respData.leadID || data?.id})`
            : `Lead added (ID: ${respData.leadID})`
        );
        setTimeout(() => {
          router.push("/leads");
        }, 1000);
      } else if (res.status === 409) {
        setError("Email already exists");
      } else {
        const respData = await res.json();
        setError(respData.error || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong, check console");
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        setUsers(
          (data.roles || []).map((user: { id: number; name: string }) => ({
            id: user.id,
            name: user.name,
          }))
        );
      } catch {
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (edit && data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        status_id: data.status_id ? String(data.status_id) : "",
        assigned_to: data.assigned_to ? String(data.assigned_to) : "",
      });
    }
  }, [edit, data]);

  // console.log(formData);
  // console.log(data);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="name"
        >
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="address"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="status_id"
        >
          Status<span className="text-red-500">*</span>
        </label>
        <select
          id="status_id"
          name="status_id"
          value={formData.status_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select status</option>
          <option value="1">new</option>
          <option value="2">contacted</option>
          <option value="3">converted</option>
          <option value="4">lost</option>
        </select>
      </div>
      {/* Only show assigned_to field for admins or when creating new leads */}
      {(isAdmin || !edit) && (
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="assigned_to"
          >
            Assigned To (User ID)<span className="text-red-500">*</span>
          </label>
          <select
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required={isAdmin || !edit}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Show read-only assigned info for sales users editing leads */}
      {!isAdmin && edit && data?.assigned_to && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600">
            {users.find((user) => user.id === data.assigned_to)?.name ||
              `User ID: ${data.assigned_to}`}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Only administrators can change lead assignments
          </p>
        </div>
      )}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition-all duration-150 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : null}
        {loading ? "Loading..." : submitLabel}
      </button>
      <Link
        href="/leads"
        className="block mt-2 text-center text-blue-600 hover:underline text-sm"
      >
        Back to Leads
      </Link>
    </form>
  );
}
