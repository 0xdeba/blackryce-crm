"use client";
import { useParams } from "next/navigation";
import Form from "../../form";
import { useEffect, useState } from "react";
import { Customer } from "@/models/databaseModel";

export default function AddCustomerPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer>();
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/customer?id=${id}`);
      const data = await res.json();
      setCustomer(data.data[0]);
    }
    if (id) fetchData();
  }, []);
  console.log(customer);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit Customer {id}
        </h1>
        <Form edit={true} submitLabel="Edit Customer" initialData={customer} />
      </div>
    </div>
  );
}
