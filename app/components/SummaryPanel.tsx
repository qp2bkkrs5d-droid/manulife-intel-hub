"use client";

import AIChart from "./AIChart";
import { Competitor } from "./CompetitorCard";
import { Brain, Loader2 } from "lucide-react";

interface Props {
  competitor: Competitor | null;
  summary: string;
  isLoading: boolean;
}

function MarkdownSummary({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-[#007A48] font-bold text-base mt-4 mb-1 border-b border-[#007A48]/20 pb-1">
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold text-slate-800 mt-3">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="pl-4 before:content-['▸'] before:text-[#007A48] before:mr-2 before:text-xs">
              {line.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          );
        }
        if (line.startsWith("---")) {
          return <hr key={i} className="border-slate-200 my-3" />;
        }
        if (line.startsWith("*") && line.endsWith("*")) {
          return <p key={i} className="text-xs text-slate-400 italic mt-4">{line.replace(/\*/g, "")}</p>;
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
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
            <span className="ml-auto text-xs text-slate-400 truncate max-w-[180px]">
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
            <MarkdownSummary text={summary} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
              <Brain className="w-10 h-10 text-slate-200" />
              <p className="text-slate-400 text-sm">
                Select a competitor from the feed and click{" "}
                <span className="font-medium text-[#007A48]">Interactive Preview</span>{" "}
                to generate an AI intelligence report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
