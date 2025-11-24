"use client";

import { FC, useEffect, useState } from "react";
import { Activity, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useAppSelector } from "@/app/store";

type StatItem = {
  id: number;
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  change: string;
  changeColor: string;
};

const AnimatedNumber: FC<{ value: number; duration?: number }> = ({
  value,
  duration = 1000,
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = value * progress;
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // cleanup ถ้า component ถูก unmount
      start = null;
    };
  }, [value, duration]);

  const isInt = Number.isInteger(value);
  const formatted = isInt
    ? Math.round(display).toLocaleString()
    : display.toFixed(1);

  return <span>{formatted}</span>;
};

const Insights: FC = () => {
  const issues = useAppSelector((s) => s.issues.items);
  const logs = useAppSelector((s) => s.issues.logs);

  // Stats
  const totalReports = issues.length;

  const now = new Date();
  const resolvedThisMonth = issues.filter((i) => {
    if (i.status !== "Resolved") return false;
    const d = new Date(i.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const avgResponse = 4.2; // hard-coded number (ชั่วโมง)

  const stats: StatItem[] = [
    {
      id: 1,
      label: "Total Reports",
      value: totalReports,
      icon: <Activity className="text-sky-400" size={22} />,
      change: "+12%",
      changeColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: 2,
      label: "Resolved This Month",
      value: resolvedThisMonth,
      icon: <CheckCircle2 className="text-emerald-400" size={22} />,
      change: "+24%",
      changeColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: 3,
      label: "Avg. Response Time",
      value: avgResponse,
      suffix: " Hrs",
      icon: <Clock className="text-orange-400" size={22} />,
      change: "-8%",
      changeColor: "text-red-400 bg-red-500/10",
    },
  ];

  return (
    <section className="py-24 bg-neutral-950 min-h-screen">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Community Insights
          </h1>
          <p className="text-neutral-400 mt-3 text-lg">
            Real-time data visualization of community health.
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col gap-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                  {item.icon}
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.changeColor}`}
                >
                  {item.change}
                </span>
              </div>

              <p className="text-4xl font-bold text-white">
                <AnimatedNumber value={item.value} />
                {item.suffix}
              </p>
              <p className="text-neutral-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ACTIVITY LOG */}
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-7 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-400" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Recent Activity Log
            </h2>
          </div>

          <div className="space-y-6">
            {logs.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                No recent actions yet.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="pb-4 border-b border-white/5 last:border-0"
                >
                  <p className="text-sm text-white">
                    <span className="font-semibold text-amber-300">
                      System Admin
                    </span>{" "}
                    {log.message}
                  </p>

                  <p className="text-neutral-500 text-xs mt-1">{log.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Insights;
