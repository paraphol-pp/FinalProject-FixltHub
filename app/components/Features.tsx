import { Camera, BarChart3, Users } from "lucide-react";

const Features = () => {
  return (
    <div className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Built for Efficiency
          </h2>
          <p className="text-neutral-400">
            We prioritize a user-first mindset. From intuitive reporting to
            real-time tracking, every feature is designed to serve the
            community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Reporting",
              desc: "Snap a photo, add details, and submit. The fastest way to get local issues noticed.",
              icon: <Camera size={24} />,
              color: "from-blue-400 to-cyan-400",
            },
            {
              title: "Smart Tracking",
              desc: "Monitor the status of your report in real-time with detailed timeline updates.",
              icon: <BarChart3 size={24} />,
              color: "from-purple-400 to-pink-400",
            },
            {
              title: "Community Impact",
              desc: "See how your reports contribute to a safer, cleaner, and better neighborhood.",
              icon: <Users size={24} />,
              color: "from-orange-400 to-amber-400",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-0.5 rounded-3xl bg-linear-to-b from-white/10 to-transparent hover:from-orange-500 hover:to-pink-500 transition-all duration-500 cursor-pointer"
            >
              <div className="bg-neutral-950 rounded-[1.4rem] p-8 h-full relative overflow-hidden ">
                <div
                  className={`w-14 h-14 rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">{item.desc}</p>

                <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Features;
