"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Briefcase, GraduationCap, User, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Authenticating...</div>;

  const navItems = [
    { name: "Projects", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Experience", path: "/admin/experience", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Education", path: "/admin/education", icon: <GraduationCap className="w-5 h-5" /> },
    { name: "About", path: "/admin/about", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 flex flex-col bg-neutral-900/30">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-tighter">Command Center</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path ? "bg-accent-primary/20 text-accent-primary" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}