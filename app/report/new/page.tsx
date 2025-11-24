"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IssueCategory, addIssue } from "@/app/store/issuesSlice";
import { useAppDispatch } from "@/app/store";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Camera } from "lucide-react";

export default function NewReportPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categories: IssueCategory[] = [
    "Electrical",
    "Water Supply",
    "Roads",
    "Waste",
    "Safety",
    "Others",
  ];

  // State form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IssueCategory>("Others");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    // กันไม่ให้คลิก X แล้วมันเปิด dialog เลือกรูปอีก
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert("Please enter title.");

    // ใช้เวลาตอน submit เป็นวันที่ของ issue
    const submittedDate = new Date().toLocaleDateString("en-US");

    dispatch(
      addIssue({
        title,
        category,
        location: location || "Unknown",
        description: description || "No description provided.",
        reporter: "Citizen X",
        status: "Pending",
        date: submittedDate,
        imageUrl: imagePreview || "/assets/issues/issue-1.avif",
      })
    );

    router.push("/report");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-30 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="text-slate-300 hover:text-white mb-6 cursor-pointer"
          >
            ← Back
          </button>

          {/* Header */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Report an Issue
          </h1>
          <p className="text-slate-400 mb-8">
            Help us maintain the community by providing details below.
          </p>

          {/* Form Container */}
          <div className="rounded-3xl bg-neutral-900/60 border border-white/10 p-8 shadow-xl space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Issue Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Broken Street Light"
                className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>

            {/* Category + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as IssueCategory)
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-sm text-slate-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Specific address or landmark"
                  className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-white text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-white text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Evidence Photo
              </label>

              <label className="w-full h-40 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-neutral-950/40 hover:bg-neutral-800/30 transition">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black/90"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="text-slate-400 mb-2" />
                    <span className="text-slate-500 text-sm">
                      Click to upload image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => router.push("/report")}
                className="px-5 py-2 rounded-full border border-white/15 text-sm text-slate-200 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-sm font-semibold text-white hover:brightness-110"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
