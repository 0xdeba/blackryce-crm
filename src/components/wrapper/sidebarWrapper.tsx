"use client";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import Sidebar from "../common/sidebar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    user === null ||
    user === undefined;

  return (
    <div className="h-screen flex overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
