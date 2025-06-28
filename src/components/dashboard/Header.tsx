import { useUser } from "@auth0/nextjs-auth0";
import { useRoleContext } from "@/providers/roleProvider";
import Image from "next/image";
import RoleBadge from "./RoleBadge";

export default function Header() {
  const { user } = useUser();
  const { role } = useRoleContext();
  console.log(user?.name);
  return (
    <header className="w-full bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-md border-b border-blue-200 px-4 md:px-8 py-4 mb- shadow-lg sticky top-0 z-30">
      <div className="flex items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">
            CRM Dashboard
          </span>
          <span className="hidden md:inline-block ml-2 px-2 py-1 rounded bg-blue-200 text-blue-800 text-xs font-semibold">
            v1.0
          </span>
        </div>
        <div className="flex-1" />
        {user && (
          <div className="relative group flex items-center space-x-2 cursor-pointer flex-shrink-0">
            <RoleBadge role={role} />
            {user.picture ? (
              <Image
                src={user.picture}
                alt={user.name || "User"}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full border-2 border-blue-400 shadow object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold border-2 border-blue-400 shadow">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
            )}
            {/* Dropdown with name/email */}
            <div className="absolute right-0 top-14 bg-white border border-blue-100 rounded-xl shadow-md py-2 px-4 min-w-[200px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-30">
              <div className="mb-2 pb-2 border-b border-blue-50">
                <div className="font-bold text-blue-900 text-base leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-blue-500">{user.email}</div>
              </div>
              <div className="text-gray-700 text-sm py-2 hover:bg-blue-50 rounded-lg px-2 cursor-pointer transition">
                Profile (soon)
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
