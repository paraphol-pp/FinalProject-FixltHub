"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [activeIssues, setActiveIssues] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);

  useEffect(() => {
    const duration = 1000; // ระยะเวลาอนิเมชัน 1 วิ
    const frame = 16;      // ~60fps

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

    const t1 = animateCount(45, setActiveIssues);
    const t2 = animateCount(10, setResolvedCases);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);
  return (
    <header className="container mx-auto px-6 relative flex justify-between items-start py-20 pt-50">
      {/* LEFT */}
      <div className="flex flex-col space-y-10 w-1/2">
        <p className="text-sm text-orange-400 font-semibold border border-white/20 w-fit rounded-full px-5 py-0.5">
          ● Empowering Communities
        </p>

        {/* big text */}
        <div>
          <h1 className="text-7xl font-bold leading-none">
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

        <p className="max-w-[450px] opacity-80">
          We provide a seamless platform for citizens to report infrastructure
          issues, track progress, and collaborate with local authorities for a
          better tomorrow.
        </p>

        <div className="flex items-center gap-4 ">
          <Link href="/report/new" className="px-6 py-3 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-sm md:text-base font-semibold text-white shadow-xl shadow-orange-500/25 transition hover:brightness-110 cursor-pointer">
            Report Issue →
          </Link>

          <button className="px-6 py-3 rounded-full border border-white/10  bg-[#1a1f35]/20 text-white  font-semibold cursor-pointer transition hover:brightness-110 ">
            View Dashboard
          </button>
        </div>

        <hr className="border-white/10 max-w-[500px]" />

        <div className="flex gap-5">
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

      {/* RIGHT */}
      <div className="relative w-1/2 h-[500px]">
        {/* BACK IMAGE */}
        <img
          src="\assets\img\bg-community-1.avif"
          className="absolute right-0 top-0 rotate-3 w-[320px] h-[300px] rounded-2xl shadow-xl shadow-black/70 object-cover"
        />
        {/* CenTer carD */}
        <div className="bg-linear-to-br from-pink-500 to-orange-500 px-9 py-6 text-5xl rounded-lg text-white font-bold w-fit absolute right-36 top-30 z-10 shadow-lg shadow-black/50">
            F
          </div>
        {/* FLOATING CARD */}
        <div className="absolute right-[150px] top-[150px] rotate-[-5deg] bg-[#0d1125] rounded-2xl p-6 w-[300px] h-[300px] shadow-xl shadow-black/70 flex flex-col">
          <p className="text-xs text-white/60">REAL-TIME STATS</p>
          <h1 className="text-4xl font-bold text-white">98%</h1>
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
    </header>
  );
};

export default Hero;
