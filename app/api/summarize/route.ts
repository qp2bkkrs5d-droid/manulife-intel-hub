import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Chief Financial Analyst & Strategy Director at Manulife Asia.
Analyze the competitor data provided. Output a highly professional executive summary in English.
Focus strictly on strategic implications for insurance agency management, recruitment, and multi-market localization.
Structure your response with these exact sections using markdown:

## Executive Summary
## Agency Strategy Shifts
(Include MDRT growth plans, agent productivity targets, digital tool investments)
## Local Market Implications
(Focus on HK, VN, PH markets and any other relevant Asian markets)
## Recommended Actions for Manulife

Use professional financial language. Be concise but substantive. Include specific numbers and percentages where relevant.
Pull from the most recent 2026 publicly available disclosures, announcements, and filings where possible.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Return a rich mock response for PoC demo when no key is configured
    return NextResponse.json({ summary: getMockSummary() });
  }

  try {
    const body = await req.json();
    const { competitorName, reportType } = body as {
      competitorName: string;
      reportType?: string;
    };

    if (!competitorName) {
      return NextResponse.json(
        { error: "competitorName is required" },
        { status: 400 }
      );
    }

    const userPrompt = `Competitor: ${competitorName}
Report Type: ${reportType ?? "Annual Report / Latest 2026 Disclosure"}

Please analyze the most recent publicly available financial disclosures, strategic announcements, and press releases from ${competitorName} — prioritizing any 2026 data. If 2026 data is not yet available, use the most recent available (2025 or late 2024).
Generate a comprehensive intelligence report in English following the system instructions.`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Gemini API request failed", detail: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No content returned.";

    return NextResponse.json({ summary: text });
  } catch (err) {
    console.error("Summarize route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getMockSummary(): string {
  return `## Executive Summary

AIA Group's latest 2026 disclosures indicate New Business Value (NBV) growth of 21.4% YoY, reaching HKD 7.8 billion for the trailing twelve months. Active agent headcount has expanded to 3.4 million globally, with Asia-Pacific representing 74% of the total force. The group continues to invest heavily in its "Premier Agency" elite training program, achieving MDRT qualification rates 2.6x the industry average — a meaningful competitive threat to Manulife's agency recruitment pipeline.

---

## Agency Strategy Shifts

**MDRT Growth Plans**
- AIA has set a 2026 target of 45% growth in MDRT-qualified agents, focused on HK, VN, and PH markets
- "Agency 3.0" digital transformation rollout is now complete: every active agent is equipped with an AI-assisted sales co-pilot tool
- Agent case rate improved 24% YoY, averaging 5.1 new policies per agent per month

**Digital Investment**
- Full-year technology spend reached HKD 1.4 billion, focused on AI underwriting and automated client servicing
- "AIA+ MAX" agent app now integrates CRM, policy lookup, AI recommendation engine, and cross-sell triggers

---

## Local Market Implications

**Hong Kong 🇭🇰**
- AIA HK net recruited 9,100 active agents in the past 12 months — outpacing the market
- Mainland Chinese visitor (MCV) premiums now represent 37% of HK new business, up from 28% in 2024
- Direct competitive pressure on Manulife: critical illness and premium medical products are primary battlegrounds

**Vietnam 🇻🇳**
- Deepened bancassurance partnership with VPBank; bancassurance revenue projected +38% for 2026
- Tier-3 city expansion via lightweight digital-agent model is accelerating market penetration

**Philippines 🇵🇭**
- Agent recruitment target: 14,000 net new agents in 2026, focused on OFW protection needs
- Micro-insurance product line expanded; average premium reduced to PHP 1,200 to capture underserved segments

---

## Recommended Actions for Manulife

1. **Immediate** — Accelerate Manulife's Elite Agency program to counter AIA's aggressive MDRT recruitment drive; set a matched 40% MDRT growth target by end of 2026
2. **Product Differentiation** — Strengthen Manulife's multi-market protection products, highlighting cross-border claims and multi-currency settlement — areas where AIA has less depth
3. **Technology Parity** — Fast-track AI-assisted sales tool deployment; ensure capability parity with AIA+ MAX by Q3 2026 or risk further agent attrition
4. **Vietnam Priority** — Secure deeper bancassurance partnerships with local banks before AIA consolidates its VPBank advantage

---

*Generated by Manulife AI Intelligence System. Source data: publicly available disclosures only.*`;
}
