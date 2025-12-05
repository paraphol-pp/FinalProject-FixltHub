"use client";

import { useState, useEffect } from "react";
import AlertModal from "../../components/AlertModal";

type ContactMessage = {
  id: number;
  firstName: string;
  lastName: string;
  message: string;
  createdAt: string;
};

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(
    null
  );

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
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          // Sort by ID ascending (Oldest first)
          const sortedData = data.sort(
            (a: ContactMessage, b: ContactMessage) => a.id - b.id
          );
          setMessages(sortedData);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const closeAlert = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (id: number) => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title: "Delete Message",
      message: "Are you sure you want to delete this message?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/contact/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
            setAlertState({
              isOpen: true,
              type: "success",
              title: "Deleted",
              message: "Message deleted successfully.",
            });
          } else {
            throw new Error("Failed to delete message");
          }
        } catch (error) {
          console.error("Error deleting message:", error);
          setAlertState({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to delete message.",
          });
        }
      },
    });
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.firstName.toLowerCase().includes(q) ||
      msg.lastName.toLowerCase().includes(q)
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

      <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
          <input
            placeholder="Search by first name or last name"
            className="px-4 py-2 rounded-lg bg-neutral-800 border border-white/10 text-sm text-white placeholder:text-white/50 w-full md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-white/60">Loading...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 text-center text-white/60">
              No messages found.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-white/60 border-b border-white/10 bg-neutral-800/50">
                  <th className="px-6 py-4">No.</th>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">Last Name</th>
                  <th className="px-6 py-4 w-1/3">Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg, idx) => (
                  <tr
                    key={msg.id}
                    className="border-b border-white/10 hover:bg-neutral-800/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {formatName(msg.firstName)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {formatName(msg.lastName)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-white/90 font-medium max-w-[300px] truncate cursor-pointer hover:text-white"
                      onClick={() => setViewingMessage(msg)}
                      title="Click to view full message"
                    >
                      {msg.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
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
          ) : filteredMessages.length === 0 ? (
            <div className="py-8 text-center text-white/60">
              No messages found.
            </div>
          ) : (
            filteredMessages.map((msg, idx) => (
              <div
                key={msg.id}
                className="bg-neutral-800/50 rounded-lg border border-white/5 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white truncate">
                      {formatName(msg.firstName)} {formatName(msg.lastName)}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(msg.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className="bg-neutral-900/50 rounded p-3 text-sm text-white/80 line-clamp-2 cursor-pointer hover:text-white transition"
                  onClick={() => setViewingMessage(msg)}
                >
                  {msg.message}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setViewingMessage(msg)}
                    className="flex-1 px-3 py-2 rounded bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition"
                  >
                    View Message
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="flex-1 px-3 py-2 rounded bg-red-600/20 text-red-500 text-xs font-medium hover:bg-red-600/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-lg p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Message Details</h3>
              <button
                onClick={() => setViewingMessage(null)}
                className="text-white/60 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  From
                </label>
                <p className="text-white font-medium">
                  {formatName(viewingMessage.firstName)}{" "}
                  {formatName(viewingMessage.lastName)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Date
                </label>
                <p className="text-white/80 text-sm">
                  {new Date(viewingMessage.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Message
                </label>
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/5 text-white/90 text-sm leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {viewingMessage.message}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingMessage(null)}
                className="px-4 py-2 rounded bg-neutral-800 text-white hover:bg-neutral-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
