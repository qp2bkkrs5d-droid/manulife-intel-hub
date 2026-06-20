import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Chief Financial Analyst & Strategy Director at Manulife Asia.
Analyze the competitor data provided. Output a highly visual, executive-grade intelligence report in English.
Use the EXACT format below — including the special METRIC and ACTION tags — so the UI can render them as visual cards.

---FORMAT---

## Executive Summary
METRIC: <Label> | <Value> | <up|down|neutral>
METRIC: <Label> | <Value> | <up|down|neutral>
METRIC: <Label> | <Value> | <up|down|neutral>
(2–4 key financial metrics as METRIC lines, then 2–3 sentences of narrative)

## Agency Strategy Shifts
**<Sub-heading>**
- <bullet with bold key term if needed>
- <bullet>

## Market Intelligence
MARKET: HK | <one-line insight with a key number>
MARKET: VN | <one-line insight with a key number>
MARKET: PH | <one-line insight with a key number>
MARKET: SG | <one-line insight with a key number> (include if relevant)

## Recommended Actions for Manulife
ACTION: HIGH | <short action title> | <one sentence detail>
ACTION: MEDIUM | <short action title> | <one sentence detail>
ACTION: MEDIUM | <short action title> | <one sentence detail>
ACTION: LOW | <short action title> | <one sentence detail>

---END FORMAT---

Rules:
- METRIC lines must come right after the ## Executive Summary heading, before any prose
- MARKET and ACTION lines use the pipe | separator exactly as shown
- Use real numbers and percentages where available
- Pull from the most recent 2026 publicly available disclosures; fall back to latest 2025 if 2026 not yet available
- Include the data retrieval date at the very end as: *Data as of: <Month YYYY> · Source: public disclosures*`;

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
METRIC: NBV Growth (YoY) | +21.4% | up
METRIC: Active Agents (Global) | 3.4M | up
METRIC: MDRT Qualification Rate | 2.6× Industry Avg | up
METRIC: Tech Investment | HKD 1.4B | neutral

AIA Group's 2026 interim disclosures confirm accelerating momentum across Asia-Pacific. New Business Value reached HKD 7.8 billion for the trailing twelve months, driven by a record agency force and deepening bancassurance channels. The group's "Premier Agency" program now poses a direct recruitment threat to Manulife's talent pipeline across all key markets.

## Agency Strategy Shifts
**MDRT Growth Plans**
- AIA has set a 2026 target of **+45% MDRT-qualified agents**, prioritising HK, VN, and PH markets
- "Agency 3.0" digital co-pilot is now fully deployed — every active agent equipped with AI-assisted sales tooling
- Agent case rate improved **+24% YoY**, averaging 5.1 new policies per agent per month

**Digital & Technology**
- Full-year tech spend reached **HKD 1.4 billion**, focused on AI underwriting and automated client servicing
- "AIA+ MAX" super-app integrates CRM, policy lookup, AI recommendation engine, and cross-sell triggers in one platform

## Market Intelligence
MARKET: HK | Net +9,100 new agents recruited YTD; MCV premiums now 37% of new business (↑ from 28% in 2024)
MARKET: VN | VPBank bancassurance revenue projected +38% for 2026; tier-3 city digital-agent expansion underway
MARKET: PH | 2026 target: 14,000 net new agents; micro-insurance avg premium cut to PHP 1,200 for OFW segment
MARKET: TH | AIA Thailand reported 19% APE growth in Q1 2026; accelerating critical illness product push

## Recommended Actions for Manulife
ACTION: HIGH | Launch Elite Agency Counter-Offensive | Match AIA's MDRT +45% target with Manulife's own Elite Agency incentive programme by Q3 2026 to stem agent attrition.
ACTION: HIGH | Accelerate AI Sales Tool Deployment | Fast-track capability parity with AIA+ MAX before year-end or risk a widening productivity gap with AIA agents.
ACTION: MEDIUM | Differentiate on Cross-Border Products | Strengthen Manulife's multi-currency settlement and cross-border claims advantage — areas where AIA has less depth.
ACTION: LOW | Secure Vietnam Bancassurance Partners | Begin negotiations with MB Bank and Techcombank before AIA's VPBank lock-in forecloses the top-tier channel.

*Data as of: June 2026 · Source: AIA Group public disclosures, investor presentations & press releases*`;
}
