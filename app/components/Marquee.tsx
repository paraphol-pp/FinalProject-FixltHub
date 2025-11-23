import type { ReactNode } from "react";
import {
  Building2,
  HardHat,
  Trees,
  Truck,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from "lucide-react";

type Partner = {
  name: string;
  icon: ReactNode;
};

const PARTNERS: Partner[] = [
  { name: "City Council", icon: <Building2 /> },
  { name: "Public Works", icon: <HardHat /> },
  { name: "Green Earth", icon: <Trees /> },
  { name: "Urban Waste", icon: <Truck /> },
  { name: "Safety First", icon: <ShieldAlert /> },
  { name: "Power Grid", icon: <Zap /> },
  { name: "Water Dept", icon: <CheckCircle2 /> },
];

const Marquee = () => {
  return (
    
    <div className="marquee w-full py-10 bg-neutral-900/5 border-y border-white/5 overflow-hidden relative cursor-pointer">
      {/* Left fade */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />

      {/* Right fade */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      {/* SCROLLING ROW */}
      <div className="flex gap-16 animate-infinite-scroll whitespace-nowrap">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              {partner.icon}
            </div>
            <span className="text-lg font-semibold tracking-wide">
              {partner.name}
            </span>
          </div>
        ))}
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        .marquee:hover .animate-infinite-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
