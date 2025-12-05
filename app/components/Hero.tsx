"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [activeIssues, setActiveIssues] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();

    // Listen for auth changes
    const handleAuthChange = () => fetchUser();
    window.addEventListener("auth:changed", handleAuthChange);
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/issues");
        if (res.ok) {
          const data = await res.json();
          const active = data.filter(
            (i: any) => i.status === "Pending" || i.status === "In Progress"
          ).length;
          const resolved = data.filter(
            (i: any) => i.status === "Resolved"
          ).length;

          animateCount(active, setActiveIssues);
          animateCount(resolved, setResolvedCases);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    const duration = 1000;
    const frame = 16;

    const animateCount = (target: number, setter: (v: number) => void) => {
      let current = 0;
      const increment = target / (duration / frame);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setter(Math.floor(current));
      }, frame);

      return timer;
    };

    fetchStats();
  }, []);

  // Determine button text and link
  let buttonText = "Show All";
  let buttonLink = "/report";

  if (user && user.role === "admin") {
    buttonText = "View Dashboard";
    buttonLink = "/admin/dashboard";
  }

  return (
    <header className="pt-25 px-6 md:px-0 md:pt-24 container mx-auto relative">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-16 py-10 lg:py-20">
        {/* LEFT */}
        <div className="flex flex-col space-y-8 w-full lg:w-1/2 items-center lg:items-start text-center lg:text-left">
          {/* Pill */}
          <p className="text-sm text-orange-400 font-semibold border border-white/20 w-fit rounded-full px-5 py-0.5 flex items-center gap-2">
            <span className="glow-dot" />
            <span>Empowering Communities</span>
          </p>

          {/* Heading */}
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight lg:leading-none">
              Transform Your <br />
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Community
              </span>
              <br />
              <span className="bg-linear-to-r from-pink-700 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Living
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-[450px] opacity-80">
            We provide a seamless platform for citizens to report infrastructure
            issues, track progress, and collaborate with local authorities for a
            better tomorrow.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/report/new"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-sm md:text-base font-semibold text-white shadow-xl shadow-orange-500/25 transition hover:brightness-110 cursor-pointer text-center"
            >
              Report Issue →
            </Link>

            <Link
              href={buttonLink}
              className="w-full sm:w-auto min-w-[180px] px-6 py-3 rounded-full border border-white/10 bg-[#1a1f35]/20 text-white font-semibold cursor-pointer transition hover:brightness-110 text-center"
            >
              {buttonText}
            </Link>
          </div>

          <hr className="border-white/10 w-full max-w-[500px]" />

          {/* Stats */}
          <div className="flex gap-5 justify-center lg:justify-start">
            <div>
              <h1 className="text-3xl font-bold">{activeIssues}+</h1>
              <p className="text-white/50">Active Issues</p>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{resolvedCases}+</h1>
              <p className="text-white/50">Resolved Cases</p>
            </div>
          </div>
        </div>

        {/* RIGHT (ภาพ + การ์ด) */}
        <div className="hidden lg:block relative w-full lg:w-1/2 h-[420px] md:h-[450px] lg:h-[500px]justify-center lg:justify-end">
          {/* BACK IMAGE */}
          <img
            src="/assets/img/bg-community-1.avif"
            alt="Community"
            className="absolute right-6 md:right-10 lg:right-0 top-5 md:top-8 lg:top-0 rotate-3 w-[230px] md:w-[280px] lg:w-[320px] h-[220px] md:h-[260px] lg:h-[300px] rounded-2xl shadow-xl shadow-black/70 object-cover"
          />

          {/* Logo F */}
          <div className="bg-linear-to-br from-pink-500 to-orange-500 px-7 md:px-9 py-4 md:py-6 text-4xl md:text-5xl rounded-lg text-white font-bold w-fit absolute right-28 md:right-32 lg:right-36 top-24 md:top-28 lg:top-30 z-10 shadow-lg shadow-black/50">
            F
          </div>

          {/* Floating Card */}
          <div className="absolute right-[90px] md:right-[120px] lg:right-[150px] top-[150px] md:top-[170px] lg:top-[150px] rotate-[-5deg] bg-[#0d1125] rounded-2xl p-5 md:p-6 w-[220px] md:w-[260px] lg:w-[300px] h-[230px] md:h-[260px] lg:h-[300px] shadow-xl shadow-black/70 flex flex-col">
            <p className="text-xs text-white/60">REAL-TIME STATS</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">98%</h1>
            <p className="text-white/60">Response Rate</p>

            <div className="flex gap-1 mt-auto">
              <p className="text-white font-semibold bg-neutral-600/50 px-1 py-1 rounded-full">
                U1
              </p>
              <p className="text-white font-semibold bg-neutral-600/50 px-1 py-1 rounded-full">
                U2
              </p>
              <p className="text-white font-semibold bg-neutral-600/50 px-1 py-1 rounded-full">
                U3
              </p>
              <p className="text-white font-semibold bg-neutral-600/50 px-1 py-1 rounded-full">
                U4
              </p>
              <p className="text-white font-semibold bg-orange-500 px-1 py-1 rounded-full">
                U5
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
