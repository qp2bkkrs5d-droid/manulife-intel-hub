"use client";

import AIChart from "./AIChart";
import { Competitor } from "./CompetitorCard";
import {
  Brain,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Zap,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";

// ── Parsers ────────────────────────────────────────────────────────────────

interface Metric { label: string; value: string; trend: "up" | "down" | "neutral" }
interface Market { code: string; text: string }
interface Action { priority: "HIGH" | "MEDIUM" | "LOW"; title: string; detail: string }

function parseMetrics(lines: string[]): Metric[] {
  return lines
    .filter((l) => l.startsWith("METRIC:"))
    .map((l) => {
      const parts = l.replace("METRIC:", "").split("|").map((s) => s.trim());
      return {
        label: parts[0] ?? "",
        value: parts[1] ?? "",
        trend: (parts[2] as Metric["trend"]) ?? "neutral",
      };
    });
}

function parseMarkets(lines: string[]): Market[] {
  return lines
    .filter((l) => l.startsWith("MARKET:"))
    .map((l) => {
      const inner = l.replace("MARKET:", "").trim();
      const idx = inner.indexOf("|");
      return {
        code: inner.slice(0, idx).trim(),
        text: inner.slice(idx + 1).trim(),
      };
    });
}

function parseActions(lines: string[]): Action[] {
  return lines
    .filter((l) => l.startsWith("ACTION:"))
    .map((l) => {
      const parts = l.replace("ACTION:", "").split("|").map((s) => s.trim());
      return {
        priority: (parts[0] as Action["priority"]) ?? "MEDIUM",
        title: parts[1] ?? "",
        detail: parts[2] ?? "",
      };
    });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MetricCard({ m }: { m: Metric }) {
  const isUp = m.trend === "up";
  const isDown = m.trend === "down";
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium leading-tight truncate">
          {m.label}
        </span>
        {isUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
        {isDown && <TrendingDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
        {!isUp && !isDown && <Minus className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
      </div>
      <p className={`font-bold text-base leading-tight ${isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-slate-700"}`}>
        {m.value}
      </p>
    </div>
  );
}

const MARKET_FLAGS: Record<string, string> = {
  HK: "🇭🇰", VN: "🇻🇳", PH: "🇵🇭", SG: "🇸🇬",
  MY: "🇲🇾", TH: "🇹🇭", ID: "🇮🇩", JP: "🇯🇵", CN: "🇨🇳",
};

function MarketPill({ m }: { m: Market }) {
  return (
    <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5">
      <span className="text-lg leading-none mt-0.5 flex-shrink-0">
        {MARKET_FLAGS[m.code] ?? "🌏"}
      </span>
      <div className="min-w-0">
        <span className="font-bold text-blue-700 text-xs uppercase tracking-wide">{m.code}</span>
        <p className="text-slate-600 text-xs leading-snug mt-0.5"
          dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
        />
      </div>
    </div>
  );
}

const ACTION_STYLES = {
  HIGH: {
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700 border-red-300",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />,
    dot: "bg-red-500",
  },
  MEDIUM: {
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    icon: <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />,
    dot: "bg-amber-500",
  },
  LOW: {
    bg: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-600 border-slate-300",
    icon: <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />,
    dot: "bg-slate-400",
  },
};

function ActionCard({ a, idx }: { a: Action; idx: number }) {
  const s = ACTION_STYLES[a.priority];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${s.bg}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${s.dot}`}>
        {idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${s.badge}`}>
            {a.priority}
          </span>
          <span className="font-semibold text-slate-800 text-sm">{a.title}</span>
        </div>
        <p className="text-slate-600 text-xs leading-snug">{a.detail}</p>
      </div>
      {s.icon}
    </div>
  );
}

// ── Plain text section renderer ────────────────────────────────────────────

function renderInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{p}</strong> : p
  );
}

function ProseSection({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-1.5">
      {lines
        .filter((l) => !l.startsWith("METRIC:") && !l.startsWith("MARKET:") && !l.startsWith("ACTION:") && !l.startsWith("##") && !l.startsWith("---"))
        .map((line, i) => {
          if (line.trim() === "") return null;
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="font-semibold text-slate-700 text-sm mt-3 mb-1">
                {line.replace(/\*\*/g, "")}
              </p>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-[#007A48] mt-1 flex-shrink-0 text-xs">▸</span>
                <span className="leading-snug">{renderInline(line.replace(/^- /, ""))}</span>
              </div>
            );
          }
          if (line.startsWith("*") && line.endsWith("*")) {
            return (
              <div key={i} className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <p className="text-[11px] text-slate-400 italic">{line.replace(/\*/g, "")}</p>
              </div>
            );
          }
          return (
            <p key={i} className="text-sm text-slate-600 leading-relaxed">
              {renderInline(line)}
            </p>
          );
        })}
    </div>
  );
}

// ── Main visual renderer ───────────────────────────────────────────────────

function VisualSummary({ text }: { text: string }) {
  const lines = text.split("\n");

  // Split into sections by ## headings
  const sections: Array<{ title: string; lines: string[] }> = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace("## ", "").trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  const sectionIcons: Record<string, string> = {
    "Executive Summary": "📊",
    "Agency Strategy Shifts": "🎯",
    "Market Intelligence": "🗺️",
    "Recommended Actions for Manulife": "⚡",
  };

  return (
    <div className="space-y-5">
      {sections.map((sec) => {
        const metrics = parseMetrics(sec.lines);
        const markets = parseMarkets(sec.lines);
        const actions = parseActions(sec.lines);
        const icon = sectionIcons[sec.title] ?? "📌";

        return (
          <div key={sec.title} className="space-y-3">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{icon}</span>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">{sec.title}</h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Metric cards grid */}
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {metrics.map((m) => <MetricCard key={m.label} m={m} />)}
              </div>
            )}

            {/* Market pills */}
            {markets.length > 0 && (
              <div className="space-y-2">
                {markets.map((m) => <MarketPill key={m.code} m={m} />)}
              </div>
            )}

            {/* Action cards */}
            {actions.length > 0 && (
              <div className="space-y-2">
                {actions.map((a, idx) => <ActionCard key={idx} a={a} idx={idx} />)}
              </div>
            )}

            {/* Prose / bullets */}
            <ProseSection lines={sec.lines} />
          </div>
        );
      })}
    </div>
  );
}

// ── Panel shell ────────────────────────────────────────────────────────────

interface Props {
  competitor: Competitor | null;
  summary: string;
  isLoading: boolean;
}

export default function SummaryPanel({ competitor, summary, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <AIChart />

      <div className="bg-white rounded-xl border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <Brain className="w-4 h-4 text-[#007A48]" />
          <span className="text-sm font-semibold text-slate-700">AI Deep Dive</span>
          {competitor && (
            <span className="ml-auto text-xs text-slate-400 truncate max-w-[200px]">
              {competitor.company} · {competitor.report}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 className="w-8 h-8 text-[#007A48] animate-spin" />
              <p className="text-slate-500 text-sm">Gemini is generating your intelligence report…</p>
            </div>
          ) : summary ? (
            <VisualSummary text={summary} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
              <Brain className="w-10 h-10 text-slate-200" />
              <p className="text-slate-400 text-sm">
                Select a competitor and click{" "}
                <span className="font-medium text-[#007A48]">Interactive Preview</span>{" "}
                to generate a visual intelligence report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
