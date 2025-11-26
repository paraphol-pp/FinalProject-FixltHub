"use client";

import { Mail, Lock, User2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignupPage = () => {
  const router = useRouter();

  // ฟอร์ม state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ฟังก์ชัน signup จริง
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup success!");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-950 border border-white/10 shadow-2xl px-8 py-9">

        {/* close */}
        <button
          onClick={() => router.push("/")}
          className="absolute right-5 top-5 text-white/50 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* logo */}
        <div className="bg-linear-to-bl from-pink-500 to-orange-500 px-4 py-1 rounded-xl text-white text-4xl font-bold w-fit mx-auto mb-6 shadow-lg shadow-orange-500/30">
          F
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
          Create Account
        </h1>

        <p className="text-center text-white/50 text-sm mt-2 mb-8">
          Enter your details to access the platform.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">
              USERNAME
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
              <input
                type="text"
                required
                placeholder="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full py-2.5 rounded-xl bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:brightness-110 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/50">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-amber-300 font-semibold hover:text-amber-200">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
