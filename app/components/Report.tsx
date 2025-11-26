"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, ChevronRight } from "lucide-react";

// เอา type มาจาก issuesSlice (ใช้ให้ตรงกับ Prisma / API)
import type { Issue, IssueStatus } from "@/app/store/issuesSlice";

const statusColorClass: Record<IssueStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/60",
  "In Progress": "bg-sky-500/10 text-sky-300 border border-sky-500/60",
  Resolved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60",
};

const Report = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"mine" | "all" | "others">("mine");
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);

  // ดึง user จาก backend และ issues ตาม viewMode
  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        // fetch current user (may be null)
        const meRes = await fetch("/api/auth/me");
        let me: any = null;
        if (meRes.ok) {
          const m = await meRes.json();
          me = m.user ?? null;
        }
        setUser(me);

        // build issues URL based on viewMode
        let url = "/api/issues";
        if (viewMode === "mine" && me?.name) {
          url = `/api/issues?reporter=${encodeURIComponent(me.name)}`;
        } else if (viewMode === "others" && me?.name) {
          url = `/api/issues?reporter=${encodeURIComponent(me.name)}&exclude=1`;
        }

        console.log("[Report] viewMode:", viewMode, "me.name:", me?.name, "url:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch issues");

        const data: Issue[] = await res.json();
        console.log("[Report] fetched issues count:", data.length, "data:", data);
        setIssues(data);
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [viewMode]);

  // แสดง loading / error state ก่อน
  if (loading) {
    return (
      <section className="py-24 bg-neutral-950/5">
        <div className="container mx-auto px-6 text-slate-400">
          Loading reports...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-neutral-950/5">
        <div className="container mx-auto px-6 text-red-400">
          {error}
        </div>
      </section>
    );
  }

  const topNine = issues.slice(0, 9);

  return (
    <section className="py-24 bg-neutral-950/5">
      <div className="container mx-auto px-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Recent Reports
            </h2>
            <p className="text-slate-400 mt-1">
              Latest issues reported by the community.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="bg-neutral-900 border border-white/10 text-sm text-slate-200 rounded-full px-3 py-1.5 focus:outline-none"
            >
              <option value="mine">My posts</option>
              <option value="all">All posts</option>
              <option value="others">Others' posts</option>
            </select>

            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 text-sm text-white/80 hover:bg-white/5 transition cursor-pointer"
            >
              Show All
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* ถ้าไม่มี issue เลย */}
        {topNine.length === 0 ? (
          <p className="text-slate-500 text-sm">
            ยังไม่มีรายงานปัญหาในระบบ
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 cursor-pointer">
            {topNine.map((issue) => (
              <article
                key={issue.id}
                className="group relative rounded-4xl bg-slate-900/5 border border-white/5 px-7 pt-12 pb-6 flex flex-col shadow-xl shadow-black/40 overflow-hidden"
              >
                {/* status pill */}
                <div className="absolute top-5 right-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColorClass[issue.status]
                    }`}
                  >
                    ● {issue.status}
                  </span>
                </div>

                {/* faint image background */}
                <div className="absolute inset-x-0 -top-10 h-52 opacity-[0.40] overflow-hidden">
                  <Image
                    src={issue.imageUrl}
                    alt={issue.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                  />
                </div>

                <div className="mb-6 relative">
                  <p className="text-4xl md:text-5xl font-semibold text-slate-400/80 opacity-0">
                    Issue {issue.id}
                  </p>
                </div>

                <span className="inline-flex w-fit px-3 py-2 z-10 rounded-md bg-slate-900 text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-300 mb-11">
                  {issue.category}
                </span>

                <h3 className="text-base md:text-lg font-semibold text-white leading-snug line-clamp-2 mb-3">
                  {issue.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} className="text-orange-400" />
                    {issue.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} className="text-slate-400" />
                    {issue.date}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-400 line-clamp-3 mb-4">
                  {issue.description}
                </p>

                <div className="w-full border-t border-white/5 mb-3" />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-semibold">
                      {issue.reporter.charAt(0)}
                    </div>
                    <span>
                      Reported by{" "}
                      <span className="text-white">{issue.reporter}</span>
                    </span>
                  </div>

                  <Link href={`/report/${issue.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200">
                    Details
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Report;
