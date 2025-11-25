"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User2 } from "lucide-react";

type NavId = "home" | "features" | "report" | "insights" | "contact";

type NavItem = {
  label: string;
  id: NavId;
};

const navItems: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "Features", id: "features" },
  { label: "Report", id: "report" },
  { label: "Insights", id: "insights" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<NavId>("home");

  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isReportPath = pathname.startsWith("/report"); // <-- อยู่ /report หรือ /report/new

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return; // ทำ observer แค่ตอนอยู่หน้า Home

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id") as NavId;
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.55 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const scrollToSection = (id: NavId) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleNavClick = (id: NavId) => {
    // ถ้าไม่ใช่หน้า Home
    if (!isHome) {
      if (id === "report") {
        // กด Report จากหน้าไหนก็พาไป /report
        router.push("/report");
      } else {
        // เมนูอื่น ๆ พากลับไปหน้า Home แล้วเลื่อนไป section นั้น
        router.push(`/#${id}`);
      }
      return;
    }

    // ถ้าอยู่หน้า Home อยู่แล้ว แค่เลื่อน
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/40 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent backdrop-blur-0 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between relative">
        {/* Logo ซ้าย */}
        <Link href="/" className="flex items-center gap-1">
          <div className="bg-linear-to-br from-pink-500 to-orange-500 px-3 py-1 rounded-lg text-white font-bold">
            F
          </div>
          <h1 className="text-2xl font-bold">
            FixIt <span className="text-white/60">Hub</span>
          </h1>
        </Link>

        {/* เมนูกลางจอ (absolute center) */}
        <nav className="absolute left-1/2 -translate-x-1/2 border border-white/10 rounded-full px-6 py-1.5 bg-white/5 backdrop-blur-xl">
          <ul className="flex items-center space-x-4">
            {navItems.map((item) => {
              // เงื่อนไข active:
              // - ถ้าอยู่หน้า Home → ใช้ activeSection ตามเดิม
              // - ถ้าอยู่หน้า /report หรือ /report/new → ให้ปุ่ม Report active
              const isActive =
                (isHome && activeSection === item.id) ||
                (!isHome && item.id === "report" && isReportPath);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white"
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

        {/* ปุ่ม Login ขวา */}
        <button
          onClick={() => router.push("/auth/login")}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-white/10 hover:bg-neutral-800 transition">
            <User2 className="w-4 h-4 text-white" />
          </span>
          <span className="text-[11px] text-white/80">Log In</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
