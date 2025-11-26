"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Issue } from "@/app/store/issuesSlice";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/issues/${issueId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch issue");
        }
        const data = await response.json();
        setIssue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (issueId) {
      fetchIssue();
    }
  }, [issueId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Issue not found"}</p>
          <Link
            href="/report"
            className="text-pink-500 hover:text-pink-400 underline"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-900/30 border-yellow-500/30 text-yellow-400",
    "In Progress": "bg-blue-900/30 border-blue-500/30 text-blue-400",
    Resolved: "bg-green-900/30 border-green-500/30 text-green-400",
  };

  const categoryColor: Record<string, string> = {
    Electrical: "bg-yellow-900/30 border-yellow-500/30 text-yellow-400",
    "Water Supply": "bg-blue-900/30 border-blue-500/30 text-blue-400",
    Roads: "bg-gray-900/30 border-gray-500/30 text-gray-400",
    Waste: "bg-orange-900/30 border-orange-500/30 text-orange-400",
    Safety: "bg-red-900/30 border-red-500/30 text-red-400",
    Others: "bg-purple-900/30 border-purple-500/30 text-purple-400",
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/report"
          className="inline-flex items-center text-pink-500 hover:text-pink-400 mb-8 transition"
        >
          <span className="mr-2">←</span>
          Back to Reports
        </Link>

        {/* Main Card */}
        <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
          {/* Image */}
          {issue.imageUrl && (
            <div className="relative w-full h-96 bg-neutral-800">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${
                    statusColor[issue.status] ||
                    "bg-gray-900/30 border-gray-500/30 text-gray-400"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">{issue.title}</h1>

            {/* Category & Date */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  categoryColor[issue.category] ||
                  "bg-gray-900/30 border-gray-500/30 text-gray-400"
                }`}
              >
                {issue.category}
              </span>
              <span className="px-4 py-2 rounded-lg bg-neutral-800 border border-white/10 text-sm text-white/70">
                📅 {issue.date}
              </span>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-white/50 mb-2">
                LOCATION
              </h2>
              <p className="text-lg text-white flex items-center">
                <span className="mr-2">📍</span>
                {issue.location}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white/50 mb-2">
                DESCRIPTION
              </h2>
              <p className="text-white/80 leading-relaxed text-lg">
                {issue.description}
              </p>
            </div>

            {/* Reporter */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold mr-4">
                  {issue.reporter.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white/50 text-sm">Reported by</p>
                  <p className="text-white font-semibold">{issue.reporter}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
