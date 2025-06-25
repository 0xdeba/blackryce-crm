"use client";
import RequireAuth from "@/components/common/requireAuth";
import Header from "@/components/dashboard/Header";

const summaryStats = [
  { label: "New Leads", value: 12, color: "bg-blue-100 text-blue-700" },
  { label: "Contacted", value: 7, color: "bg-yellow-100 text-yellow-700" },
  { label: "Converted", value: 5, color: "bg-green-100 text-green-700" },
  { label: "Lost", value: 3, color: "bg-red-100 text-red-700" },
];

const topCustomers = [
  "Acme Corp",
  "Globex Inc.",
  "Soylent Corp.",
  "Initech",
  "Umbrella Corp.",
];

const activityLogs = [
  {
    type: "Call",
    lead: "John Doe",
    user: "Alice Smith",
    time: "Today 10:15 AM",
  },
  {
    type: "Meeting",
    lead: "Jane Smith",
    user: "Bob Johnson",
    time: "Today 9:00 AM",
  },
  {
    type: "Email",
    lead: "Michael Brown",
    user: "Alice Smith",
    time: "Yesterday",
  },
  {
    type: "Call",
    lead: "Sarah Lee",
    user: "Bob Johnson",
    time: "Yesterday",
  },
  {
    type: "Meeting",
    lead: "Tom Clark",
    user: "Alice Smith",
    time: "2 days ago",
  },
];

export default function Dashboard() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryStats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl shadow-sm p-6 flex flex-col items-center ${stat.color}`}
              >
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Conversion Rate */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-600 mb-2">35%</div>
              <div className="text-gray-700 font-medium">Conversion Rate</div>
            </div>
            {/* Top Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-lg font-semibold mb-3">Top 5 Customers</div>
              <ul className="space-y-2">
                {topCustomers.map((name) => (
                  <li key={name} className="text-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-lg font-semibold mb-3">Recent Activity</div>
            <ul className="divide-y divide-gray-200">
              {activityLogs.map((log, idx) => (
                <li
                  key={idx}
                  className="py-3 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        log.type === "Call"
                          ? "bg-blue-100 text-blue-700"
                          : log.type === "Meeting"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="font-medium text-gray-900">
                      {log.lead}
                    </span>
                    <span className="text-gray-500">by {log.user}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1 md:mt-0 md:text-right">
                    {log.time}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
