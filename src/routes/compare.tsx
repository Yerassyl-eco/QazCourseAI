import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { COURSES, COURSES_BY_ID, formatKZT, type Course } from "@/lib/data/courses";
import { loadProfile, saveProfile, getProfession } from "@/lib/profile";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare courses — QazCourse AI" },
      { name: "description", content: "Compare any two or three courses side-by-side with an AI rubric." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const p = loadProfile();
    setIds(p.compare);
  }, []);

  function remove(id: string) {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    saveProfile({ ...loadProfile(), compare: next });
  }
  function add(id: string) {
    if (ids.includes(id) || ids.length >= 3) return;
    const next = [...ids, id];
    setIds(next);
    saveProfile({ ...loadProfile(), compare: next });
  }

  const courses = ids.map((id) => COURSES_BY_ID[id]).filter(Boolean) as Course[];
  const best = courses.length ? pickBest(courses) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Intelligent Comparison</h1>
        <p className="mb-10 text-muted-foreground">
          Add 2–3 courses. AI highlights the best fit based on your profile.
        </p>

        {courses.length < 2 && (
          <div className="mb-10 rounded-2xl border border-border bg-surface p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Add courses from any course page, or quick-pick below:
            </p>
            <div className="flex flex-wrap gap-2">
              {COURSES.slice(0, 12)
                .filter((c) => !ids.includes(c.id))
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => add(c.id)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary"
                  >
                    + {c.title}
                  </button>
                ))}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div className="rounded-3xl bg-foreground p-10 text-background">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-40 py-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
                      Factor
                    </th>
                    {courses.map((c) => (
                      <th key={c.id} className="min-w-[180px] py-4 align-top">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                          {c === best && "★ AI pick · "}
                          {c.provider}
                        </div>
                        <div className="mt-1 text-base font-bold leading-snug">{c.title}</div>
                        <button
                          onClick={() => remove(c.id)}
                          className="mt-2 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
                        >
                          remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <Row label="City" cells={courses.map((c) => c.city)} />
                  <Row label="Format" cells={courses.map((c) => c.format)} />
                  <Row label="Duration" cells={courses.map((c) => `${c.durationWeeks} weeks`)} />
                  <Row label="Schedule" cells={courses.map((c) => c.schedule)} />
                  <Row label="Level" cells={courses.map((c) => c.level)} />
                  <Row label="Rating" cells={courses.map((c) => `★ ${c.rating.toFixed(1)}`)} />
                  <Row label="Certificate" cells={courses.map((c) => (c.certificate ? "Yes" : "No"))} />
                  <Row label="Price" cells={courses.map((c) => formatKZT(c.priceKZT))} />
                  <Row
                    label="Price / hour"
                    cells={courses.map(
                      (c) =>
                        Intl.NumberFormat("ru-RU").format(
                          Math.round(c.priceKZT / Math.max(1, c.durationWeeks * 10)),
                        ) + " ₸",
                    )}
                  />
                  <Row
                    label="Skills"
                    cells={courses.map((c) => c.skills.slice(0, 4).join(" · "))}
                  />
                </tbody>
              </table>
            </div>

            {best && (
              <div className="mt-8 rounded-2xl bg-white/5 p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">AI Verdict</p>
                <p className="mt-2 text-lg">
                  <span className="font-bold">{best.title}</span> looks like the strongest fit{" "}
                  {explain(best)}.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex gap-3">
          <Link to="/courses" className="rounded-full bg-foreground px-5 py-2 text-sm text-background">
            Find more courses
          </Link>
          <Link to="/dashboard" className="rounded-full border border-border px-5 py-2 text-sm">
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: (string | number)[] }) {
  return (
    <tr>
      <td className="py-3 font-mono text-[10px] uppercase tracking-widest opacity-60">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="py-3 opacity-90">
          {c}
        </td>
      ))}
    </tr>
  );
}

function pickBest(courses: Course[]): Course {
  const profile = loadProfile();
  const prof = getProfession(profile);
  let best = courses[0];
  let bestScore = -Infinity;
  for (const c of courses) {
    let s = c.rating * 10;
    if (prof && c.professions.includes(prof.id)) s += 30;
    if (c.city === profile.city) s += 15;
    if (c.priceKZT === 0) s += 10;
    s -= c.priceKZT / 100_000;
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best;
}

function explain(c: Course): string {
  const bits: string[] = [];
  if (c.rating >= 4.7) bits.push(`high rating (${c.rating.toFixed(1)})`);
  if (c.priceKZT === 0) bits.push("free");
  else if (c.priceKZT < 150_000) bits.push("affordable price");
  if (c.certificate) bits.push("certified");
  return bits.length ? `— ${bits.join(", ")}` : "";
}
