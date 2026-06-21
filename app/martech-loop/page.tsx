"use client";

import { useState, useEffect, useRef } from "react";

// ── Brand token ────────────────────────────────────────────────────────────
const PRU_RED = "#E31837";

// ── Types ──────────────────────────────────────────────────────────────────
interface AdCreative {
  id: "A" | "B";
  hook: string;
  headline: string;
  copy: string;
  cta: string;
  platforms: string[];
  ctr: number;
  bounce: number;
  isWinner?: boolean;
}

interface LeadEntry {
  name: string;
  ageGroup: string;
  intent: string;
  capturedSource: string;
  followUpSMS: string;
}

interface CampaignData {
  creativeA: AdCreative;
  creativeB: AdCreative;
  lead: LeadEntry;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK: Record<"alpha" | "beta", CampaignData> = {
  alpha: {
    creativeA: {
      id: "A",
      hook: "Emotional Hook",
      headline: "🌏 海外錢途，從這一步開始",
      copy: "身處海外，仲憂慮資產貶值？環球貨幣保障計劃幫你喺全球市場鎖定升值機遇，首年保費享10%折扣，立即行動！",
      cta: "立即了解更多",
      platforms: ["Facebook Ad Integrated", "Instagram Post Ready"],
      ctr: 4.2,
      bounce: 45,
    },
    creativeB: {
      id: "B",
      hook: "Data-Driven Hook",
      headline: "📊 97% 新興中產客戶首選 — 環球貨幣增值方案",
      copy: "數據顯示：20-40歲海外理財客群平均每年損失8.3%匯率差額。環球貨幣保障計劃透過多幣種配置對沖風險，首批客戶限享10%保費折扣。",
      cta: "免費獲取個人化方案",
      platforms: ["Facebook Ad Integrated", "Instagram Post Ready"],
      ctr: 6.8,
      bounce: 32,
      isWinner: true,
    },
    lead: {
      name: "陳浩然 (Horan Chan)",
      ageGroup: "28-35歲 · 海外專業人士",
      intent: "環球理財 / 資產保值",
      capturedSource: "Instagram Ad B Winner",
      followUpSMS:
        "陳先生，您好！🌏 感謝您對環球貨幣保障計劃的興趣！根據您的理財目標，我們為您度身訂製了一個專屬方案 💼\n\n✅ 多幣種保障（港幣 · 美元 · 英鎊）\n✅ 首年保費專享10%折扣（限時優惠）\n✅ 靈活提取，隨時因應市場調整\n\n我們的顧問將於24小時內聯絡您，安排免費一對一諮詢 📞\n\nInsurance · HK\nhttps://www.insurance.com.hk",
    },
  },
  beta: {
    creativeA: {
      id: "A",
      hook: "Emotional Hook",
      headline: "👩‍⚕️ 終身呵護，從今天開始保障您的未來",
      copy: "作為專業女性，您照顧家人的同時，有沒有好好照顧自己？全方位高端醫療方案，保費回贈高達20%，讓您安心投入每一天。",
      cta: "了解保費回贈詳情",
      platforms: ["Facebook Ad Integrated", "Instagram Post Ready"],
      ctr: 3.9,
      bounce: 51,
    },
    creativeB: {
      id: "B",
      hook: "Data-Driven Hook",
      headline: "📈 專業女性首選 — 全球頂級醫療網絡 · 保費回贈計劃",
      copy: "研究顯示：30-50歲女性專業人士醫療支出比同齡男性高出34%。全方位高端醫療方案涵蓋全球5,000+醫院，終身保障上限無限，投保即享保費回贈。",
      cta: "立即計算您的回贈金額",
      platforms: ["Facebook Ad Integrated", "Instagram Post Ready"],
      ctr: 7.1,
      bounce: 28,
      isWinner: true,
    },
    lead: {
      name: "李詠怡 (Winnie Li)",
      ageGroup: "35-42歲 · 女性專業人士",
      intent: "高端醫療保障 / 終身覆蓋",
      capturedSource: "Instagram Ad B Winner",
      followUpSMS:
        "李女士，您好！👩‍💼 感謝您查詢全方位高端醫療方案！作為重視自身保障的專業女性，您值得最好的醫療支援 🏥\n\n✅ 全球5,000+頂級醫院網絡\n✅ 終身保障，無上限賠付\n✅ 投保首年享專屬保費回贈\n✅ 專屬女性健康篩查服務\n\n我們的女性理財顧問將於今天內與您聯絡，為您提供度身訂製方案 💌\n\nInsurance · HK\nhttps://www.insurance.com.hk",
    },
  },
};

const CAMPAIGN_BRIEFS = {
  alpha:
    "環球貨幣保障計劃 — 目標客群：20-40歲海外理財新興中產；核心訴求：全球多幣種資產保值；限時優惠：首年保費10%折扣；渠道：Facebook + Instagram精準投放",
  beta: "全方位高端醫療方案 — 目標客群：30-50歲專業女性；核心訴求：終身高端醫療保障；限時優惠：投保即享保費回贈；渠道：Facebook + Instagram精準投放",
};

// ── Animated Counter ───────────────────────────────────────────────────────
function AnimatedStat({ target, suffix, duration = 1200 }: { target: number; suffix: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(parseFloat(current.toFixed(1)));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{val}{suffix}</span>;
}

// ── Progress Bar ───────────────────────────────────────────────────────────
function ProgressBar({ value, max, color, animated }: { value: number; max: number; color: string; animated: boolean }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setWidth((value / max) * 100), 100);
    return () => clearTimeout(t);
  }, [animated, value, max]);
  return (
    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
      <div className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${width}%` }} />
    </div>
  );
}

// ── Ad Card ────────────────────────────────────────────────────────────────
function AdCard({ ad, animated }: { ad: AdCreative; animated: boolean }) {
  return (
    <div className={`relative rounded-xl border flex flex-col gap-3 overflow-hidden transition-all duration-300 ${
      ad.isWinner
        ? "border-amber-400 shadow-lg shadow-amber-100"
        : "border-slate-200"
    }`}>
      {ad.isWinner && (
        <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wide">
          🏆 AI Winner Variant
        </div>
      )}
      <div className="px-4 pt-4 pb-0">
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
          ad.id === "A"
            ? "bg-slate-100 text-slate-600 border-slate-200"
            : "text-white border-transparent"
        }`}
          style={ad.id === "B" ? { backgroundColor: PRU_RED } : {}}
        >
          Creative {ad.id} · {ad.hook}
        </span>
      </div>

      {/* Mock ad preview */}
      <div className="mx-4 bg-slate-50 rounded-lg border border-slate-200 p-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: PRU_RED }}>
            I
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Insurance HK</p>
            <p className="text-[10px] text-slate-400">Sponsored · Insurance</p>
          </div>
        </div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">{ad.headline}</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">{ad.copy}</p>
        <button
          className="w-full text-white text-xs font-semibold py-1.5 rounded-md transition-colors"
          style={{ backgroundColor: PRU_RED }}
        >
          {ad.cta}
        </button>
      </div>

      {/* Platform badges */}
      <div className="px-4 flex gap-2 flex-wrap">
        {ad.platforms.map((p) => (
          <span key={p} className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
            ✓ {p}
          </span>
        ))}
      </div>

      {/* Metrics */}
      <div className="px-4 pb-4 space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">CTR</span>
            <span className={`font-bold ${ad.isWinner ? "text-amber-600" : "text-slate-700"}`}>
              {animated ? <AnimatedStat target={ad.ctr} suffix="%" /> : `${ad.ctr}%`}
            </span>
          </div>
          <ProgressBar value={ad.ctr} max={10} color={ad.isWinner ? "bg-amber-400" : "bg-slate-400"} animated={animated} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Bounce Rate</span>
            <span className={`font-bold ${ad.isWinner ? "text-emerald-600" : "text-slate-700"}`}>
              {animated ? <AnimatedStat target={ad.bounce} suffix="%" /> : `${ad.bounce}%`}
            </span>
          </div>
          <ProgressBar value={100 - ad.bounce} max={100} color={ad.isWinner ? "bg-emerald-500" : "bg-slate-400"} animated={animated} />
        </div>
      </div>
    </div>
  );
}

// ── Journey Step ───────────────────────────────────────────────────────────
function JourneyStep({ icon, label, sublabel, delay, show }: { icon: string; label: string; sublabel: string; delay: number; show: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [show, delay]);
  return (
    <div className={`flex items-start gap-3 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white shadow"
          style={{ backgroundColor: PRU_RED }}>
          {icon}
        </div>
        <div className="w-px h-5 bg-slate-200 mt-1" />
      </div>
      <div className="pt-1">
        <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

// ── Copy Button ────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 ${
        copied ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
      }`}>
      {copied ? "✅ Copied" : "📋 Copy Content"}
    </button>
  );
}

// ── Stage Card ─────────────────────────────────────────────────────────────
function StageCard({ step, icon, title, badge, children, show, delay }: {
  step: number; icon: string; title: string; badge?: string;
  children: React.ReactNode; show: boolean; delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [show, delay]);
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-700 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
          style={{ backgroundColor: PRU_RED }}>
          {step}
        </div>
        <span className="text-base">{icon}</span>
        <h2 className="font-bold text-slate-800 text-sm tracking-wide flex-1">{title}</h2>
        {badge && (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
            style={{ backgroundColor: `${PRU_RED}12`, color: PRU_RED, borderColor: `${PRU_RED}30` }}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Divider Arrow ──────────────────────────────────────────────────────────
function StageArrow({ show, delay }: { show: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [show, delay]);
  return (
    <div className={`flex justify-center transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-4 bg-slate-300" />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M6 8L0 0h12L6 8z" fill="#CBD5E1" />
        </svg>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MartechLoopPage() {
  const [brief, setBrief] = useState("");
  const [activeCampaign, setActiveCampaign] = useState<"alpha" | "beta" | null>(null);
  const [loading, setLoading] = useState(false);
  const [fired, setFired] = useState(false);
  const [showStages, setShowStages] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const selectTemplate = (key: "alpha" | "beta") => {
    setBrief(CAMPAIGN_BRIEFS[key]);
    setActiveCampaign(key);
    setFired(false);
    setShowStages(false);
  };

  const handleFire = async () => {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setFired(false);
    setShowStages(false);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setFired(true);
    setTimeout(() => {
      setShowStages(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }, 100);
  };

  const data = activeCampaign ? MOCK[activeCampaign] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── TOP NAV BAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Wordmark */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded flex items-center justify-center text-sm font-black text-white"
                style={{ backgroundColor: PRU_RED }}>
                I
              </div>
              <span className="font-black text-slate-800 text-sm tracking-tight">INSURANCE</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium tracking-wide hidden sm:block">Insurance AI MarTech Platform</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live Demo Mode
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PRU_RED }}>
            Next-Generation AI Marketing Technology
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 max-w-2xl">
            Insurance Next-Gen AI MarTech
            <br />
            <span style={{ color: PRU_RED }}>Optimization Loop</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            An end-to-end closed-loop AI engine: autonomous creative generation, multi-platform distribution,
            real-time A/B optimization, AJO-simulated personalization, and hyper-targeted lead conversion — in seconds.
          </p>
        </div>

        {/* ── CONTROL PANEL ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: PRU_RED }} />
            <h2 className="font-bold text-slate-800 text-sm">Campaign Control Panel</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Template Buttons */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Quick Campaign Templates
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["alpha", "beta"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => selectTemplate(key)}
                    className={`text-left rounded-xl border-2 px-4 py-3.5 transition-all duration-200 ${
                      activeCampaign === key
                        ? "bg-white shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                    style={activeCampaign === key ? { borderColor: PRU_RED } : {}}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{key === "alpha" ? "🌏" : "👩‍⚕️"}</span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1"
                          style={{ color: activeCampaign === key ? PRU_RED : "#94a3b8" }}>
                          Campaign {key === "alpha" ? "Alpha" : "Beta"}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                          {key === "alpha"
                            ? "環球貨幣保障計劃 (20-40歲海外理財/新興中產/10%保費折扣)"
                            : "全方位高端醫療方案 (30-50歲專業女性/注重終身保障/保費回贈)"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brief Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Campaign Focus Brief
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={3}
                placeholder="Select a template above, or type your campaign brief..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: PRU_RED } as React.CSSProperties}
                onFocus={(e) => (e.target.style.borderColor = PRU_RED)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </div>

            {/* Fire Button */}
            <button
              onClick={handleFire}
              disabled={!brief.trim() || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 ${
                loading || !brief.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
              }`}
              style={brief.trim() && !loading ? { background: `linear-gradient(135deg, ${PRU_RED}, #b91027)` } : {}}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>AI Engine Running — Generating Assets...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Fire Omnichannel AI Engine (啟動行銷閉環)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── PIPELINE ────────────────────────────────────────────────────── */}
      {fired && data && (
        <div ref={resultsRef} className="max-w-6xl mx-auto px-6 pb-20 space-y-3">

          {/* Pipeline progress bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3.5 flex items-center gap-0 overflow-x-auto">
            {[
              { n: 1, icon: "⚙️", label: "Content Hub" },
              { n: 2, icon: "📊", label: "A/B Testing" },
              { n: 3, icon: "🧠", label: "AJO Personalization" },
              { n: 4, icon: "🎯", label: "Lead Gen" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center shrink-0">
                <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${
                  showStages ? "text-white" : "bg-slate-100 text-slate-400"
                }`}
                  style={showStages ? { backgroundColor: PRU_RED, transitionDelay: `${i * 150}ms` } : { transitionDelay: `${i * 150}ms` }}>
                  <span className="font-black">{s.n}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-8 h-px mx-1 transition-all duration-500 ${showStages ? "" : "bg-slate-200"}`}
                    style={showStages ? { backgroundColor: PRU_RED, transitionDelay: `${i * 150 + 80}ms` } : {}} />
                )}
              </div>
            ))}
          </div>

          {/* STAGE 1 */}
          <StageCard step={1} icon="⚙️" title="Content Hub — AI Creative Generation" badge="Gemini AI · Live Output" show={showStages} delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdCard ad={data.creativeA} animated={showStages} />
              <AdCard ad={data.creativeB} animated={showStages} />
            </div>
          </StageCard>

          <StageArrow show={showStages} delay={350} />

          {/* STAGE 2 */}
          <StageCard step={2} icon="📊" title="Automated A/B Testing Room" badge="Real-Time Analytics" show={showStages} delay={400}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[data.creativeA, data.creativeB].map((ad) => (
                <div key={ad.id} className={`rounded-xl border p-4 ${ad.isWinner ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-sm text-slate-800">Ad Creative {ad.id}</span>
                    {ad.isWinner && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        🏆 WINNER
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "CTR", value: ad.ctr, max: 10, suffix: "%", color: ad.isWinner ? "bg-amber-400" : "bg-slate-300" },
                      { label: "Bounce Rate", value: ad.bounce, max: 100, suffix: "%", color: ad.isWinner ? "bg-emerald-500" : "bg-slate-300" },
                      { label: "Engagement Score", value: ad.isWinner ? 91 : 64, max: 100, suffix: "", color: ad.isWinner ? "bg-blue-500" : "bg-slate-300" },
                      { label: "Conversion Potential", value: ad.isWinner ? 78 : 41, max: 100, suffix: "%", color: ad.isWinner ? "bg-violet-500" : "bg-slate-300" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{m.label}</span>
                          <span className={`font-bold ${ad.isWinner ? "text-amber-600" : "text-slate-600"}`}>
                            {showStages ? <AnimatedStat target={m.value} suffix={m.suffix} /> : `${m.value}${m.suffix}`}
                          </span>
                        </div>
                        <ProgressBar value={m.value} max={m.max} color={m.color} animated={showStages} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <span className="text-lg shrink-0">🤖</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">AI Decision Engine:</span> Ad Creative B declared winner with{" "}
                <span className="font-bold">+{(data.creativeB.ctr - data.creativeA.ctr).toFixed(1)}% CTR uplift</span> and{" "}
                <span className="font-bold">{data.creativeA.bounce - data.creativeB.bounce}% lower bounce rate</span>.
                {" "}Budget auto-rebalanced to 80/20 split in favour of Ad B. Scaling initiated.
              </p>
            </div>
          </StageCard>

          <StageArrow show={showStages} delay={750} />

          {/* STAGE 3 */}
          <StageCard step={3} icon="🧠" title="Simulated Adobe Journey Optimizer (AJO)" badge="Dynamic Personalization" show={showStages} delay={800}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-0">
                {[
                  { icon: "👆", label: "User Clicked Winner Ad B", sublabel: "Instagram · Mobile · 14:32 HKT", delay: 900 },
                  { icon: "🔍", label: "System Analyzed User Profile",
                    sublabel: activeCampaign === "alpha" ? "Segment: Young Professional · 海外理財意向 High" : "Segment: Female Professional 35-42 · 醫療需求 High",
                    delay: 1100 },
                  { icon: "🎁", label: "Next Best Offer Triggered",
                    sublabel: activeCampaign === "alpha" ? "Pushed: 環球貨幣計劃 + 10%折扣 landing page" : "Pushed: 高端醫療方案 + 保費回贈 landing page",
                    delay: 1300 },
                  { icon: "🏷️", label: "Personalized Landing Page Activated",
                    sublabel: activeCampaign === "alpha" ? "Active Banner: 「首年保費10%折扣 — 限時優惠」" : "Active Banner: 「投保即享保費回贈 — 女性專屬計劃」",
                    delay: 1500 },
                  { icon: "✅", label: "Journey Sequence Confirmed", sublabel: "AJO orchestration complete · 98ms end-to-end latency", delay: 1700 },
                ].map((step) => (
                  <JourneyStep key={step.label} {...step} show={showStages} />
                ))}
              </div>

              {/* Console */}
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 ml-1">AJO Orchestration Console</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { c: "text-slate-500", t: "[14:32:01] trigger:ad_click · variant=B" },
                    { c: "text-blue-400",  t: "[14:32:01] profile:lookup · id=USR_8821" },
                    { c: "text-blue-400",  t: "[14:32:01] segment:match → YOUNG_PROF_HK" },
                    { c: "text-amber-400", t: "[14:32:02] journey:SELECT → premium_onboard_v3" },
                    { c: "text-amber-400", t: `[14:32:02] offer:PUSH → ${activeCampaign === "alpha" ? "CURR_PLAN_10PCT_DISC" : "MED_PLAN_REBATE"}` },
                    { c: "text-violet-400",t: "[14:32:02] landing:ACTIVATE · banner=PROMO_ACTIVE" },
                    { c: "text-violet-400",t: "[14:32:02] sms:QUEUE · template=FOLLOWUP_v2" },
                    { c: "text-emerald-400 font-bold", t: "[14:32:02] STATUS → JOURNEY_COMPLETE ✓" },
                  ].map((row, i) => (
                    <p key={i} className={row.c}>{row.t}</p>
                  ))}
                </div>
              </div>
            </div>
          </StageCard>

          <StageArrow show={showStages} delay={1150} />

          {/* STAGE 4 */}
          <StageCard step={4} icon="🎯" title="Hyper-Personalized Lead Gen Output" badge="Lead Captured ✓" show={showStages} delay={1200}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Lead Card */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2"
                  style={{ backgroundColor: `${PRU_RED}08` }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: PRU_RED }}>
                    New Lead Captured
                  </span>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label: "Name", value: data.lead.name },
                    { label: "Age Group", value: data.lead.ageGroup },
                    { label: "Intent", value: data.lead.intent },
                    { label: "Source", value: data.lead.capturedSource },
                    { label: "Timestamp", value: new Date().toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" }) + " HKT" },
                    { label: "Lead Score", value: "87 / 100 · High Intent 🔥" },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-3 text-sm">
                      <span className="text-slate-400 w-24 shrink-0 text-xs pt-0.5">{row.label}</span>
                      <span className="text-slate-800 font-semibold text-xs leading-relaxed">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Preview */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    📱 Follow-Up Message
                  </span>
                  <CopyButton text={data.lead.followUpSMS} />
                </div>
                <div className="flex-1 bg-[#ECE5DD] p-3">
                  <div className="bg-white rounded-xl rounded-tl-sm shadow-sm p-3 max-w-[90%]">
                    <p className="text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">{data.lead.followUpSMS}</p>
                    <p className="text-[9px] text-slate-400 text-right mt-1.5">
                      {new Date().toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong" })} ✓✓
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Time to Lead", value: "< 2s", sub: "End-to-end", icon: "⚡" },
                { label: "Pipeline Stages", value: "4 / 4", sub: "Completed", icon: "✅" },
                { label: "Personalization", value: "Hyper", sub: "AI-driven", icon: "🧠" },
                { label: "MarTech ROI", value: "+340%", sub: "vs. manual", icon: "📈" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:shadow-sm transition-shadow">
                  <div className="text-2xl mb-2">{kpi.icon}</div>
                  <div className="text-xl font-black text-slate-900">{kpi.value}</div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">{kpi.label}</div>
                  <div className="text-[10px] text-slate-400">{kpi.sub}</div>
                </div>
              ))}
            </div>
          </StageCard>

          {/* Reset */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setBrief(""); setActiveCampaign(null); setFired(false); setShowStages(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
            >
              ↑ Reset and run a new campaign
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white"
              style={{ backgroundColor: PRU_RED }}>I</div>
            <span className="text-xs text-slate-400">Insurance HK · AI MarTech Optimization Loop · PoC Demo</span>
          </div>
          <span className="text-[11px] text-slate-300 hidden sm:block">Confidential · Internal Use Only</span>
        </div>
      </footer>
    </div>
  );
}
