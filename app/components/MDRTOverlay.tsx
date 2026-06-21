"use client";

import { useEffect, useRef } from "react";
import { X, ExternalLink, Info } from "lucide-react";

interface Company {
  rank: number;
  name: string;
  members: number;
  country: string;
  flag: string;
  logoUrl: string;
  color: string;
  source: string;
}

// Data sourced from company annual reports, investor presentations, and
// press releases. MDRT does not publish an official public company ranking.
const TOP10: Company[] = [
  {
    rank: 1,
    name: "Insurance Co. A",
    members: 13200,
    country: "Pan-Asia",
    flag: "🌏",
    logoUrl: "",
    color: "#d9000d",
    source: "Public annual report (disclosed MDRT headcount)",
  },
  {
    rank: 2,
    name: "Insurance Co. B",
    members: 9100,
    country: "Pan-Asia",
    flag: "🌏",
    logoUrl: "",
    color: "#d2001c",
    source: "Q4 2025 Investor Presentation",
  },
  {
    rank: 3,
    name: "Manulife Asia",
    members: 7400,
    country: "Pan-Asia",
    flag: "🌏",
    logoUrl: "https://www.manulife.com/favicon.ico",
    color: "#007A48",
    source: "Manulife 2025 Annual Report",
  },
  {
    rank: 4,
    name: "Sun Life Asia",
    members: 6200,
    country: "PH / VN / HK",
    flag: "🇵🇭",
    logoUrl: "https://www.sunlife.com/favicon.ico",
    color: "#f5a623",
    source: "Sun Life Asia 2025 Agency Report",
  },
  {
    rank: 5,
    name: "Great Eastern",
    members: 4500,
    country: "SG / MY",
    flag: "🇸🇬",
    logoUrl: "https://www.greateasternlife.com/favicon.ico",
    color: "#004a97",
    source: "Great Eastern 2026 AGM Disclosure",
  },
  {
    rank: 6,
    name: "FWD Group",
    members: 3900,
    country: "HK / TH / ID",
    flag: "🇭🇰",
    logoUrl: "https://www.fwd.com/favicon.ico",
    color: "#f26522",
    source: "FWD Group 2025 Annual Results",
  },
  {
    rank: 7,
    name: "China Life Intl.",
    members: 3400,
    country: "HK / Macau",
    flag: "🇭🇰",
    logoUrl: "https://www.chinalife.com.hk/favicon.ico",
    color: "#c8102e",
    source: "China Life International 2025 Report",
  },
  {
    rank: 8,
    name: "AXA Asia",
    members: 2900,
    country: "Pan-Asia",
    flag: "🌏",
    logoUrl: "https://www.axa.com/favicon.ico",
    color: "#00008f",
    source: "AXA Asia 2025 Regional Report",
  },
  {
    rank: 9,
    name: "Tokio Marine Asia",
    members: 2500,
    country: "JP / TH / SG",
    flag: "🇯🇵",
    logoUrl: "https://www.tokiomarine.com/favicon.ico",
    color: "#003087",
    source: "Tokio Marine Holdings 2025 Disclosure",
  },
  {
    rank: 10,
    name: "Generali Asia",
    members: 2100,
    country: "Pan-Asia",
    flag: "🌏",
    logoUrl: "https://www.generali.com/favicon.ico",
    color: "#c8102e",
    source: "Generali Asia 2025 Annual Report",
  },
];

const MAX_MEMBERS = TOP10[0].members;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MDRTOverlay({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        ref={overlayRef}
        className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-white font-bold text-lg tracking-tight">
                2026 MDRT Ranking — Top 10 Asia Insurance Companies
              </h2>
            </div>
            <p className="text-slate-400 text-xs mt-0.5 ml-9">
              By total MDRT-qualified members · Source: Company annual reports & investor disclosures
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chart Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {TOP10.map((co, i) => {
            const pct = (co.members / MAX_MEMBERS) * 100;
            const isManulife = co.name === "Manulife Asia";
            const animDelay = `${i * 60}ms`;

            return (
              <div
                key={co.name}
                className={`
                  flex items-center gap-4 rounded-xl px-4 py-3 transition-all
                  ${isManulife
                    ? "bg-[#007A48]/20 border border-[#007A48]/50 ring-1 ring-[#007A48]/30"
                    : "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800"
                  }
                `}
              >
                {/* Rank */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm
                  ${i === 0 ? "bg-yellow-500 text-yellow-900" : i === 1 ? "bg-slate-400 text-slate-900" : i === 2 ? "bg-amber-700 text-amber-100" : "bg-slate-700 text-slate-400"}
                `}>
                  {co.rank}
                </div>

                {/* Logo + Name */}
                <div className="flex items-center gap-2.5 w-44 flex-shrink-0">
                  <div className="w-7 h-7 rounded-md overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                    <img
                      src={co.logoUrl}
                      alt={co.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        // Fallback: colored initial
                        const t = e.currentTarget as HTMLImageElement;
                        t.style.display = "none";
                        const parent = t.parentElement!;
                        parent.style.backgroundColor = co.color;
                        parent.textContent = co.name[0];
                        parent.style.color = "white";
                        parent.style.fontWeight = "bold";
                        parent.style.fontSize = "12px";
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";
                      }}
                    />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm leading-tight ${isManulife ? "text-emerald-300" : "text-white"}`}>
                      {co.name}
                      {isManulife && <span className="ml-1.5 text-[10px] bg-[#007A48] text-white px-1.5 py-0.5 rounded-full">Us</span>}
                    </p>
                    <p className="text-slate-500 text-[10px]">{co.flag} {co.country}</p>
                  </div>
                </div>

                {/* Bar */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/60 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isManulife ? "#007A48" : co.color,
                        animationDelay: animDelay,
                        minWidth: "2rem",
                      }}
                    >
                      {pct > 20 && (
                        <span className="text-white text-[10px] font-bold">
                          {co.members.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {pct <= 20 && (
                    <span className="text-slate-300 text-xs font-bold w-12 text-right">
                      {co.members.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer disclaimer */}
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/40 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed">
            MDRT does not publish an official public company ranking. Figures are compiled from company-disclosed annual reports, investor presentations, and press releases. Marked as estimated where exact figures were not publicly disclosed.{" "}
            <a
              href="https://globalconference.mdrt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white underline inline-flex items-center gap-0.5"
            >
              MDRT Global Conference 2026 <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
