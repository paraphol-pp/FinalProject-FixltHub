"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { IssueStatus, IssueCategory } from "../store/issuesSlice";
import {
  MapPin,
  CalendarDays,
  ChevronRight,
  Settings2,
  Trash2,
  Search,
  Filter,
  Plus,
} from "lucide-react";

const statusColorClass: Record<IssueStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/60",
  "In Progress": "bg-sky-500/10 text-sky-300 border border-sky-500/60",
  Resolved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60",
};

const PER_PAGE = 12;

// type ให้ตรงกับ prisma issue
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

const ReportPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<
    IssueCategory | "All"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openIssueId, setOpenIssueId] = useState<number | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const categories: IssueCategory[] = [
    "Electrical",
    "Water Supply",
    "Roads",
    "Waste",
    "Safety",
    "Others",
  ];

  // โหลดทั้งหมดจาก API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/issues");
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data: Issue[] = await res.json();
        setIssues(data);
      } catch (err) {
        console.error(err);
        setError("โหลดรายการรายงานไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      const text = (search || "").toLowerCase();
      const matchText =
        issue.title.toLowerCase().includes(text) ||
        issue.location.toLowerCase().includes(text) ||
        issue.description.toLowerCase().includes(text) ||
        issue.category.toLowerCase().includes(text);

      const matchStatus =
        statusFilter === "All" ? true : issue.status === statusFilter;

      const matchCategory =
        categoryFilter === "All" ? true : issue.category === categoryFilter;

      return matchText && matchStatus && matchCategory;
    });
  }, [issues, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginated = filtered.slice(
    (currentPageSafe - 1) * PER_PAGE,
    currentPageSafe * PER_PAGE
  );

  // เปลี่ยนสถานะผ่าน API (PATCH /api/issues/:id)
  const handleStatusChange = async (id: number, status: IssueStatus) => {
  try {
    const res = await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update status");

    const updated: Issue = await res.json();

    // อัปเดต state ด้านหน้าให้ sync กับ DB
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? updated : issue))
    );
  } catch (err) {
    console.error(err);
    alert("อัปเดตสถานะไม่สำเร็จ");
  }
};


  // ลบผ่าน API (DELETE /api/issues/:id)
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/issues/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setIssues((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("ลบรายงานไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  // state ตอนกำลังโหลด / error
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-30 pb-16">
          <div className="container mx-auto px-6 text-slate-400">
            Loading reports...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-30 pb-16">
          <div className="container mx-auto px-6 text-red-400">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-30 pb-16">
        <div className="container mx-auto px-6">
          {/* Header + controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Recent Reports
              </h1>
              <p className="text-white/50 mt-1">
                Manage and track all community issues.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search title, location or category..."
                  className="pl-9 pr-3 py-2 rounded-full bg-neutral-900 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/50" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as IssueStatus | "All")
                  }
                  className="bg-neutral-900 border border-white/10 text-sm text-slate-200 rounded-full px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as IssueCategory | "All")
                  }
                  className="bg-neutral-900 border border-white/10 text-sm text-slate-200 rounded-full px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Report */}
              <Link
                href="/report/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 transition"
              >
                <Plus size={16} />
                New Report
              </Link>
            </div>
          </div>

          {/* Grid : settings / delete */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mb-10 cursor-pointer">
            {paginated.map((issue) => (
              <article
                key={issue.id}
                className="group relative rounded-4xl bg-slate-900/5 border border-white/5 px-7 pt-12 pb-6 flex flex-col shadow-xl shadow-black/40 overflow-hidden"
              >
                {/* status pill + settings icon */}
                <div className="absolute top-5 right-6 flex items-center gap-2 z-20">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColorClass[issue.status]
                    }`}
                  >
                    ● {issue.status}
                  </span>
                  <button
                    onClick={() =>
                      setOpenIssueId(
                        openIssueId === issue.id ? null : issue.id
                      )
                    }
                    className="p-1 rounded-full bg-black/40 border border-white/10 text-slate-200 hover:bg-white/10"
                  >
                    <Settings2 size={14} />
                  </button>
                </div>

                {/* image bg */}
                <div className="absolute inset-x-0 -top-10 h-52 opacity-[0.40] overflow-hidden">
                  <Image
                    src={issue.imageUrl}
                    alt={issue.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                  />
                </div>

                {/* content */}
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-4xl md:text-5xl font-semibold text-slate-400/80 opacity-0">
                      Issue {issue.id}
                    </p>
                  </div>

                  <span className="inline-flex w-fit px-3 py-2 rounded-md bg-slate-900 text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-300 mb-11">
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

                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 cursor-pointer">
                      Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Settings panel */}
                {openIssueId === issue.id && (
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/70 border border-white/10 p-3 flex flex-col gap-3 z-30 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-300">
                        Update Status:
                      </span>
                      <select
                        value={issue.status}
                        onChange={(e) =>
                          handleStatusChange(
                            issue.id,
                            e.target.value as IssueStatus
                          )
                        }
                        disabled={updatingId === issue.id}
                        className="rounded-full bg-neutral-900 border border-white/15 px-3 py-1 text-xs text-slate-200 disabled:opacity-60"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(issue.id)}
                      disabled={deletingId === issue.id}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                      {deletingId === issue.id
                        ? "Deleting..."
                        : "Delete Report"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => {setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" });}}
                    className={`min-w-9 h-9 rounded-full border text-sm cursor-pointer ${
                      page === currentPageSafe
                        ? "bg-white text-black border-white"
                        : "bg-neutral-900 text-slate-200 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReportPage;
