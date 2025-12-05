"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X, AlertTriangle } from "lucide-react";

type AlertType = "success" | "error" | "confirm";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: AlertModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); 
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-neutral-900 border border-white/10 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {type === "success" && (
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/50">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
            {type === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/50">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            )}
            {type === "confirm" && (
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/50">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/60 mb-6">{message}</p>

          {type === "confirm" ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition"
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-2.5 rounded-lg font-medium transition ${
                type === "success"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {type === "success" ? "Continue" : "Try Again"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
