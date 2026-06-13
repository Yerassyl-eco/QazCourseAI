import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { COURSES_BY_ID, formatKZT } from "@/lib/data/courses";
import { loadProfile, saveProfile } from "@/lib/profile";

export const Route = createFileRoute("/courses/$courseId")({
  head: ({ params }) => {
    const c = COURSES_BY_ID[params.courseId];
    return {
      meta: [
        { title: c ? `${c.title} — QazCourse AI` : "Course — QazCourse AI" },
        { name: "description", content: c ? `${c.title} by ${c.provider} in ${c.city}.` : "" },
      ],
    };
  },
  component: CourseDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary">
          ← Back to courses
        </Link>
      </main>
    </div>
  ),
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const course = COURSES_BY_ID[courseId];
  const [saved, setSaved] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    setSaved(p.saved.includes(courseId));
    setInCompare(p.compare.includes(courseId));
  }, [courseId]);

  if (!course) return null;

  function toggleSave() {
    const p = loadProfile();
    const saved = p.saved.includes(courseId);
    saveProfile({
      ...p,
      saved: saved ? p.saved.filter((x) => x !== courseId) : [...p.saved, courseId],
    });
    setSaved(!saved);
  }

  function toggleCompare() {
    const p = loadProfile();
    const has = p.compare.includes(courseId);
    let compare = has ? p.compare.filter((x) => x !== courseId) : [...p.compare, courseId];
    if (compare.length > 3) compare = compare.slice(-3);
    saveProfile({ ...p, compare });
    setInCompare(!has);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link to="/courses" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
          ← Course Finder
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {course.format} · {course.city}
            </span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{course.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {course.provider} · {course.durationWeeks} weeks · {course.schedule}
            </p>

            <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />

            <h2 className="mt-10 text-xl font-bold">What you'll learn</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs">
                  {s}
                </span>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-bold">Course details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 text-sm md:grid-cols-3">
              <Detail k="Format" v={course.format} />
              <Detail k="City" v={course.city} />
              <Detail k="Duration" v={`${course.durationWeeks} weeks`} />
              <Detail k="Language" v={course.language} />
              <Detail k="Schedule" v={course.schedule} />
              <Detail k="Level" v={course.level} />
              <Detail k="Rating" v={`★ ${course.rating.toFixed(1)}`} />
              <Detail k="Certificate" v={course.certificate ? "Yes" : "No"} />
              <Detail k="Price" v={formatKZT(course.priceKZT)} />
            </dl>
          </div>

          <aside className="md:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-bold">{formatKZT(course.priceKZT)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ≈ {Intl.NumberFormat("ru-RU").format(Math.round(course.priceKZT / Math.max(1, course.durationWeeks * 10)))} ₸ / hour
              </p>

              <div className="mt-6 space-y-2">
                <a
                  href="#"
                  className="block w-full rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background"
                >
                  Apply on provider site
                </a>
                <button
                  onClick={toggleSave}
                  className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${saved ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}
                >
                  {saved ? "✓ Saved" : "Save for later"}
                </button>
                <button
                  onClick={toggleCompare}
                  className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${inCompare ? "border-accent bg-accent/10" : "border-border hover:bg-secondary"}`}
                >
                  {inCompare ? "✓ In comparison" : "Add to compare"}
                </button>
                <button
                  onClick={() => navigate({ to: "/compare" })}
                  className="w-full text-xs text-muted-foreground hover:text-primary"
                >
                  Open comparator →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  );
}
