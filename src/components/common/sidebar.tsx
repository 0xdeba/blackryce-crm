"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaClipboardList,
  FaCog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const mainLinks = [
  { href: "/dashboard", icon: FaHome, label: "DASHBOARD" },
  { href: "/exams", icon: FaClipboardList, label: "EXAMS" },
  // { href: "/results", icon: FaChartBar, label: "RESULTS" },
  { href: "/account", icon: FaUser, label: "MY ACCOUNT" },
];

const endLinks = [
  { href: "/settings", icon: FaCog, label: "Settings" },
  { href: "/", icon: FaSignOutAlt, label: "Logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <aside className="h-full p-2 flex flex-col justify-between">
      <div className="w-56 h-full bg-white rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between p-4 border-gray-400 bg-[#f0bc62b9] rounded-t-lg">
            <h1 className="text-2xl font-bold text-black">ExamSphere</h1>
          </div>
          <nav className="mt-4">
            <ul className="px-2">
              {mainLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  <li
                    className={`p-3 hover:bg-indigo-50 flex items-center justify-start cursor-pointer rounded-lg transition-colors duration-200 ${
                      currentPath === link.href ? "bg-indigo-200" : ""
                    }`}
                  >
                    <link.icon className="h-6 w-6 mr-3 text-amber-900" />
                    <span
                      className={`text-sm ${
                        currentPath === link.href ? "font-bold" : ""
                      }`}
                    >
                      {link.label}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <nav className="my-4">
            <ul className="px-2">
              {endLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  <li
                    className={`p-3 hover:bg-indigo-100 flex items-center justify-start cursor-pointer rounded-lg transition-colors duration-200 ${
                      currentPath === link.href ? "bg-indigo-200" : ""
                    }`}
                  >
                    <link.icon className="h-6 w-6 mr-3 text-amber-900" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
