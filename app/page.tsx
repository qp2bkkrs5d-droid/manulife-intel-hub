"use client";

import { useState, useCallback } from "react";
import {
  Activity,
  BellRing,
  Building2,
  FileBarChart2,
  Globe,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import CompetitorCard, { Competitor } from "./components/CompetitorCard";
import SummaryPanel from "./components/SummaryPanel";
import PushToast from "./components/Toast";
import MDRTOverlay from "./components/MDRTOverlay";

const COMPETITORS: Competitor[] = [
  {
    id: "aia-2026-ar",
    company: "AIA Group",
    report: "2026 H1 Strategy & Interim Disclosure",
    date: "18 Jun 2026",
    isNew: true,
    isProcessed: true,
    markets: ["HK", "VN", "PH", "TH"],
  },
  {
    id: "pru-2026-q1",
    company: "Prudential plc",
    report: "Q1 2026 Financial Results",
    date: "14 Jun 2026",
    isNew: true,
    isProcessed: true,
    markets: ["HK", "SG", "MY"],
  },
  {
    id: "sunlife-2026",
    company: "Sun Life Asia",
    report: "2026 Asia Growth Strategy Update",
    date: "10 Jun 2026",
    isNew: true,
    isProcessed: true,
    markets: ["PH", "VN", "HK"],
  },
  {
    id: "great-eastern-2026",
    company: "Great Eastern Holdings",
    report: "2026 Annual General Meeting Report",
    date: "5 Jun 2026",
    isNew: false,
    isProcessed: true,
    markets: ["SG", "MY", "ID"],
  },
  {
    id: "fwd-2026",
    company: "FWD Group",
    report: "2026 Regional Expansion Briefing",
    date: "28 May 2026",
    isNew: false,
    isProcessed: false,
    markets: ["HK", "TH", "ID", "VN"],
  },
];

const METRICS = [
  {
    icon: Building2,
    label: "Competitors Tracked",
    value: "5",
    sub: "AIA · Prudential · Sun Life · Great Eastern · FWD",
    color: "text-[#007A48]",
    bg: "bg-[#007A48]/10",
  },
  {
    icon: FileBarChart2,
    label: "Reports Processed This Month",
    value: "14",
    sub: "+3 since last week",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Activity,
    label: "Active Notifications",
    value: "On",
    sub: "CAO mobile alerts enabled",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: TrendingUp,
    label: "AI Insights Generated",
    value: "47",
    sub: "This quarter",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function HomePage() {
  const [activeCompetitor, setActiveCompetitor] = useState<Competitor | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [mdrtOpen, setMdrtOpen] = useState(false);

  const handleSelect = useCallback(async (c: Competitor) => {
    setActiveCompetitor(c);
    setIsLoading(true);
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorName: c.company, reportType: c.report }),
      });
      const data = await res.json();
      setSummary(data.summary ?? data.error ?? "No summary returned.");
    } catch {
      setSummary("Error contacting AI service. Please check your API key configuration.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToast = useCallback(() => {
    setToastVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setToastVisible(true));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#007A48] text-white shadow-xl">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2.5 rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight">
                  Sonny Demo for Regional Market &amp; Competitor Intelligence Hub (AI Transformation PoC)
                </h1>
                <p className="text-white/60 text-xs mt-0.5 font-medium tracking-wide">
                  AI Transformation PoC · For Management Review
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setMdrtOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/30"
              >
                🏆 2026 MDRT Ranking
              </button>
              <span className="flex items-center gap-1.5 text-xs bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Grade
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-full">
                <Activity className="w-3.5 h-3.5" /> Live Demo Mode
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          {/* Mobile MDRT button */}
          <div className="md:hidden mb-3">
            <button
              onClick={() => setMdrtOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-4 py-2.5 rounded-xl transition-all shadow"
            >
              🏆 2026 MDRT Ranking — Top 10 Asia
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${m.bg}`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wider font-medium leading-none mb-0.5">
                    {m.label}
                  </p>
                  <p className={`font-bold text-xl leading-none ${m.color}`}>{m.value}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Competitor Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-widest">
              Monitored Competitors Feed
            </h2>
            <span className="text-xs text-slate-400">{COMPETITORS.length} sources</span>
          </div>
          <div className="flex flex-col gap-3">
            {COMPETITORS.map((c) => (
              <CompetitorCard
                key={c.id}
                competitor={c}
                isActive={activeCompetitor?.id === c.id}
                onSelect={handleSelect}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Right — AI Deep Dive */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-widest">
              AI Deep Dive &amp; Visual Summary Room
            </h2>
            <span className="text-xs text-slate-400">Gemini 2.5 Flash · Enterprise</span>
          </div>
          <SummaryPanel
            competitor={activeCompetitor}
            summary={summary}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs text-center md:text-left">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#007A48]" />
            Powered by Gemini Enterprise API. Data ingestion strictly adheres to public disclosure information security policies.
          </p>
          <p className="text-slate-300 text-xs">© 2025 Manulife Financial Corporation · Internal PoC Only</p>
        </div>
      </footer>

      {/* Floating Notification Button */}
      <button
        onClick={handleToast}
        className="
          fixed bottom-6 right-6 z-40
          flex items-center gap-2.5
          bg-[#007A48] hover:bg-[#005f37]
          text-white font-semibold text-sm
          px-4 py-3 rounded-2xl shadow-xl
          transition-all duration-200 hover:scale-105 active:scale-95
          border border-white/20
        "
      >
        <BellRing className="w-4 h-4 animate-bounce" />
        Simulate Push Notification to CAO Mobile
      </button>

      <PushToast visible={toastVisible} onClose={() => setToastVisible(false)} />
      <MDRTOverlay open={mdrtOpen} onClose={() => setMdrtOpen(false)} />
    </div>
  );
}
