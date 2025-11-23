// app/components/report/Report.tsx
"use client";

import Image from "next/image";
import { MapPin, CalendarDays, UserRound, ChevronRight } from "lucide-react";

type IssueStatus = "Pending" | "In Progress" | "Resolved";

type IssueCategory =
  | "Electrical"
  | "Water Supply"
  | "Roads"
  | "Waste"
  | "Safety"
  | "Others";

type Issue = {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  reporter: string;
  imageUrl: string;
};

const issues: Issue[] = [
  {
    id: 1,
    title: "Street Light Broken at Main St. & 5th Ave",
    location: "Main St. & 5th Ave",
    date: "11/14/2025",
    description:
      "Reported issue concerning street light broken. Ideally requires immediate inspection to prevent accidents.",
    category: "Electrical",
    status: "Pending",
    reporter: "Citizen A",
    imageUrl: "/assets/issues/issue-1.avif",
  },
  {
    id: 2,
    title: "Water Pipe Burst at Central Park Entrance",
    location: "Central Park Entrance",
    date: "11/12/2025",
    description:
      "Reported issue concerning water pipe burst. May cause flooding and water supply disruption.",
    category: "Water Supply",
    status: "Pending",
    reporter: "Citizen B",
    imageUrl: "/assets/issues/issue-2.avif",
  },
  {
    id: 3,
    title: "Manhole Cover Missing at Downtown Market",
    location: "Downtown Market",
    date: "08/19/2025",
    description:
      "Reported manhole cover missing. Immediate attention needed to avoid accidents for pedestrians and vehicles.",
    category: "Roads",
    status: "Pending",
    reporter: "Citizen C",
    imageUrl: "/assets/issues/issue-3.jpg",
  },
  {
    id: 4,
    title: "Overflowing Trash at School Zone A",
    location: "School Zone A",
    date: "11/14/2025",
    description:
      "Reported overflowing trash near the school area. Could impact hygiene and student safety.",
    category: "Waste",
    status: "Pending",
    reporter: "Citizen D",
    imageUrl: "/assets/issues/issue-4.avif",
  },
  {
    id: 5,
    title: "Fallen Tree at Riverside Walkway",
    location: "Riverside Walkway",
    date: "08/19/2025",
    description:
      "Reported fallen tree blocking pedestrian walkway. Requires urgent clearing for safe passage.",
    category: "Safety",
    status: "Pending",
    reporter: "Citizen E",
    imageUrl: "/assets/issues/issue-5.avif",
  },
  {
    id: 6,
    title: "Pothole on Road at Block 5, Sector 2",
    location: "Block 5, Sector 2",
    date: "08/12/2025",
    description:
      "Reported large pothole on main road. Could damage vehicles and cause traffic issues.",
    category: "Others",
    status: "In Progress",
    reporter: "Citizen F",
    imageUrl: "/assets/issues/issue-6.avif",
  },
  {
    id: 7,
    title: "Flooding Under Highway Exit 12",
    location: "Highway Exit 12",
    date: "09/02/2025",
    description:
      "Heavy water accumulation during rain causing hazardous driving conditions.",
    category: "Roads",
    status: "Pending",
    reporter: "Citizen G",
    imageUrl: "/assets/issues/issue-7.avif",
  },
  {
    id: 8,
    title: "Broken Guardrail at Riverside Curve",
    location: "Riverside Curve",
    date: "10/01/2025",
    description:
      "Damaged guardrail along sharp curve by the river. Needs repair to ensure driver safety.",
    category: "Safety",
    status: "In Progress",
    reporter: "Citizen H",
    imageUrl: "/assets/issues/issue-8.jpg",
  },
  {
    id: 9,
    title: "Clogged Drain Causing Street Flooding",
    location: "Market Street",
    date: "11/01/2025",
    description:
      "Drainage blocked by debris leading to frequent street flooding during rainfall.",
    category: "Waste",
    status: "Resolved",
    reporter: "Citizen I",
    imageUrl: "/assets/issues/issue-9.avif",
  },
];

const statusColorClass: Record<IssueStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/60",
  "In Progress": "bg-sky-500/10 text-sky-300 border border-sky-500/60",
  Resolved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60",
};

const Report = () => {
  return (
    <section className="py-24 bg-neutral-950/5 ">
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

          <button className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 text-sm text-white/80 hover:bg-white/5 transition cursor-pointer">
            Show All
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Grid 3x3 */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 cursor-pointer">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="relative rounded-4xl bg-slate-900/5 border border-white/5 px-7 pt-7 pb-6 flex flex-col shadow-xl shadow-black/40 overflow-hidden"
            >
              {/* status pill */}
              <div className="absolute top-5 right-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColorClass[issue.status]}`}
                >
                  ● {issue.status}
                </span>
              </div>

              {/* faint image background */}
              <div className="absolute inset-x-0 -top-10 h-50 opacity-[0.25] pointer-events-none">
                <Image
                  src={issue.imageUrl}
                  alt={issue.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* big Issue label */}
              <div className="mb-6 relative">
                <p className="text-4xl md:text-5xl font-semibold text-slate-400/80 opacity-0">
                  Issue {issue.id}
                </p>
              </div>

              {/* category badge */}
              <span className="inline-flex w-fit px-3 py-2 rounded-md bg-slate-900 text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-300 mb-11">
                {issue.category}
              </span>

              {/* title */}
              <h3 className="text-base md:text-lg font-semibold text-whiteleading-snug line-clamp-2 mb-3">
                {issue.title}
              </h3>

              {/* location + date */}
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

              {/* description */}
              <p className="text-xs md:text-sm text-slate-400 line-clamp-3 mb-4">
                {issue.description}
              </p>

              {/* divider */}
              <div className="w-full border-t border-white/5 mb-3" />

              {/* footer: reporter + details */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-semibold">
                    {issue.reporter.charAt(0)}
                  </div>
                  <span>
                    Reported by <span className="text-white">{issue.reporter}</span>
                  </span>
                </div>

                <button className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 cursor-pointer">
                  Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Report;
