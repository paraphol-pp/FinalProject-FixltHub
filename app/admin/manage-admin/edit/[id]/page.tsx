"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AlertModal from "../../../../components/AlertModal";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [targetAdmin, setTargetAdmin] = useState<User | null>(null); // Admin being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [currentPassword, setCurrentPassword] = useState("");

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

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/admins");
        if (!res.ok) throw new Error("Failed to fetch admins");
        const data = await res.json();
        const found = data.find((u: User) => u.id === String(id));
        if (found) {
          setTargetAdmin(found);
          setName(found.name);
          setEmail(found.email);
          setRole(found.role || "user");
        } else {
          setError("Admin not found");
        }
      } catch (err) {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdmin) return;

    if (!currentPassword) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Password Required",
        message: "Please enter your password to confirm changes",
      });
      return;
    }

    try {
      const res = await fetch(`/api/admins/${targetAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          currentPassword, // Required for verification
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      setAlertState({
        isOpen: true,
        type: "success",
        title: "Successfully to edit admin",
        message: "Admin details have been updated successfully.",
        onClose: () => router.push("/admin/manage-admin"),
      });
    } catch (err: any) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Unable to edit admin",
        message: err.message || "Something went wrong.",
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

      <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Edit Admin</h2>

        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                required
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm text-white/60 mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                placeholder="Enter this user's current password"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 rounded bg-neutral-800 text-white hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
