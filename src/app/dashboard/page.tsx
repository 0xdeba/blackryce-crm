import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Welcome to the Dashboard
        </h1>
        <p className="mb-6 text-gray-600">
          Here you can manage your customers, sales, and support efficiently.
        </p>
        <Link href="/">
          <button className="w-full py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
            Log out
          </button>
        </Link>
      </div>
    </main>
  );
}
