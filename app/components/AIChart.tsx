"use client";

const bars = [
  { label: "Q1", aia: 62, pru: 48, manu: 55 },
  { label: "Q2", aia: 71, pru: 53, manu: 61 },
  { label: "Q3", aia: 68, pru: 58, manu: 64 },
  { label: "Q4", aia: 83, pru: 62, manu: 72 },
  { label: "Q1'25", aia: 88, pru: 67, manu: 79 },
  { label: "Q2'25", aia: 95, pru: 71, manu: 85 },
];

const MAX = 100;

export default function AIChart() {
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">AI Chart Analysis</p>
          <h3 className="text-white font-semibold text-sm mt-0.5">
            NBV Growth Index — Regional Competitors
          </h3>
        </div>
        <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">
          AI Generated
        </span>
      </div>

      {/* Chart area */}
      <div className="flex items-end gap-3 h-36 mt-2">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 w-full h-28">
              <div
                className="flex-1 rounded-sm bg-red-500/70 transition-all duration-700"
                style={{ height: `${(b.aia / MAX) * 100}%` }}
                title={`Insurance Co. A: ${b.aia}`}
              />
              <div
                className="flex-1 rounded-sm bg-blue-500/70 transition-all duration-700"
                style={{ height: `${(b.pru / MAX) * 100}%` }}
                title={`Insurance Co. B: ${b.pru}`}
              />
              <div
                className="flex-1 rounded-sm bg-emerald-500/70 transition-all duration-700"
                style={{ height: `${(b.manu / MAX) * 100}%` }}
                title={`Manulife: ${b.manu}`}
              />
            </div>
            <span className="text-slate-500 text-[10px]">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700">
        {[
          { color: "bg-red-500", label: "Insurance Co. A" },
          { color: "bg-blue-500", label: "Insurance Co. B" },
          { color: "bg-emerald-500", label: "Manulife" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-slate-400 text-[11px]">{l.label}</span>
          </div>
        ))}
        <span className="ml-auto text-slate-600 text-[10px] italic">
          Simulated index • public disclosures
        </span>
      </div>
    </div>
  );
}
