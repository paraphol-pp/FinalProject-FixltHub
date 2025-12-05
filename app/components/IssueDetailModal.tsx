"use client";

import { useState } from "react";
import { X, MapPin, CalendarDays, Maximize2 } from "lucide-react";
import Image from "next/image";
import type { Issue } from "../store/issuesSlice";

type IssueDetailModalProps = {
  issue: Issue;
  onClose: () => void;
};

const statusColorClass: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/60",
  "In Progress": "bg-sky-500/10 text-sky-300 border border-sky-500/60",
  Resolved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60",
};

export default function IssueDetailModal({
  issue,
  onClose,
}: IssueDetailModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {/* Main Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black group">
            <Image
              src={issue.imageUrl}
              alt={issue.title}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setIsFullScreen(true)}
            />
            <div
              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
              onClick={() => setIsFullScreen(true)}
            >
              <Maximize2 className="text-white w-10 h-10 drop-shadow-lg" />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                {issue.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  statusColorClass[issue.status]
                }`}
              >
                {issue.status}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {issue.title}
            </h2>

            <div className="flex flex-col gap-2 text-sm text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-orange-400" />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-slate-400" />
                <span>{issue.date}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 mb-6 max-h-60 custom-scrollbar">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm">
                  {(issue.reporter || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reported by</p>
                  <p className="text-sm font-semibold text-white">
                    {issue.reporter || "Citizen X"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black/95 z-60 flex items-center justify-center p-4"
          onClick={() => setIsFullScreen(false)}
        >
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={issue.imageUrl}
              alt={issue.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
