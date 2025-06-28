import Form from "../form";
import RequireAuth from "@/components/common/requireAuth";

export default function AddCustomerPage() {
  return (
    <RequireAuth>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add Customer
          </h1>
          <Form edit={false} submitLabel="Add Customer" />
        </div>
      </div>
    </RequireAuth>
  );
}
