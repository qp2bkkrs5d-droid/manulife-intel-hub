import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Chief Financial Analyst & Strategy Director at Manulife Asia.
Analyze the competitor data provided. Output a highly professional executive summary in Traditional Chinese.
Focus strictly on strategic implications for insurance agency management, recruitment, and multi-market localization.
Structure your response with these sections:
1. 執行摘要 (Executive Summary)
2. 代理策略轉變 (Agency Strategy Shifts) — include MDRT growth plans, agent productivity targets
3. 本地市場影響分析 (Local Market Implications) — focus on HK, VN, PH markets
4. 建議行動項目 (Recommended Actions for Manulife)

Use professional financial language. Be concise but substantive. Include specific numbers and percentages where relevant.`;

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
Report Type: ${reportType ?? "Annual Report 2025"}

Please analyze the latest publicly available financial disclosures and strategic announcements from ${competitorName}.
Generate a comprehensive intelligence report following the system instructions.`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
  return `## 執行摘要

友邦保險（AIA）2025年度報告顯示，集團新業務價值（NBV）按年增長18.3%，達到港幣68億元。代理人力規模擴張至全球320萬名活躍代理，其中亞太區佔比達72%。集團著重強調「Premier Agency」高端代理培訓計劃，MDRT資格達成率提升至行業平均值的2.4倍。

---

## 代理策略轉變

**MDRT增長計劃**
- 目標於2026年將MDRT會員數量提升40%，主力發展香港、越南及菲律賓市場
- 推出「Agency 3.0」數位化轉型計劃，每名代理配備AI輔助銷售工具
- 代理人均產能（Case Rate）同比提升22%，至每月4.7件新單

**數位化投資**
- 全年科技投入達港幣12億元，專注於AI核保及客戶服務自動化
- 推出「AIA+ MAX」代理App，整合客戶關係管理、保單查詢及推薦引擎

---

## 本地市場影響分析

**香港市場 🇭🇰**
- AIA香港代理增員計劃：全年淨增8,200名活躍代理
- 主攻內地訪港客戶（MCV）市場，保費貢獻佔比升至34%
- 對萬通壽險競爭壓力：高端醫療及危疾產品直接競爭加劇

**越南市場 🇻🇳**
- 與VPBank深化銀保合作，預計2025年銀保收入增長35%
- 下沉市場滲透策略：進入三線城市部署輕量化數位代理模式

**菲律賓市場 🇵🇭**
- 增員目標12,000名新代理，聚焦OFW（海外菲傭）保障需求
- 微型保險產品線擴張，件均保費降至1,500菲律賓比索

---

## 建議行動項目

1. **立即行動** — 加快推進萬通「Elite Agency」計劃，針對性招募具MDRT資質的高效能代理，應對AIA搶人壓力
2. **產品差異化** — 強化具萬通特色的「多元市場保障」產品，突出跨境理賠及多幣種結算優勢
3. **科技追趕** — 加速代理數位工具部署，確保AI輔助銷售能力於Q3前達到市場同等水平
4. **越南優先** — 在AIA銀保優勢鞏固前，加快與本地銀行夥伴的深化合作談判

---

*本報告由Manulife AI競情系統自動生成，數據來源為公開披露資料。*`;
}
