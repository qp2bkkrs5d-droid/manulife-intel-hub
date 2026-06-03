"use client";

import { FileText, Zap, ChevronRight, Clock } from "lucide-react";

export interface Competitor {
  id: string;
  company: string;
  report: string;
  date: string;
  isNew: boolean;
  isProcessed: boolean;
  markets: string[];
}

interface Props {
  competitor: Competitor;
  isActive: boolean;
  onSelect: (c: Competitor) => void;
  isLoading: boolean;
}

export default function CompetitorCard({ competitor, isActive, onSelect, isLoading }: Props) {
  return (
    <div
      className={`
        rounded-xl border p-4 cursor-pointer transition-all duration-200
        ${isActive
          ? "border-[#007A48] bg-[#007A48]/10 shadow-lg shadow-[#007A48]/10"
          : "border-slate-200 bg-white hover:border-[#007A48]/40 hover:shadow-md"
        }
      `}
      onClick={() => onSelect(competitor)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isActive ? "bg-[#007A48]/20" : "bg-slate-100"}`}>
            <FileText className={`w-4 h-4 ${isActive ? "text-[#007A48]" : "text-slate-500"}`} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm leading-tight">{competitor.company}</p>
            <p className="text-slate-500 text-xs mt-0.5">{competitor.report}</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform ${isActive ? "text-[#007A48] rotate-90" : "text-slate-300"}`} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {competitor.isNew && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full">
            New
          </span>
        )}
        {competitor.isProcessed && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full">
            <Zap className="w-2.5 h-2.5" /> AI Processed
          </span>
        )}
        {competitor.markets.map((m) => (
          <span key={m} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
            {m}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Clock className="w-3 h-3" />
          {competitor.date}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(competitor); }}
          className={`
            text-xs font-medium px-3 py-1 rounded-lg border transition-all
            ${isActive
              ? "bg-[#007A48] text-white border-[#007A48]"
              : "text-[#007A48] border-[#007A48]/40 hover:bg-[#007A48] hover:text-white"
            }
            ${isLoading && isActive ? "opacity-50 cursor-wait" : ""}
          `}
          disabled={isLoading && isActive}
        >
          {isLoading && isActive ? "Analysing…" : "Interactive Preview"}
        </button>
      </div>
    </div>
  );
}
