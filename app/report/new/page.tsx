"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import type { IssueCategory } from "@/app/store/issuesSlice";

export default function NewReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึง user จาก /api/auth/me เพื่อใช้ชื่อเป็น reporter
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const categories: IssueCategory[] = [
    "Electrical",
    "Water Supply",
    "Roads",
    "Waste",
    "Safety",
    "Others",
  ];

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<IssueCategory>("Others");

  // Image upload
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock upload logic (replace with real Cloudinary/S3 logic)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you'd upload 'file' to storage and get URL
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
      setUploading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const reporter = user?.name?.trim();
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          category,
          ...(reporter ? { reporter } : {}), // ✅ ส่งเฉพาะตอนมีชื่อจริง
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=2600",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create report");
      }

      // Success -> go back to reports
      router.push("/report");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen pt-28 pb-16 bg-neutral-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Report an Issue
            </h1>
            <p className="text-white/50">
              Help us maintain the community by providing details below.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Issue Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                  placeholder="e.g. Broken streetlight on Main St."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as IssueCategory)
                    }
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                    placeholder="Specific address or landmark"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition resize-none"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Photo Evidence
                </label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 bg-neutral-950/50 hover:bg-neutral-950 transition group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading || !!imageUrl}
                  />

                  {imageUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-20"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/40 group-hover:text-white/60 transition">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      ) : (
                        <Upload className="w-8 h-8 mb-2" />
                      )}
                      <p className="text-sm">
                        {uploading ? "Uploading..." : "Click or upload image"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="px-6 py-2.5 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
