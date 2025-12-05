"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User2, LogOut, Menu, X } from "lucide-react";
import AlertModal from "./AlertModal";

type NavId = "home" | "features" | "report" | "update" | "contact";

type NavItem = {
  label: string;
  id: NavId;
};

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

const navItems: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "Features", id: "features" },
  { label: "Report", id: "report" },
  { label: "Update", id: "update" },
  { label: "Contact", id: "contact" },
];

// 👇 path ที่ไม่อยากให้มี Navbar
const HIDDEN_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/dashboard",
  "/admin/dashboard",
  "/admin/manage-report",
  "/admin/manage-admin",
  "/admin/contact",
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<NavId>("home");
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state
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

  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isReportPath = pathname.startsWith("/report");

  // Fetch user logic
  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setUser(null);
      }
      setIsClient(true);
    };

    fetchAndSetUser();

    const handleAuthChange = () => {
      fetchAndSetUser();
    };

    window.addEventListener("auth:changed", handleAuthChange);
    return () => {
      window.removeEventListener("auth:changed", handleAuthChange);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll spy
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id") as NavId;
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const shouldHideNavbar = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (shouldHideNavbar) {
    return null;
  }

  const scrollToSection = (id: NavId) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

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
        } catch (e) {
          console.error("Logout error:", e);
        }
        setUser(null);
        setIsMobileMenuOpen(false);

        setTimeout(() => {
          setAlertState({
            isOpen: true,
            type: "success",
            title: "Logged Out",
            message: "You have been successfully logged out.",
            onClose: () => router.push("/"),
          });
        }, 300);
      },
    });
  };

  const closeAlert = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavClick = (id: NavId) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      if (id === "report") {
        router.push("/report");
      } else {
        router.push(`/#${id}`);
      }
      return;
    }
    scrollToSection(id);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/40 backdrop-blur-sm border-b border-white/10"
            : "bg-transparent backdrop-blur-0 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-10 md:py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-linear-to-br from-pink-500 to-orange-500 px-3 py-1 rounded-lg text-white font-bold shadow-lg shadow-orange-500/20">
              F
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              FixIt <span className="text-white/60">Hub</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:block absolute left-1/2 -translate-x-1/2 border border-white/10 rounded-full px-6 py-1.5 bg-white/5 backdrop-blur-xl">
            <ul className="flex items-center space-x-1 lg:space-x-4">
              {navItems.map((item) => {
                const isActive =
                  (isHome && activeSection === item.id) ||
                  (!isHome && item.id === "report" && isReportPath);

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white shadow-inner"
                          : "text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop User/Login */}
          <div className="hidden md:flex items-center">
            {isClient && (
              <>
                {!user ? (
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-white/10 hover:bg-neutral-800 transition">
                      <User2 className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-[11px] text-white/80">Log In</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider">
                        {user.role || "User"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <span className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center border border-red-500/20 hover:bg-red-900/50 transition">
                        <LogOut className="w-4 h-4 text-red-400" />
                      </span>
                      <span className="text-[11px] text-red-400">Log Out</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      {/* Mobile Menu Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-90 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidenav (Drawer) */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-neutral-950/80 backdrop-blur-xl z-100 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col border-r border-white/10 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10 bg-black/20">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="bg-linear-to-br from-pink-500 to-orange-500 px-3 py-1.5 rounded-lg text-white font-bold shadow-lg shadow-orange-500/20">
              F
            </div>
            <h1 className="text-xl font-bold text-white">
              FixIt <span className="text-white/60">Hub</span>
            </h1>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white/60 hover:text-white transition rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Wrapper for scrollable area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col">
          {/* Mobile User Profile (if logged in) */}
          {isClient && user && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(user.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-semibold truncate">{user.name}</p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <ul className="flex flex-col gap-2 space-y-1">
            {navItems.map((item) => {
              const isActive =
                (isHome && activeSection === item.id) ||
                (!isHome && item.id === "report" && isReportPath);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-lg font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-white border border-white/5 font-semibold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Spacer to push bottom content down if needed */}
          <div className="flex-1 min-h-8"></div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-4 w-full"></div>

          {/* Mobile Login / Logout Button */}
          <div>
            {isClient && !user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/auth/login");
                }}
                className="w-full py-4 rounded-xl bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-white font-bold text-lg shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-900/10 text-red-400 border border-red-500/20 font-semibold hover:bg-red-900/20 transition active:scale-[0.98] text-lg"
              >
                <LogOut size={22} />
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
