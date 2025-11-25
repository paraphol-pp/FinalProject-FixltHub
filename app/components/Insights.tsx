// "use client";

// import { FC, useEffect, useState } from "react";
// import { Activity, CheckCircle2, Clock, TrendingUp } from "lucide-react";
// import { useAppSelector } from "@/app/store";

// type StatItem = {
//   id: number;
//   label: string;
//   value: number;
//   suffix?: string;
//   icon: React.ReactNode;
//   change: string;
//   changeColor: string;
// };

// const AnimatedNumber: FC<{ value: number; duration?: number }> = ({
//   value,
//   duration = 1000,
// }) => {
//   const [display, setDisplay] = useState(0);

//   useEffect(() => {
//     if (value === 0) {
//       setDisplay(0);
//       return;
//     }

//     let start: number | null = null;
//     const animate = (timestamp: number) => {
//       if (start === null) start = timestamp;
//       const progress = Math.min((timestamp - start) / duration, 1);
//       const current = value * progress;
//       setDisplay(current);

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       }
//     };

//     requestAnimationFrame(animate);

//     return () => {
//       // cleanup ถ้า component ถูก unmount
//       start = null;
//     };
//   }, [value, duration]);

//   const isInt = Number.isInteger(value);
//   const formatted = isInt
//     ? Math.round(display).toLocaleString()
//     : display.toFixed(1);

//   return <span>{formatted}</span>;
// };

// const Insights: FC = () => {
//   const issues = useAppSelector((s) => s.issues.items);
//   const logs = useAppSelector((s) => s.issues.logs);

//   // Stats
//   const totalReports = issues.length;

//   const now = new Date();
//   const resolvedThisMonth = issues.filter((i) => {
//     if (i.status !== "Resolved") return false;
//     const d = new Date(i.date);
//     return (
//       d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
//     );
//   }).length;

//   const avgResponse = 4.2; // hard-coded number (ชั่วโมง)

//   const stats: StatItem[] = [
//     {
//       id: 1,
//       label: "Total Reports",
//       value: totalReports,
//       icon: <Activity className="text-sky-400" size={22} />,
//       change: "+12%",
//       changeColor: "text-emerald-400 bg-emerald-500/10",
//     },
//     {
//       id: 2,
//       label: "Resolved This Month",
//       value: resolvedThisMonth,
//       icon: <CheckCircle2 className="text-emerald-400" size={22} />,
//       change: "+24%",
//       changeColor: "text-emerald-400 bg-emerald-500/10",
//     },
//     {
//       id: 3,
//       label: "Avg. Response Time",
//       value: avgResponse,
//       suffix: " Hrs",
//       icon: <Clock className="text-orange-400" size={22} />,
//       change: "-8%",
//       changeColor: "text-red-400 bg-red-500/10",
//     },
//   ];

//   return (
//     <section className="py-24 bg-neutral-950 min-h-screen">
//       <div className="container mx-auto px-6">
//         {/* HEADER */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-white">
//             Community Insights
//           </h1>
//           <p className="text-neutral-400 mt-3 text-lg">
//             Real-time data visualization of community health.
//           </p>
//         </div>

//         {/* STATS CARDS */}
//         <div className="grid gap-8 md:grid-cols-3 mb-16">
//           {stats.map((item) => (
//             <div
//               key={item.id}
//               className="bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col gap-4 shadow-lg"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
//                   {item.icon}
//                 </div>

//                 <span
//                   className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.changeColor}`}
//                 >
//                   {item.change}
//                 </span>
//               </div>

//               <p className="text-4xl font-bold text-white">
//                 <AnimatedNumber value={item.value} />
//                 {item.suffix}
//               </p>
//               <p className="text-neutral-400 text-sm">{item.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* ACTIVITY LOG */}
//         <div className="bg-neutral-900 border border-white/5 rounded-3xl p-7 shadow-xl">
//           <div className="flex items-center gap-2 mb-6">
//             <TrendingUp className="text-orange-400" size={20} />
//             <h2 className="text-xl font-semibold text-white">
//               Recent Activity Log
//             </h2>
//           </div>

//           <div className="space-y-6">
//             {logs.length === 0 ? (
//               <p className="text-neutral-500 text-sm">
//                 No recent actions yet.
//               </p>
//             ) : (
//               logs.map((log) => (
//                 <div
//                   key={log.id}
//                   className="pb-4 border-b border-white/5 last:border-0"
//                 >
//                   <p className="text-sm text-white">
//                     <span className="font-semibold text-amber-300">
//                       System Admin
//                     </span>{" "}
//                     {log.message}
//                   </p>

//                   <p className="text-neutral-500 text-xs mt-1">{log.time}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Insights;
"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Activity, CheckCircle2, Clock, TrendingUp } from "lucide-react";

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
  createdAt: string; // ISO date string จาก Prisma
  updatedAt?: string | null;
};

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
      start = null;
    };
  }, [value, duration]);

  const isInt = Number.isInteger(value);
  const formatted = isInt
    ? Math.round(display).toLocaleString()
    : display.toFixed(1);

  return <span>{formatted}</span>;
};

type ActivityLog = {
  id: number;
  message: string;
  time: string;
};

const Insights: FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ====== ดึงข้อมูลจาก API /api/issues ======
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/issues");
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data: Issue[] = await res.json();
        setIssues(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load insights data.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ====== คำนวณสถิติจาก issues ใน DB ======
  const { stats, activityLogs } = useMemo(() => {
    const totalReports = issues.length;

    const now = new Date();
    const resolvedThisMonth = issues.filter((i) => {
      if (i.status !== "Resolved") return false;

      // ใช้ createdAt หรือ date ก็ได้ ขึ้นอยู่กับที่คุณอยากยึด
      const d = i.createdAt ? new Date(i.createdAt) : new Date(i.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;

    // ตัวอย่างคำนวณ avg response time แบบง่าย ๆ (ชั่วโมง)
    const resolvedIssues = issues.filter((i) => i.status === "Resolved");
    let avgResponse = 0;
    if (resolvedIssues.length > 0) {
      const durations = resolvedIssues.map((i) => {
        const created = new Date(i.createdAt).getTime();
        const updated = i.updatedAt
          ? new Date(i.updatedAt).getTime()
          : created;
        const diffMs = Math.max(updated - created, 0);
        return diffMs / (1000 * 60 * 60); // ms -> hours
      });
      const sum = durations.reduce((acc, h) => acc + h, 0);
      avgResponse = sum / durations.length;
    }

    const stats: StatItem[] = [
      {
        id: 1,
        label: "Total Reports",
        value: totalReports,
        icon: <Activity className="text-sky-400" size={22} />,
        change: "+12%", // demo text
        changeColor: "text-emerald-400 bg-emerald-500/10",
      },
      {
        id: 2,
        label: "Resolved This Month",
        value: resolvedThisMonth,
        icon: <CheckCircle2 className="text-emerald-400" size={22} />,
        change: "+24%", // demo text
        changeColor: "text-emerald-400 bg-emerald-500/10",
      },
      {
        id: 3,
        label: "Avg. Response Time",
        value: Number.isNaN(avgResponse) ? 0 : avgResponse,
        suffix: " Hrs",
        icon: <Clock className="text-orange-400" size={22} />,
        change: "-8%", // demo text
        changeColor: "text-red-400 bg-red-500/10",
      },
    ];

    // สร้าง Activity log จาก issue ล่าสุด (เรียงตาม createdAt ใหม่สุดก่อน)
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
            : `New issue "${issue.title}" was reported.`,
        time: new Date(issue.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

    return { stats, activityLogs };
  }, [issues]);

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

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-neutral-400 mb-10">
            Loading insights...
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 mb-10">{error}</p>
        )}

        {/* STATS CARDS */}
        {!loading && !error && (
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
        )}

        {/* ACTIVITY LOG */}
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-7 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-400" size={20} />
            <h2 className="text-xl font-semibold text-white">
              Recent Activity Log
            </h2>
          </div>

          <div className="space-y-6">
            {activityLogs.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                No recent actions yet.
              </p>
            ) : (
              activityLogs.map((log) => (
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
