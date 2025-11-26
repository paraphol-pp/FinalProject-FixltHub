"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  // ดึง user จาก /api/auth/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
      setIsClient(true);
    };
    fetchUser();

    // ฟัง event auth:changed เพื่ออัพเดต user
    const handler = () => fetchUser();
    window.addEventListener("auth:changed", handler);
    return () => window.removeEventListener("auth:changed", handler);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Report", href: "/report" },
    { label: "Insights", href: "/#insights" },
    { label: "Contact", href: "/#contact" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isClient) return null;

  return (
    <>
      {/* Hamburger Button (ขวาบน) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800 transition md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (สไลด์จากขวา) */}
      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-neutral-950 border-l border-white/10 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col`}
      >
        {/* User Profile Section */}
        {user && (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer (Log Out Button) */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
                setUser(null);
                setIsOpen(false);
                window.dispatchEvent(new Event("auth:changed"));
              } catch (err) {
                console.error("Logout error:", err);
              }
            }}
            className="w-full px-4 py-2 rounded-lg bg-red-900/30 border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-900/50 transition"
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
