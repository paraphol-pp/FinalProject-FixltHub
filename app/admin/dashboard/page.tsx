"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

type Issue = {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  category: string;
  status: string;
  reporter: string;
  imageUrl: string;
  createdAt: string;
};

type ActivityLog = {
  id: number;
  message: string;
  time: string;
  reporter: string;
  type: "user" | "system";
};

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues");
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIssues();
  }, []);

  const total = issues.length;
  const pending = issues.filter((i) => i.status === "Pending").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  const activityLogs: ActivityLog[] = issues
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3)
    .map((issue) => ({
      id: issue.id,
      message:
        issue.status === "Resolved"
          ? `Issue "${issue.title}" was resolved.`
          : `New issue "${issue.title}"`,
      time: new Date(issue.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      reporter: issue.reporter,
      type: issue.status === "Resolved" ? "system" : "user",
    }));

  return (
    <>
      {/* Dashboard stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-lg bg-neutral-900 border border-white/10">
          <div className="text-sm text-white/60 mb-2">Total Reports</div>
          <div className="text-4xl font-bold text-white">{total}</div>
        </div>
        <div className="p-6 rounded-lg bg-neutral-900 border border-white/10">
          <div className="text-sm text-white/60 mb-2">Pending</div>
          <div className="text-4xl font-bold text-yellow-400">{pending}</div>
        </div>
        <div className="p-6 rounded-lg bg-neutral-900 border border-white/10">
          <div className="text-sm text-white/60 mb-2">In Progress</div>
          <div className="text-4xl font-bold text-blue-400">{inProgress}</div>
        </div>
        <div className="p-6 rounded-lg bg-neutral-900 border border-white/10">
          <div className="text-sm text-white/60 mb-2">Resolved</div>
          <div className="text-4xl font-bold text-green-400">{resolved}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Bar Chart: Popular of category posts */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-neutral-900 border border-white/10">
          <h3 className="text-white/60 text-sm mb-6">
            Popular of category posts
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={Object.entries(
                  issues.reduce((acc, issue) => {
                    acc[issue.category] = (acc[issue.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .map(([name, value]) => ({ name, value }))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)}
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0] as any}
                  barSize={20}
                  background={{
                    fill: "#262626",
                    radius: [0, 4, 4, 0] as any,
                  }}
                >
                  {Object.entries(
                    issues.reduce((acc, issue) => {
                      acc[issue.category] = (acc[issue.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#22d3ee", // cyan-400
                            "#93536d", // rose-800/muted
                            "#6ee7b7", // emerald-300
                            "#3b82f6", // blue-500
                            "#f9a8d4", // pink-300
                            "#ef4444", // red-500
                          ][index % 6]
                        }
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Breakdown */}
        <div className="p-6 rounded-lg bg-neutral-900 border border-white/10">
          <h3 className="text-white/60 text-sm mb-6">Category Breakdown</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(
                    issues.reduce((acc, issue) => {
                      acc[issue.category] = (acc[issue.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {Object.entries(
                    issues.reduce((acc, issue) => {
                      acc[issue.category] = (acc[issue.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#6ee7b7", // emerald-300
                          "#864c5d", // rose-900/muted
                          "#22d3ee", // cyan-400
                          "#ef4444", // red-500
                          "#f9a8d4", // pink-300
                          "#3b82f6", // blue-500
                        ][index % 6]
                      }
                      stroke="rgba(0,0,0,0.2)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span className="text-xs text-white/60 ml-1">
                      {value}
                      <span className="ml-3">
                        ({Math.round((entry.payload.value / total) * 100)}%)
                      </span>
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-orange-400" size={20} />
          <h2 className="text-xl font-semibold text-white">
            Recent Activity Log
          </h2>
        </div>

        <div className="space-y-6">
          {activityLogs.length === 0 ? (
            <p className="text-neutral-500 text-sm">No recent actions yet.</p>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="pb-4 border-b border-white/5 last:border-0"
              >
                <p className="text-sm text-white">
                  {log.type === "user" ? (
                    <>
                      <span className="font-semibold text-amber-300">
                        Reported by {log.reporter}
                      </span>{" "}
                      : {log.message}
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-blue-300">
                        System Admin
                      </span>{" "}
                      : {log.message}
                    </>
                  )}
                </p>
                <p className="text-neutral-500 text-xs mt-1">{log.time}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
