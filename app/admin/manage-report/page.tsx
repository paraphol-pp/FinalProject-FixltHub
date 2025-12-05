"use client";

import { useState, useEffect } from "react";
import AlertModal from "../../components/AlertModal";

type Issue = {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  category: string;
  status: string;
  reporter: string;
  imageUrl: string;
};

export default function AdminManagePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/issues");
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data = await res.json();
        // Sort by ID ascending (Oldest first)
        const sortedData = data.sort((a: Issue, b: Issue) => a.id - b.id);
        setIssues(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    try {
      const res = await fetch(`/api/issues/${editingIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingIssue),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setAlertState({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Report updated successfully.",
      });
      setEditingIssue(null);
    } catch (err) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to update report.",
      });
    }
  };

  const handleDelete = (id: number) => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title: "Delete Report",
      message:
        "Are you sure you want to delete this report? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/issues/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
          setIssues((prev) => prev.filter((x) => x.id !== id));
          setAlertState({
            isOpen: true,
            type: "success",
            title: "Deleted",
            message: "Report deleted successfully.",
          });
        } catch (err) {
          setAlertState({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to delete report.",
          });
        }
      },
    });
  };

  const closeAlert = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const filteredIssues = issues.filter((issue) => {
    const q = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.reporter.toLowerCase().includes(q) ||
      issue.category.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onConfirm={alertState.onConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Main content switch */}

      {/* Table */}
      <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <h2 className="text-xl font-semibold text-white">
            List of all reports
          </h2>
          <input
            placeholder="Search by title, reporter, or category"
            className="px-4 py-2 rounded-lg bg-neutral-800 border border-white/10 text-sm text-white placeholder:text-white/50 w-full md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Edit</th>
                  <th className="px-6 py-4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((it, idx) => (
                  <tr
                    key={it.id}
                    className="border-b border-white/10 hover:bg-neutral-800/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-neutral-800 rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {it.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/90 font-medium">
                      {it.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {it.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {it.reporter}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingIssue(it)}
                        className="px-3 py-1 rounded bg-yellow-600 text-white text-sm hover:bg-yellow-700 transition"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                        onClick={() => handleDelete(it.id)}
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
            filteredIssues.map((it) => (
              <div
                key={it.id}
                className="bg-neutral-800/50 rounded-lg border border-white/5 p-4 space-y-3"
              >
                <div className="flex gap-4">
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="w-20 h-20 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-neutral-800 rounded-lg shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-white truncate">
                        {it.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80 shrink-0">
                        {it.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">
                      {it.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                      <span>{it.date}</span>
                      <span>•</span>
                      <span>{it.reporter}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      it.status === "Resolved"
                        ? "bg-green-500/20 text-green-400"
                        : it.status === "In Progress"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {it.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIssue(it)}
                      className="px-3 py-1.5 rounded bg-yellow-600/20 text-yellow-500 text-xs font-medium hover:bg-yellow-600/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(it.id)}
                      className="px-3 py-1.5 rounded bg-red-600/20 text-red-500 text-xs font-medium hover:bg-red-600/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-white/10 rounded-lg p-4 md:p-6 w-full max-w-lg mx-4 md:mx-0 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Edit Issue</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingIssue.title}
                  onChange={(e) =>
                    setEditingIssue((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Category
                </label>
                <select
                  value={editingIssue.category}
                  onChange={(e) =>
                    setEditingIssue((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Roads">Roads</option>
                  <option value="Waste">Waste</option>
                  <option value="Safety">Safety</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingIssue.location}
                  onChange={(e) =>
                    setEditingIssue((prev) =>
                      prev ? { ...prev, location: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Description
                </label>
                <textarea
                  value={editingIssue.description}
                  onChange={(e) =>
                    setEditingIssue((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Status
                </label>
                <select
                  value={editingIssue.status}
                  onChange={(e) =>
                    setEditingIssue((prev) =>
                      prev ? { ...prev, status: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/10 text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingIssue(null)}
                  className="px-4 py-2 rounded bg-neutral-800 text-white hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
