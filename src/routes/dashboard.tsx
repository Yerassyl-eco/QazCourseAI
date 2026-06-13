import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AIAssistant } from "@/components/AIAssistant";
import { CourseCard } from "@/components/CourseCard";
import { loadProfile, saveProfile, getProfession, skillGap, type UserProfile } from "@/lib/profile";
import { recommendCourses } from "@/lib/recommend";
import { COURSES } from "@/lib/data/courses";
import { useLang, t, pName, pBlurb } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "QazCourse AI — Dashboard" },
      { name: "description", content: "Personalized AI insights, skill map, and course recommendations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [lang] = useLang();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    setProfile(loadProfile());
    const sync = () => setProfile(loadProfile());
    window.addEventListener("qazcourse:profile", sync);
    return () => window.removeEventListener("qazcourse:profile", sync);
  }, []);

  if (!profile) return null;
  const prof = getProfession(profile);

  if (!prof) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold">{t("dash.empty.title", lang)}</h1>
          <p className="mb-8 text-muted-foreground">{t("dash.empty.body", lang)}</p>
          <Link to="/onboarding" className="rounded-full bg-foreground px-6 py-3 text-sm text-background">
            {t("dash.empty.cta", lang)}
          </Link>
        </main>
      </div>
    );
  }

  const ai = profile.ai;
  const topMatch = ai?.matches?.[0];
  const gaps = skillGap(profile);
  const recs = recommendCourses(profile, 6);
  const top = recs[0];
  const nearby = COURSES.filter((c) => c.city === profile.city).slice(0, 3);
  const online = COURSES.filter((c) => c.format === "Online").slice(0, 3);

  function bumpSkill(skill: string, delta: number) {
    if (!profile) return;
    const next = { ...profile.skills, [skill]: Math.max(0, Math.min(100, (profile.skills[skill] ?? 0) + delta)) };
    saveProfile({ ...profile, skills: next });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{t("dash.current", lang)}</span>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{pName(prof.id, lang, prof.title)}</h1>
            {topMatch && topMatch.professionId === prof.id && (
              <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                AI · {topMatch.confidence}% {t("ob.results.confidence", lang).toLowerCase()}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">{pBlurb(prof.id, lang, prof.blurb)}</p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="rounded bg-secondary px-2 py-1">{profile.city}</span>
            <span className="rounded bg-secondary px-2 py-1">{prof.category}</span>
            <span className="rounded bg-secondary px-2 py-1">
              {t("dash.salary", lang)} {Intl.NumberFormat("ru-RU").format(prof.salaryKZT[0])}–
              {Intl.NumberFormat("ru-RU").format(prof.salaryKZT[1])} ₸
            </span>
            <Link to="/professions" className="rounded bg-secondary px-2 py-1 hover:bg-primary hover:text-primary-foreground">
              {t("dash.change", lang)}
            </Link>
          </div>
        </div>

        {/* Next step + AI insights */}
        {ai && (ai.nextStep || ai.insights.length > 0) && (
          <section className="mb-12 grid gap-6 md:grid-cols-12">
            {ai.nextStep && (
              <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 md:col-span-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">{t("dash.next", lang)}</div>
                <p className="text-lg font-semibold leading-snug">{ai.nextStep}</p>
              </div>
            )}
            {ai.insights.length > 0 && (
              <div className="rounded-3xl border border-border bg-surface p-6 md:col-span-7">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">{t("dash.insights", lang)}</div>
                <ul className="space-y-2 text-sm">
                  {ai.insights.slice(0, 4).map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-primary">•</span><span>{x}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Top recommendation */}
        {top && (
          <section className="mb-16 rounded-3xl border border-primary/30 bg-primary/5 p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {t("dash.bestCourse", lang)} · {top.score}% {t("dash.match", lang)}
            </span>
            <h2 className="mt-2 text-2xl font-bold">{top.course.title}</h2>
            <p className="mt-1 text-muted-foreground">{top.course.provider} · {top.course.city} · {top.course.format}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {top.reasons.map((r) => (
                <li key={r} className="flex gap-2"><span className="text-accent">→</span><span>{r}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/courses/$courseId" params={{ courseId: top.course.id }} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                {t("dash.view", lang)}
              </Link>
              <Link to="/compare" className="rounded-full border border-border px-5 py-2 text-sm">{t("dash.compare", lang)}</Link>
            </div>
          </section>
        )}

        {/* Skill map + Recommendations */}
        <section className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="rounded-3xl border border-border bg-surface p-8 md:col-span-4">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{t("dash.skillsSub", lang)}</span>
            <h3 className="mb-6 text-xl font-bold">{t("dash.skillsTitle", lang)}</h3>
            <div className="space-y-5">
              {gaps.map(({ skill, level, priority }) => (
                <div key={skill}>
                  <div className="mb-2 flex justify-between font-mono text-xs">
                    <span className={priority ? "text-accent" : ""}>{priority && "★ "}{skill}</span>
                    <span className="text-muted-foreground">{level}%</span>
                  </div>
                  <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all duration-500 ${level >= 60 ? "bg-accent" : "bg-primary"}`}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => bumpSkill(skill, +10)} className="font-mono text-[10px] uppercase text-muted-foreground hover:text-primary">+10%</button>
                    <button onClick={() => bumpSkill(skill, -10)} className="font-mono text-[10px] uppercase text-muted-foreground hover:text-primary">−10%</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("dash.recsTitle", lang)}</h2>
              <Link to="/courses" className="text-sm font-medium text-primary">{t("dash.viewAll", lang)}</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recs.slice(0, 4).map((r) => (
                <CourseCard key={r.course.id} course={r.course} relevance={r.score} reason={r.reasons[0]} />
              ))}
            </div>
          </div>
        </section>

        {/* Nearby + Online */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">{t("dash.nearby", lang)} · {profile.city}</h2>
          {nearby.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((c) => (<CourseCard key={c.id} course={c} />))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {lang === "kk" ? `${profile.city}-да офлайн курс жоқ — төмендегі онлайн нұсқаларды қара.` : `В ${profile.city} офлайн курсов пока нет — попробуйте онлайн ниже.`}
            </p>
          )}
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">{t("dash.online", lang)}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {online.map((c) => (<CourseCard key={c.id} course={c} />))}
          </div>
        </section>

        {profile.saved.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-xl font-bold">{t("dash.saved", lang)}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profile.saved
                .map((id) => COURSES.find((c) => c.id === id))
                .filter((c): c is NonNullable<typeof c> => Boolean(c))
                .map((c) => (<CourseCard key={c.id} course={c} />))}
            </div>
          </section>
        )}
      </main>
      <AIAssistant />
    </div>
  );
}
