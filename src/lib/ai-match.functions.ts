// AI-powered assessment analysis using Lovable AI Gateway.
// Returns profession matches with confidence, AI insights, and priority skills.
import { createServerFn } from "@tanstack/react-start";
import { PROFESSIONS } from "./data/professions";

export type AIAnalysisResult = {
  matches: { professionId: string; confidence: number; reasons: string[] }[];
  insights: string[];
  prioritySkills: string[];
  strengths: string[];
  weaknesses: string[];
  nextStep: string;
  openSummary: string;
  source: "ai" | "fallback";
};

type AnalyzeInput = {
  lang: "kk" | "ru";
  city: string;
  answers: Record<string, unknown>;
  ratings: Record<string, number>;
  openAnswers: Record<string, string>;
  multiAnswers: Record<string, { questionKK: string; questionRU: string; picked: { kk: string; ru: string }[] }>;
};

function buildPrompt(input: AnalyzeInput): string {
  const profList = PROFESSIONS.map((p) => `- ${p.id}: ${p.title} (${p.category}) — needs ${p.coreSkills.join(", ")}`).join("\n");
  const ratingsText = Object.entries(input.ratings)
    .map(([k, v]) => `${k}: ${v}/10`)
    .join(", ");
  const multiText = Object.entries(input.multiAnswers)
    .map(([qid, q]) => {
      const picks = q.picked.map((p) => (input.lang === "kk" ? p.kk : p.ru)).join("; ");
      return `[${qid}] ${input.lang === "kk" ? q.questionKK : q.questionRU} → ${picks || "—"}`;
    })
    .join("\n");
  const openText = Object.entries(input.openAnswers)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `[${k}] "${v.trim().replace(/"/g, "'").slice(0, 600)}"`)
    .join("\n");

  const langName = input.lang === "kk" ? "Kazakh (қазақша)" : "Russian (на русском)";

  return `You are an expert career advisor for Kazakhstan. Analyze the user's deep self-assessment and return a single JSON object only — no markdown, no commentary.

USER LANGUAGE: write all human-readable text in ${langName}.
USER CITY: ${input.city}

AVAILABLE PROFESSIONS (use these exact ids in "professionId"):
${profList}

USER MULTIPLE-CHOICE ANSWERS:
${multiText || "(none)"}

USER SELF-RATINGS (1-10):
${ratingsText || "(none)"}

USER OPEN-ENDED ANSWERS (read carefully — these reveal real motivation, personality, communication style, ambition):
${openText || "(none)"}

REQUIRED JSON SHAPE (strict):
{
  "matches": [
    { "professionId": "<one of the ids above>", "confidence": <0-100 integer>, "reasons": ["<short reason 1>", "<reason 2>", "<reason 3>"] }
    // 3 matches, sorted by confidence desc
  ],
  "insights": ["<3-5 short, personal, human-sounding bullets based on the open answers>"],
  "prioritySkills": ["<3-6 specific skill names from the top match's coreSkills the user should develop first>"],
  "strengths": ["<3-4 short strengths>"],
  "weaknesses": ["<2-3 short growth areas, kind tone>"],
  "nextStep": "<one concrete sentence telling the user what to do this week>",
  "openSummary": "<2-3 sentences summarizing what you understood from the open answers — interests, personality, ambition>"
}

Rules:
- Every text field must be in ${langName}.
- Confidence must reflect real evidence; do not give all 90+. Spread realistically.
- Reasons must reference actual user answers (subjects, hobbies, ratings, written answers).
- Output ONLY the JSON object. No \`\`\`json fences, no extra text.`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json");
  return JSON.parse(candidate.slice(start, end + 1));
}

function fallback(input: AnalyzeInput): AIAnalysisResult {
  // Heuristic: count category tags from picked options + ratings.
  const scores: Record<string, number> = {};
  for (const q of Object.values(input.multiAnswers)) {
    for (const p of q.picked) {
      // tags arrived as text only; fallback won't deeply tag, so we leave heuristic small.
      void p;
    }
  }
  // Use ratings: top categories from strongest rating mappings
  const rmap: Record<string, string[]> = {
    "r-logic": ["IT", "Engineering"],
    "r-creative": ["Creative", "Design"],
    "r-lead": ["Business"],
    "r-comm": ["Marketing", "Languages"],
    "r-math": ["IT", "Engineering"],
    "r-empathy": ["Medicine"],
    "r-tech": ["IT", "Engineering"],
  };
  for (const [k, v] of Object.entries(input.ratings)) {
    for (const cat of rmap[k] ?? []) scores[cat] = (scores[cat] ?? 0) + v;
  }
  const topCats = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([c]) => c);
  const matches = PROFESSIONS.filter((p) => topCats.includes(p.category))
    .slice(0, 3)
    .map((p, i) => ({
      professionId: p.id,
      confidence: 80 - i * 15,
      reasons: [input.lang === "kk" ? "Бағалауларың осы салаға сәйкес келеді" : "Ваши рейтинги соответствуют этой области"],
    }));
  return {
    matches: matches.length ? matches : PROFESSIONS.slice(0, 3).map((p, i) => ({ professionId: p.id, confidence: 60 - i * 10, reasons: [] })),
    insights: [input.lang === "kk" ? "AI қызметі қазір қолжетімсіз — негізгі қозғалтқыш бойынша ұсынамыз." : "AI временно недоступен — показываем результат базового движка."],
    prioritySkills: [],
    strengths: [],
    weaknesses: [],
    nextStep: input.lang === "kk" ? "Ұсынылған мамандықты таңдап, дашбордқа өт." : "Выберите рекомендованную профессию и откройте дашборд.",
    openSummary: "",
    source: "fallback",
  };
}

export const analyzeAssessment = createServerFn({ method: "POST" })
  .inputValidator((data: AnalyzeInput) => data)
  .handler(async ({ data }): Promise<AIAnalysisResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return fallback(data);

    const prompt = buildPrompt(data);
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "X-Lovable-AIG-SDK": "qazcourse-ai",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a precise career analyst. Return JSON only." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        }),
      });
      if (res.status === 429 || res.status === 402) {
        console.warn("AI gateway limit:", res.status);
        return fallback(data);
      }
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text().catch(() => ""));
        return fallback(data);
      }
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = extractJson(text) as AIAnalysisResult;

      // Validate basic shape and coerce
      if (!Array.isArray(parsed.matches) || parsed.matches.length === 0) return fallback(data);
      const validIds = new Set(PROFESSIONS.map((p) => p.id));
      parsed.matches = parsed.matches
        .filter((m) => validIds.has(m.professionId))
        .map((m) => ({
          professionId: m.professionId,
          confidence: Math.max(0, Math.min(100, Math.round(Number(m.confidence) || 0))),
          reasons: Array.isArray(m.reasons) ? m.reasons.slice(0, 5).map(String) : [],
        }))
        .slice(0, 5);
      if (parsed.matches.length === 0) return fallback(data);
      parsed.insights = (parsed.insights ?? []).map(String).slice(0, 6);
      parsed.prioritySkills = (parsed.prioritySkills ?? []).map(String).slice(0, 8);
      parsed.strengths = (parsed.strengths ?? []).map(String).slice(0, 6);
      parsed.weaknesses = (parsed.weaknesses ?? []).map(String).slice(0, 6);
      parsed.nextStep = String(parsed.nextStep ?? "");
      parsed.openSummary = String(parsed.openSummary ?? "");
      parsed.source = "ai";
      return parsed;
    } catch (err) {
      console.error("AI analyze failed:", err);
      return fallback(data);
    }
  });
