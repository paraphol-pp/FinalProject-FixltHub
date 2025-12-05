"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import AlertModal from "../../../components/AlertModal";

export default function CreateAdminPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Missing Information",
        message: "Please fill in all fields",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Creation failed");
      }

      setAlertState({
        isOpen: true,
        type: "success",
        title: "Successfully created admin",
        message: "The new admin account has been created successfully.",
        onClose: () => router.push("/admin/manage-admin"),
      });
    } catch (err) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Unable to create admin",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  const closeAlert = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />

      <div className="bg-neutral-900 rounded-lg border border-white/10 p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <PencilLine className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Create Admin</h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 w-full md:w-1/3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/manage-admin")}
              className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
