"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BarChart3,
  FileText,
  Users,
  Mail,
  LogOut,
} from "lucide-react";
import AlertModal from "./AlertModal";

type User = {
  id?: number;
  name: string;
  email: string;
  role?: string;
};

type SidebarMenuProps = {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  user?: User | null;
};

const SidebarMenu = ({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  user: controlledUser,
}: SidebarMenuProps) => {
  // --- Internal State ---
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalUser, setInternalUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const router = useRouter();
  const pathname = usePathname();

  // --- Determine State ---
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : setInternalIsOpen;
  const user = controlledUser ?? internalUser;

  // --- Admin Route Check ---
  // Only render this sidebar on admin pages
  const isAdminRoute = pathname?.startsWith("/admin");

  // --- Effects ---
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside (Mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 768) return;
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Fetch user if needed
  useEffect(() => {
    if (controlledUser || !isAdminRoute) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setInternalUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (isClient) fetchUser();

    const handler = () => fetchUser();
    window.addEventListener("auth:changed", handler);
    return () => window.removeEventListener("auth:changed", handler);
  }, [controlledUser, isClient, isAdminRoute]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign Out",
      onConfirm: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          if (!isControlled) {
            setInternalUser(null);
            setInternalIsOpen(false);
          }
          window.dispatchEvent(new Event("auth:changed"));

          router.replace("/");
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    });
  };

  const closeAlert = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!isClient || !isAdminRoute) return null;

  return (
    <>
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onConfirm={alertState.onConfirm}
        confirmText={alertState.confirmText}
      />

      {/* Mobile Toggle Button (Visible only when sidebar is closed on mobile) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen && setIsOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-neutral-900 border border-white/10 text-white md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className={`
            bg-neutral-900/80 backdrop-blur-xl text-white transition-all duration-300 flex flex-col border-r border-white/10 h-screen
            fixed md:sticky top-0 z-40
            ${
              isOpen
                ? "translate-x-0 w-[85%] max-w-[320px] md:w-64 md:max-w-none"
                : "-translate-x-full md:translate-x-0 md:w-20"
            }
          `}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${
              !isOpen && "md:justify-center w-full"
            }`}
          >
            <div className="bg-linear-to-br from-pink-500 to-orange-500 px-3 py-1 rounded-lg text-white font-bold shadow-lg shadow-orange-500/20">
              F
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <div className="font-bold text-lg truncate">FixIt Hub</div>
                <div className="text-sm text-white/80 truncate">
                  Admin Dashboard
                </div>
              </div>
            )}
          </div>
          {isOpen && setIsOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded transition md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
              isActive("/admin/dashboard")
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <BarChart3 size={24} className="shrink-0" />
            {isOpen && <span className="text-base font-medium">Dashboard</span>}
          </Link>
          <Link
            href="/admin/manage-report"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
              isActive("/admin/manage-report")
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <FileText size={24} className="shrink-0" />
            {isOpen && (
              <span className="text-base font-medium">Manage Report</span>
            )}
          </Link>
          <div className="px-3 py-2 text-sm text-white/80 font-semibold mt-6">
            {isOpen ? "MANAGE" : ""}
          </div>
          <Link
            href="/admin/manage-admin"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
              isActive("/admin/manage-admin")
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Users size={24} className="shrink-0" />
            {isOpen && <span className="text-base">Manage Admin</span>}
          </Link>
          <Link
            href="/admin/contact"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
              isActive("/admin/contact")
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Mail size={24} className="shrink-0" />
            {isOpen && <span className="text-base">Contact</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {isOpen && user && (
            <div className="text-base text-white/80 truncate">
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-white/70 text-sm">{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200 group ${
              isOpen
                ? "bg-red-500/10 border-red-500/20 text-red-100 hover:bg-red-500/20"
                : "text-white/60 hover:text-white hover:bg-white/10 border-transparent justify-center"
            }`}
          >
            <LogOut
              size={24}
              className={`${isOpen ? "text-red-400" : ""} shrink-0`}
            />
            {isOpen && (
              <span className="text-base font-medium text-red-200 group-hover:text-red-100">
                Log Out
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
