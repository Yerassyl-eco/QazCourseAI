// Local-only user profile stored in localStorage. Extended with AI analysis & custom profession support.
import { PROFESSIONS_BY_ID, type Profession } from "./data/professions";

export type SkillLevel = number; // 0..100

export type AIAnalysis = {
  matches: { professionId: string; confidence: number; reasons: string[] }[];
  insights: string[];
  prioritySkills: string[];
  strengths: string[];
  weaknesses: string[];
  nextStep: string;
  openSummary: string;
  source: "ai" | "fallback";
  generatedAt: number;
};

export type CustomProfession = {
  id: string; // always starts with "custom-"
  title: string;
  category: Profession["category"];
  blurb: string;
  coreSkills: string[];
  salaryKZT: [number, number];
};

export type UserProfile = {
  city: string;
  professionId: string | null;
  skills: Record<string, SkillLevel>;
  notes?: string;
  saved: string[];
  compare: string[];
  answers?: Record<string, unknown>;
  ai?: AIAnalysis;
  customProfession?: CustomProfession | null;
};

const KEY = "qazcourse.profile.v2";

const DEFAULT: UserProfile = {
  city: "Almaty",
  professionId: null,
  skills: {},
  saved: [],
  compare: [],
};

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("qazcourse:profile"));
}

export function getProfession(p: UserProfile): Profession | null {
  if (!p.professionId) return null;
  if (p.professionId.startsWith("custom-") && p.customProfession) {
    return p.customProfession as unknown as Profession;
  }
  return PROFESSIONS_BY_ID[p.professionId] ?? null;
}

export function skillGap(p: UserProfile): { skill: string; level: SkillLevel; priority?: boolean }[] {
  const prof = getProfession(p);
  if (!prof) return [];
  const priority = new Set((p.ai?.prioritySkills ?? []).map((s) => s.toLowerCase()));
  return prof.coreSkills.map((s) => ({
    skill: s,
    level: p.skills[s] ?? 0,
    priority: priority.has(s.toLowerCase()),
  }));
}

export function createCustomProfession(title: string, opts?: Partial<CustomProfession>): CustomProfession {
  const slug = title.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40) || "my-path";
  return {
    id: `custom-${slug}-${Date.now().toString(36)}`,
    title,
    category: opts?.category ?? "Business",
    blurb: opts?.blurb ?? "Индивидуальная профессиональная траектория.",
    coreSkills: opts?.coreSkills && opts.coreSkills.length > 0
      ? opts.coreSkills
      : ["Английский язык", "Коммуникация", "Цифровая грамотность", "Профильные знания"],
    salaryKZT: opts?.salaryKZT ?? [300_000, 900_000],
  };
}
