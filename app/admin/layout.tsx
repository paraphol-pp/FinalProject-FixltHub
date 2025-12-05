"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenu from "../components/SidebarMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role?: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed to prevent popup on mobile
  const [isClient, setIsClient] = useState(false);

  // Auth Check
  useEffect(() => {
    setIsClient(true);
    // On desktop, default to open
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user);
        if (data.user?.role !== "admin") {
          router.replace("/");
        }
      } catch (err) {
        router.replace("/");
      }
    };

    fetchMe();
  }, [router]);

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-neutral-950">
      <SidebarMenu
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
