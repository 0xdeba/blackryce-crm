"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdGroup } from "react-icons/md";

const mainLinks = [
  { href: "/dashboard", icon: FaHome, label: "Dashboard" },
  { href: "/customers", icon: MdGroup, label: "Customers" },
];

export default function Sidebar() {
  const user = useUser();
  const currentPath = usePathname();
  if (!user) {
    return null;
  }
  return (
    <aside className="h-full p-0 flex flex-col justify-between bg-transparent">
      <div className="w-64 h-full bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col justify-between rounded-none">
        <div>
          <div className="flex items-center justify-between p-6 bg-gray-900 border-b border-gray-800">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              CRM
            </h1>
          </div>
          <nav className="mt-8">
            <ul className="px-2">
              {mainLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  <li
                    className={`relative p-3 mb-2 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-200 text-white group hover:bg-gray-800/80 ${
                      currentPath === link.href
                        ? "bg-gray-800/80 font-bold shadow-md"
                        : ""
                    }`}
                  >
                    {currentPath === link.href && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-300" />
                    )}
                    <link.icon
                      className={`h-6 w-6 ${
                        currentPath === link.href
                          ? "text-white"
                          : "text-blue-300 group-hover:text-white"
                      } transition-colors`}
                    />
                    <span className="text-base">{link.label}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <nav className="my-6">
            <ul className="px-2">
              <li>
                <a
                  href="/auth/logout"
                  className="relative p-3 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-200 text-gray-300 group hover:bg-gray-800/80 hover:text-red-500"
                >
                  <FaSignOutAlt className="h-6 w-6 group-hover:text-red-500 transition-colors" />
                  <span className="text-base">Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
