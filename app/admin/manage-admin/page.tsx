"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export default function ManageAdminPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admins");
        if (!res.ok) throw new Error("Failed to fetch admins");
        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <>
      {/* Main content switch */}

      {/* Table */}
      <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            List of all admins
          </h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/admin/manage-admin/create"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition w-full md:w-auto"
            >
              <Plus size={16} />
              Create Admin
            </Link>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-white/60">Loading...</div>
          ) : error ? (
            <div className="py-16 text-center text-red-400">{error}</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-white/60 border-b border-white/10 bg-neutral-800/50">
                  <th className="px-6 py-4">No.</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">password</th>
                  <th className="px-6 py-4">Edit</th>
                  <th className="px-6 py-4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, idx) => (
                  <tr
                    key={admin.id}
                    className="border-b border-white/10 hover:bg-neutral-800/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/90 font-medium">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/manage-admin/password/${admin.id}`}
                        className="inline-block p-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
                      >
                        <Pencil size={16} />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/manage-admin/edit/${admin.id}`}
                        className="inline-block px-3 py-1 rounded bg-yellow-600 text-white text-sm hover:bg-yellow-700 transition"
                      >
                        Edit
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                        onClick={async () => {
                          if (!confirm("Delete this admin?")) return;
                          try {
                            const res = await fetch(`/api/admins/${admin.id}`, {
                              method: "DELETE",
                            });
                            if (!res.ok) throw new Error("Delete failed");
                            setAdmins((prev) =>
                              prev.filter((x) => x.id !== admin.id)
                            );
                          } catch (err) {
                            alert("Delete failed");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-white/60">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-400">{error}</div>
          ) : (
            admins.map((admin, idx) => (
              <div
                key={admin.id}
                className="bg-neutral-800/50 rounded-lg border border-white/5 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white truncate">
                      {admin.name}
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {admin.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <Link
                    href={`/admin/manage-admin/password/${admin.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-yellow-600/20 text-yellow-500 text-xs font-medium hover:bg-yellow-600/30 transition"
                  >
                    <Pencil size={14} />
                    Password
                  </Link>
                  <Link
                    href={`/admin/manage-admin/edit/${admin.id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 rounded bg-yellow-600/20 text-yellow-500 text-xs font-medium hover:bg-yellow-600/30 transition"
                  >
                    Edit
                  </Link>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-red-600/20 text-red-500 text-xs font-medium hover:bg-red-600/30 transition"
                    onClick={async () => {
                      if (!confirm("Delete this admin?")) return;
                      try {
                        const res = await fetch(`/api/admins/${admin.id}`, {
                          method: "DELETE",
                        });
                        if (!res.ok) throw new Error("Delete failed");
                        setAdmins((prev) =>
                          prev.filter((x) => x.id !== admin.id)
                        );
                      } catch (err) {
                        alert("Delete failed");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
