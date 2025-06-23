"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Customer } from "@/models/databaseModel";

export default function Form({
  edit = false,
  initialData = { id: 0, name: "", email: "", phone: "", address: "" },
  submitLabel = "Add Customer",
  data,
}: {
  edit?: boolean;
  initialData?: Customer;
  submitLabel?: string;
  data?: Customer;
}) {
  const [formData, setFormData] = useState<Omit<Customer, "id">>(
    data || initialData
  );
  const [error, setErrorState] = useState("");
  const [success, setSuccessState] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only update if data/initialData is defined and different from formData
    const newData = data || initialData;
    if (
      newData &&
      (formData.name !== newData.name ||
        formData.email !== newData.email ||
        formData.phone !== newData.phone ||
        formData.address !== newData.address)
    ) {
      setFormData({
        name: newData.name,
        email: newData.email,
        phone: newData.phone,
        address: newData.address,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState("");
    setSuccessState("");
    setLoading(true);
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      setErrorState("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      let res;
      if (edit) {
        res = await fetch(`/api/customer`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(`/api/customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      if (res.ok) {
        const data = await res.json();
        setSuccessState(
          `${data.message}${data.customerID ? ` (ID: ${data.customerID})` : ""}`
        );
        setTimeout(() => {
          router.push("/customers");
        }, 1000);
      } else if (res.status === 409) {
        setErrorState("Email already exists");
      } else if (res.status === 500) {
        setErrorState("Failed Connecting to Database");
      } else {
        setErrorState("Something went wrong");
      }
    } catch (err) {
      setErrorState("Something went wrong, check console");
      console.log(err);
    }
    setLoading(false);
  };

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
        href="/customers"
        className="block mt-2 text-center text-blue-600 hover:underline text-sm"
      >
        Back to Customers
      </Link>
    </form>
  );
}
