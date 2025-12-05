"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

type UpdatePost = {
  id: number;
  name: string;
  date: string;
  content: string;
};

const MOCK_POSTS: UpdatePost[] = [
  {
    id: 1,
    name: "danupol.wang",
    date: "12/4/2025",
    content:
      "We’ve rolled out an update to improve report processing speed and overall system stability across all districts.",
  },
  {
    id: 2,
    name: "paraphol.pp",
    date: "12/4/2025",
    content:
      "Our team has added new categories for issues so you can report problems with even more detail and accuracy.",
  },
  {
    id: 3,
    name: "siwawit.jitk",
    date: "12/4/2025",
    content:
      "Scheduled maintenance will take place this weekend between 02:00–04:00 AM to keep the platform running smoothly.",
  },
  {
    id: 4,
    name: "sasakorn.trai",
    date: "12/4/2025",
    content:
      "Thank you for all the reports so far. Your feedback directly helps local teams prioritize and resolve issues faster.",
  },
];

const TOTAL_POSTS = MOCK_POSTS.length;

// helper หา slidesPerView จริง (เผื่อมี breakpoints)
const getSlidesPerView = (swiper: SwiperType): number => {
  if (!swiper || !swiper.params) return 1;
  const base = swiper.params.slidesPerView;
  if (typeof base === "number") return base;

  const bpKey = swiper.currentBreakpoint ?? "";
  const bp = swiper.params.breakpoints?.[bpKey] as
    | { slidesPerView?: number }
    | undefined;

  if (bp && typeof bp.slidesPerView === "number") {
    return bp.slidesPerView;
  }
  return 1;
};

export default function CommunityPage() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const [activeCenterIndex, setActiveCenterIndex] = useState(1);

  const updateActiveCenter = (swiper: SwiperType) => {
    const spv = getSlidesPerView(swiper);

    let centerRealIndex: number;
    if (spv >= 3) {
      // desktop: มี 3 ใบ → ใบกลาง = ซ้ายสุด + 1
      centerRealIndex = (swiper.realIndex + 1) % TOTAL_POSTS;
    } else {
      // mobile / tablet: แสดงทีละใบ → ใบกลาง = ใบที่โชว์อยู่
      centerRealIndex = swiper.realIndex;
    }

    setActiveCenterIndex(centerRealIndex);
  };

  return (
    <div className="min-h-screen text-slate-50 py-15 md:py-0">
      <section className="container mx-auto px-4 py-16 lg:py-24">
        {/* Header + arrows */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <p className="text-center md:text-left text-sm font-medium text-slate-400">
              From Our Team
            </p>
            <h1 className="text-center md:text-left mt-2 max-w-xl text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
              Stay updated with the latest
              <span className="hidden md:inline">
                <br />
              </span>
              improvements
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button
              ref={prevRef}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950/50 text-white/80 border border-white/10 hover:bg-white/5 transition cursor-pointer"
              aria-label="Previous"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              ‹
            </button>
            <button
              ref={nextRef}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950/50 text-white/80 border border-white/10 hover:bg-white/5 transition cursor-pointer"
              aria-label="Next"
              onClick={() => swiperRef.current?.slideNext()}
            >
              ›
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation]}
          className="community-swiper"
          spaceBetween={24}
          loop={true}
          centeredSlides={false}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          observer={true}
          observeParents={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
            (swiper.params.navigation as any).prevEl = prevRef.current;
            (swiper.params.navigation as any).nextEl = nextRef.current;
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.update();
              updateActiveCenter(swiper);
            }, 0);
          }}
          onSlideChange={updateActiveCenter}
        >
          {MOCK_POSTS.map((post, index) => {
            const isCenter = index === activeCenterIndex;

            const leftNeighborIndex =
              (activeCenterIndex - 1 + TOTAL_POSTS) % TOTAL_POSTS;
            const rightNeighborIndex = (activeCenterIndex + 1) % TOTAL_POSTS;

            const isLeftNeighbor = index === leftNeighborIndex;
            const isRightNeighbor = index === rightNeighborIndex;

            const handleClick = () => {
              const swiper = swiperRef.current;
              if (!swiper) return;

              if (isLeftNeighbor) {
                swiper.slidePrev();
              } else if (isRightNeighbor) {
                swiper.slideNext();
              } else if (!isCenter) {
                swiper.slideToLoop(index);
              }
            };

            return (
              <SwiperSlide
                key={post.id}
                className="cursor-pointer"
                onClick={handleClick}
              >
                <div className="py-5 md:py-30">
                  <article
                    className={[
                      "h-full rounded-2xl border border-white/5 px-6 py-13 flex flex-col gap-4 bg-slate-900/5 shadow-xl shadow-black/40",
                      "transition-transform transform origin-center cursor-pointer",
                      isCenter
                        ? "border-white/10 scale-95 md:scale-115 z-10 opacity-100"
                        : "border-white/0 scale-80 md:scale-90 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-400 to-red-900 shadow-inner" />
                      <div className="flex flex-col">
                        <span className="text-md font-semibold text-white">
                          {post.name}
                        </span>
                        <p className="text-xs text-slate-400">{post.date}</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-400 my-5">
                      {post.content}
                    </p>
                  </article>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </div>
  );
}
