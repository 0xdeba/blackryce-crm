"use client";
import { useParams } from "next/navigation";
import Form from "../../form";
import { useEffect, useState } from "react";
import { Lead } from "@/models/databaseModel";

export default function EditLeadPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead>();
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/lead?id=${id}`);
      const data = await res.json();
      setLead(data.data[0]);
      console.log(data.data[0]);
    }
    if (id) fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit Lead {id}
        </h1>
        <Form edit={true} submitLabel="Save" data={lead} />
      </div>
    </div>
  );
}
