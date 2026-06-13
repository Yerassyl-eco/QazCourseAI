import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { CITIES } from "@/lib/data/cities";
import { PROFESSIONS } from "@/lib/data/professions";
import { loadProfile, saveProfile, type AIAnalysis } from "@/lib/profile";
import { QUESTIONS, SECTIONS, type Question } from "@/lib/data/assessment";
import { useLang, t, pName, pBlurb } from "@/lib/i18n";
import { analyzeAssessment } from "@/lib/ai-match.functions";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "QazCourse AI — AI бағалау" },
      { name: "description", content: "Терең 40-сұрақтық AI бағалау: мамандық, дағдылар, келесі қадам." },
    ],
  }),
  component: Onboarding,
});

type Step = "welcome" | "city" | { kind: "q"; idx: number } | "analyzing" | "results";

function Onboarding() {
  const navigate = useNavigate();
  const [lang] = useLang();
  const [step, setStep] = useState<Step>("welcome");
  const [city, setCity] = useState(loadProfile().city);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const totalQ = QUESTIONS.length;
  const sectionLabel = (s: string) => {
    const i = Number(s.replace("s", "")) - 1;
    return SECTIONS[i]?.[lang] ?? "";
  };

  const totalSteps = totalQ + 3; // welcome + city + questions + results
  const currentStepIndex =
    step === "welcome" ? 1 :
    step === "city" ? 2 :
    typeof step === "object" ? 3 + step.idx :
    step === "analyzing" ? totalSteps - 0 : totalSteps;

  function goNextFromQ(idx: number) {
    if (idx + 1 < totalQ) setStep({ kind: "q", idx: idx + 1 });
    else void runAnalysis();
  }
  function goPrevFromQ(idx: number) {
    if (idx === 0) setStep("city");
    else setStep({ kind: "q", idx: idx - 1 });
  }

  async function runAnalysis() {
    setStep("analyzing");
    setAnalyzeError(null);
    // Prepare inputs for the server fn
    const ratings: Record<string, number> = {};
    const openAnswers: Record<string, string> = {};
    const multiAnswers: Record<string, { questionKK: string; questionRU: string; picked: { kk: string; ru: string }[] }> = {};
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (q.type === "rating" && typeof a === "number") ratings[q.id] = a;
      else if (q.type === "open" && typeof a === "string") openAnswers[q.id] = a;
      else if ((q.type === "multi" || q.type === "scenario") && a) {
        const ids = Array.isArray(a) ? a : [a];
        const picked = q.options.filter((o) => ids.includes(o.id)).map((o) => ({ kk: o.kk, ru: o.ru }));
        multiAnswers[q.id] = { questionKK: q.kk, questionRU: q.ru, picked };
      }
    }
    try {
      const result = await analyzeAssessment({
        data: { lang, city, answers, ratings, openAnswers, multiAnswers },
      });
      const a: AIAnalysis = { ...result, generatedAt: Date.now() };
      setAnalysis(a);
      setStep("results");
    } catch (err) {
      console.error(err);
      setAnalyzeError(String(err));
      setStep("results");
    }
  }

  function pickProfession(id: string) {
    const profile = loadProfile();
    const prof = PROFESSIONS.find((p) => p.id === id)!;
    const skills: Record<string, number> = {};
    prof.coreSkills.forEach((s, i) => {
      skills[s] = [10, 30, 5, 45, 20, 15][i % 6];
    });
    saveProfile({
      ...profile,
      city,
      professionId: id,
      skills,
      answers,
      ai: analysis ?? undefined,
    });
    setTimeout(() => navigate({ to: "/dashboard" }), 400);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>QazCourse AI · {lang === "kk" ? "Тестілеу" : "Тестирование"}</span>
          <span>{currentStepIndex} / {totalSteps}</span>
        </div>
        <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
          />
        </div>

        {step === "welcome" && (
          <div className="animate-fade-in">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">{t("ob.welcome.title", lang)}</h1>
            <p className="mb-3 text-lg text-muted-foreground">{t("ob.welcome.body", lang)}</p>
            <p className="mb-10 font-mono text-[10px] uppercase tracking-widest text-accent">{t("ob.welcome.note", lang)}</p>
            <button
              onClick={() => setStep("city")}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              {t("ob.welcome.cta", lang)}
            </button>
          </div>
        )}

        {step === "city" && (
          <div className="animate-fade-in">
            <h1 className="mb-2 text-3xl font-bold">{t("ob.city.title", lang)}</h1>
            <p className="mb-8 text-muted-foreground">{t("ob.city.body", lang)}</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    city === c ? "bg-primary text-primary-foreground" : "border border-border hover:border-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-10 flex gap-3">
              <button onClick={() => setStep("welcome")} className="rounded-full border border-border px-6 py-3 text-sm">
                {t("ob.back", lang)}
              </button>
              <button onClick={() => setStep({ kind: "q", idx: 0 })} className="rounded-full bg-foreground px-6 py-3 text-sm text-background">
                {t("ob.continue", lang)}
              </button>
            </div>
          </div>
        )}

        {typeof step === "object" && step.kind === "q" && (
          <QuestionView
            key={step.idx}
            q={QUESTIONS[step.idx]}
            lang={lang}
            value={answers[QUESTIONS[step.idx].id]}
            sectionLabel={sectionLabel(QUESTIONS[step.idx].section)}
            qNumber={step.idx + 1}
            totalQ={totalQ}
            onChange={(v) => setAnswers({ ...answers, [QUESTIONS[step.idx].id]: v })}
            onNext={() => goNextFromQ(step.idx)}
            onPrev={() => goPrevFromQ(step.idx)}
            isLast={step.idx === totalQ - 1}
          />
        )}

        {step === "analyzing" && <AnalyzingView lang={lang} />}

        {step === "results" && analysis && (
          <ResultsView lang={lang} analysis={analysis} onPick={pickProfession} onRetry={() => setStep("welcome")} />
        )}
        {step === "results" && !analysis && (
          <div className="text-center">
            <p className="mb-6 text-muted-foreground">{analyzeError ?? "—"}</p>
            <button onClick={runAnalysis} className="rounded-full bg-foreground px-6 py-3 text-sm text-background">
              {lang === "kk" ? "Қайта талдау" : "Повторить анализ"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function QuestionView({ q, lang, value, sectionLabel, qNumber, totalQ, onChange, onNext, onPrev, isLast }: {
  q: Question; lang: "kk" | "ru"; value: unknown; sectionLabel: string;
  qNumber: number; totalQ: number;
  onChange: (v: unknown) => void; onNext: () => void; onPrev: () => void; isLast: boolean;
}) {
  const text = lang === "kk" ? q.kk : q.ru;
  const canContinue = useMemo(() => {
    if (q.type === "rating") return typeof value === "number" && value >= 1;
    if (q.type === "open") {
      const s = typeof value === "string" ? value.trim() : "";
      return s.length >= (q.minLen ?? 15);
    }
    if (q.type === "scenario") return Boolean(value);
    // multi
    if (q.multi) return Array.isArray(value) && value.length > 0;
    return Boolean(value);
  }, [q, value]);

  return (
    <div className="animate-fade-in">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
        <span>{sectionLabel}</span>
        <span className="text-muted-foreground">· {t("ob.question", lang)} {qNumber}/{totalQ}</span>
      </div>
      <h2 className="mb-8 text-2xl font-bold leading-snug md:text-3xl">{text}</h2>

      {(q.type === "multi" || q.type === "scenario") && (
        <div className="grid gap-3">
          {q.options.map((o) => {
            const multi = q.type === "multi" && q.multi;
            const selected = multi
              ? Array.isArray(value) && (value as string[]).includes(o.id)
              : value === o.id;
            return (
              <button
                key={o.id}
                onClick={() => {
                  if (multi) {
                    const cur = (Array.isArray(value) ? value : []) as string[];
                    onChange(cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id]);
                  } else onChange(o.id);
                }}
                className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-all hover:border-foreground ${
                  selected ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span>{lang === "kk" ? o.kk : o.ru}</span>
                {selected && <span className="font-mono text-[10px] text-primary">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "rating" && (
        <div>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("ob.rate", lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onChange(n)}
                className={`size-12 rounded-full font-mono text-sm transition-all ${
                  value === n ? "scale-110 bg-primary text-primary-foreground" : "border border-border hover:border-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {q.type === "open" && (
        <div>
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("ob.open.placeholder", lang)}
            rows={6}
            className="w-full rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed focus:border-primary focus:outline-none"
          />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {lang === "kk" ? (q.hintKK ?? "AI әр жауабыңды талдайды") : (q.hintRU ?? "AI проанализирует каждый ответ")}
            {" · "}
            {(typeof value === "string" ? value : "").trim().length} / {q.minLen ?? 15}
          </p>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <button onClick={onPrev} className="rounded-full border border-border px-5 py-2.5 text-sm">{t("ob.back", lang)}</button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-30"
        >
          {isLast ? t("ob.analyze.cta", lang) : t("ob.continue", lang)}
        </button>
      </div>
    </div>
  );
}

function AnalyzingView({ lang }: { lang: "kk" | "ru" }) {
  return (
    <div className="animate-fade-in py-12 text-center">
      <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
        <div className="size-3 animate-pulse rounded-full bg-primary" />
      </div>
      <h1 className="mb-3 text-3xl font-bold">{t("ob.analyzing.title", lang)}</h1>
      <p className="mx-auto mb-10 max-w-md text-muted-foreground">{t("ob.analyzing.body", lang)}</p>
      <ul className="mx-auto max-w-sm space-y-3 text-left font-mono text-xs text-muted-foreground">
        {[t("ob.analyzing.step1", lang), t("ob.analyzing.step2", lang), t("ob.analyzing.step3", lang), t("ob.analyzing.step4", lang)].map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: `${i * 200}ms` }} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultsView({ lang, analysis, onPick, onRetry }: { lang: "kk" | "ru"; analysis: AIAnalysis; onPick: (id: string) => void; onRetry: () => void }) {
  const top = analysis.matches[0];
  const others = analysis.matches.slice(1, 3);
  const topProf = PROFESSIONS.find((p) => p.id === top.professionId);
  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{t("ob.results.title", lang)}</span>
        {analysis.source === "fallback" && (
          <p className="mt-2 rounded-xl border border-accent/30 bg-accent/5 p-3 text-xs text-accent">{t("ob.results.fallback", lang)}</p>
        )}
      </div>

      {topProf && (
        <div className="rounded-3xl border border-primary/40 bg-primary/5 p-8">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{t("ob.results.bestMatch", lang)}</span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{pName(topProf.id, lang, topProf.title)}</h1>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t("ob.results.confidence", lang)}</div>
              <div className="text-3xl font-bold text-primary">{top.confidence}%</div>
            </div>
          </div>
          <p className="mb-6 text-muted-foreground">{pBlurb(topProf.id, lang, topProf.blurb)}</p>

          {top.reasons.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t("ob.results.reasons", lang)}</div>
              <ul className="space-y-1.5 text-sm">
                {top.reasons.map((r) => (
                  <li key={r} className="flex gap-2"><span className="text-accent">→</span><span>{r}</span></li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => onPick(topProf.id)} className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
            {t("ob.results.pick", lang)}
          </button>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("ob.results.alternates", lang)}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {others.map((m) => {
              const p = PROFESSIONS.find((x) => x.id === m.professionId);
              if (!p) return null;
              return (
                <button key={p.id} onClick={() => onPick(p.id)} className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-bold transition-colors group-hover:text-primary">{pName(p.id, lang, p.title)}</h4>
                    <span className="font-mono text-xs text-primary">{m.confidence}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{pBlurb(p.id, lang, p.blurb)}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {analysis.insights.length > 0 && (
          <Block title={t("ob.results.insights", lang)} items={analysis.insights} accent />
        )}
        {analysis.prioritySkills.length > 0 && (
          <Block title={t("ob.results.skills", lang)} items={analysis.prioritySkills} />
        )}
        {analysis.strengths.length > 0 && (
          <Block title={lang === "kk" ? "Күшті жақтарың" : "Сильные стороны"} items={analysis.strengths} />
        )}
        {analysis.weaknesses.length > 0 && (
          <Block title={lang === "kk" ? "Дамыту бағыттары" : "Зоны роста"} items={analysis.weaknesses} />
        )}
      </div>

      {analysis.openSummary && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">{t("ob.results.openSummary", lang)}</div>
          <p className="text-sm leading-relaxed text-muted-foreground">{analysis.openSummary}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button onClick={onRetry} className="text-sm text-muted-foreground hover:text-foreground">{t("ob.results.improve", lang)}</button>
        <a href="/professions" className="text-sm text-primary hover:underline">
          {lang === "kk" ? "Маған сай емес — өзім таңдаймын →" : "Не подходит — выбрать профессию вручную →"}
        </a>
      </div>
    </div>
  );
}

function Block({ title, items, accent }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((x) => (
          <li key={x} className="flex gap-2"><span className={accent ? "text-accent" : "text-primary"}>•</span><span>{x}</span></li>
        ))}
      </ul>
    </div>
  );
}
