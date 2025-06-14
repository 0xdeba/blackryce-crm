// This file is used for conditionally rendering the sidebar based on the current path.
"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <div className="h-screen flex">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
