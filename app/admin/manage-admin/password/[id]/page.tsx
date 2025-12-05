"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import AlertModal from "../../../../components/AlertModal";

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [targetAdmin, setTargetAdmin] = useState<User | null>(null); // Admin being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        const found = data.find((u: User) => u.id === Number(id));
        if (found) {
          setTargetAdmin(found);
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

    if (newPassword !== confirmPassword) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Password Mismatch",
        message: "New passwords do not match",
      });
      return;
    }

    try {
      const res = await fetch(`/api/admins/${targetAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
          currentPassword: oldPassword, // Required for verification
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      setAlertState({
        isOpen: true,
        type: "success",
        title: "Successfully changed password",
        message: "The password has been updated successfully.",
        onClose: () => router.push("/admin/manage-admin"),
      });
    } catch (err: any) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Unable to change password",
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
        <div className="flex items-center gap-2 mb-6">
          <Pencil className="text-white" size={24} />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Old password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                required
              />
            </div>

            <div className="flex justify-start gap-3 mt-6">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
