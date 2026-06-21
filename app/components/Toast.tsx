"use client";

import { useEffect } from "react";
import { X, Bell } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function PushToast({ visible, onClose }: Props) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 6000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 w-80 transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}
    >
      {/* iPhone-style notification card */}
      <div className="bg-[#1c1c1e]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="w-7 h-7 bg-[#007A48] rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/50 text-[11px] font-medium uppercase tracking-widest truncate">
              Manulife Intel Hub
            </p>
          </div>
          <span className="text-white/30 text-[11px]">now</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message */}
        <div className="px-4 pb-4 pt-1">
          <p className="text-white font-semibold text-[13px] leading-snug">
            🔔 [AI Alert] Insurance Co. B just published their 2026 report.
          </p>
          <p className="text-white/60 text-[12px] mt-1 leading-snug">
            Local impact detected for HK & VN markets. Tap to view full AI analysis.
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/10 relative overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full bg-[#007A48] transition-all ease-linear ${visible ? "w-0" : "w-full"}`}
            style={{ transitionDuration: visible ? "6000ms" : "0ms" }}
          />
        </div>
      </div>
    </div>
  );
}
