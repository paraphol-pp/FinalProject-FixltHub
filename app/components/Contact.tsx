"use client";

import { useState, type FC, FormEvent } from "react";
import { Mail, Phone } from "lucide-react";

const Contact: FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFirstName("");
      setLastName("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="py-24 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* LEFT */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Get in Touch
              </h2>
              <p className="mt-3 text-neutral-400 max-w-md">
                Have suggestions or need direct assistance? Our support team is
                ready to help you 24/7.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-white/5 px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <Mail size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Email us at
                  </span>
                  <span className="text-sm md:text-base font-medium text-white">
                    paraphol.puan@bumail.net
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-white/5 px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                  <Phone size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Call us at
                  </span>
                  <span className="text-sm md:text-base font-medium text-white">
                    +66 88 099 4342
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="rounded-3xl bg-neutral-900 border border-white/5 p-7 md:p-8 shadow-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full rounded-full border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full rounded-full border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              {/* message */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..."
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none resize-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              {/* ERROR / SUCCESS */}
              {status === "error" && (
                <p className="text-red-400 text-sm">
                  ⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง
                </p>
              )}
              {status === "success" && (
                <p className="text-green-400 text-sm">✅ ส่งข้อความสำเร็จ!</p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-500 py-3.5 text-sm md:text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
