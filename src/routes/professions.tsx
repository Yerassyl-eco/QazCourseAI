import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PROFESSIONS } from "@/lib/data/professions";
import { loadProfile, saveProfile, createCustomProfession } from "@/lib/profile";
import { useLang, pName, pBlurb } from "@/lib/i18n";

export const Route = createFileRoute("/professions")({
  head: () => ({
    meta: [
      { title: "Выбор профессии — QazCourse AI" },
      { name: "description", content: "Полный список профессий или впишите свою — мы подберём подходящие курсы." },
    ],
  }),
  component: ProfessionsPage,
});

function ProfessionsPage() {
  const [lang] = useLang();
  const navigate = useNavigate();
  const tr = (kk: string, ru: string) => (lang === "kk" ? kk : ru);
  const [q, setQ] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customSkills, setCustomSkills] = useState("");

  const filtered = PROFESSIONS.filter((p) => {
    const text = `${p.title} ${pName(p.id, lang, p.title)} ${p.coreSkills.join(" ")}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  function pick(id: string) {
    const profile = loadProfile();
    const prof = PROFESSIONS.find((p) => p.id === id)!;
    const skills: Record<string, number> = {};
    prof.coreSkills.forEach((s, i) => {
      skills[s] = [10, 30, 5, 45, 20, 15][i % 6];
    });
    saveProfile({ ...profile, professionId: id, customProfession: null, skills });
    navigate({ to: "/dashboard" });
  }

  function saveCustom() {
    if (customTitle.trim().length < 2) return;
    const skills = customSkills.split(",").map((s) => s.trim()).filter(Boolean);
    const cp = createCustomProfession(customTitle.trim(), {
      coreSkills: skills.length > 0 ? skills : undefined,
    });
    const profile = loadProfile();
    const sk: Record<string, number> = {};
    cp.coreSkills.forEach((s) => { sk[s] = 10; });
    saveProfile({ ...profile, professionId: cp.id, customProfession: cp, skills: sk });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {tr("Мамандықты таңда немесе өзіңдікін енгіз", "Выберите профессию или впишите свою")}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {tr("Қандай мамандық саған жақын?", "Какая профессия вам ближе?")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {tr(
            "Тізімнен таңда немесе өз мамандығыңды жаз — біз сай курстарды тауып береміз.",
            "Выберите из списка или напишите свою — мы подберём подходящие курсы.",
          )}
        </p>

        {/* Custom profession card */}
        <section className="mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">
            {tr("Менің таңдауым", "Моя профессия")}
          </div>
          <h2 className="mb-2 text-xl font-bold">
            {tr("Ұсынылған тізімде менің мамандығым жоқ", "Моей профессии нет в списке")}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {tr("Қалаған мамандығыңды жаз, қажет дағдыларды үтірмен бөліп көрсет.", "Впишите желаемую профессию и при желании укажите нужные навыки через запятую.")}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={tr("Мысалы: Архитектор UX", "Например: UX-архитектор")}
              maxLength={80}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              placeholder={tr("Дағдылар: Figma, Зерттеу, Стратегия…", "Навыки: Figma, Исследование, Стратегия…")}
              maxLength={200}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            onClick={saveCustom}
            disabled={customTitle.trim().length < 2}
            className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-40"
          >
            {tr("Бұл мамандықты қолдану →", "Использовать эту профессию →")}
          </button>
        </section>

        {/* Search list */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{tr("Ұсынылған мамандықтар", "Готовые профессии")}</h2>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr("Іздеу…", "Поиск…")}
              className="w-48 rounded-full border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-bold transition-colors group-hover:text-primary">{pName(p.id, lang, p.title)}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{pBlurb(p.id, lang, p.blurb)}</p>
                <div className="flex flex-wrap gap-1">
                  {p.coreSkills.slice(0, 4).map((s) => (
                    <span key={s} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
