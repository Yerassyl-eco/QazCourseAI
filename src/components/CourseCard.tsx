import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Course } from "@/lib/data/courses";
import { formatKZT } from "@/lib/data/courses";
import { loadProfile, saveProfile } from "@/lib/profile";
import { useLang } from "@/lib/i18n";

export function CourseCard({
  course,
  relevance,
  reason,
}: {
  course: Course;
  relevance?: number;
  reason?: string;
}) {
  const [lang] = useLang();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(loadProfile().saved.includes(course.id));
    const sync = () => setSaved(loadProfile().saved.includes(course.id));
    window.addEventListener("qazcourse:profile", sync);
    return () => window.removeEventListener("qazcourse:profile", sync);
  }, [course.id]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const p = loadProfile();
    const isSaved = p.saved.includes(course.id);
    saveProfile({
      ...p,
      saved: isSaved ? p.saved.filter((x) => x !== course.id) : [...p.saved, course.id],
    });
  }

  const accent = course.priceKZT === 0;
  const tr = (kk: string, ru: string) => (lang === "kk" ? kk : ru);

  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accent ? "bg-accent/15 text-accent" : "bg-secondary text-secondary-foreground"}`}>
            {accent ? tr("Тегін", "Бесплатно") : course.format}
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {course.city}
          </span>
          {course.certificate && (
            <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              ★ {tr("Сертификат", "Сертификат")}
            </span>
          )}
        </div>
        <button
          onClick={toggleSave}
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
            saved ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
          aria-label={saved ? tr("Сақталған", "Сохранено") : tr("Сақтау", "Сохранить")}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <h4 className="mb-1 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">
        {course.title}
      </h4>
      <p className="mb-3 text-xs text-muted-foreground">
        {course.provider} · {course.durationWeeks} {tr("апта", "нед.")}
      </p>

      {reason && (
        <p className="mb-3 line-clamp-2 rounded-lg bg-primary/5 px-2.5 py-1.5 text-[11px] italic leading-snug text-primary/90">
          → {reason}
        </p>
      )}

      <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-4">
        <div>
          <div className="text-base font-bold">{formatKZT(course.priceKZT)}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            ★ {course.rating.toFixed(1)} · {course.schedule}
          </div>
        </div>
        {relevance !== undefined && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold text-primary">
            {relevance}%
          </span>
        )}
      </div>
    </Link>
  );
}
