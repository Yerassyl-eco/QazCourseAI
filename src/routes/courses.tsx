import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AIAssistant } from "@/components/AIAssistant";
import { CourseCard } from "@/components/CourseCard";
import { CITIES } from "@/lib/data/cities";
import { COURSES } from "@/lib/data/courses";
import { PROFESSIONS } from "@/lib/data/professions";
import { loadProfile } from "@/lib/profile";
import { useLang, pName } from "@/lib/i18n";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Каталог курсов — QazCourse AI" },
      { name: "description", content: "Поиск и фильтрация лучших онлайн и офлайн курсов по всему Казахстану." },
    ],
  }),
  component: CoursesPage,
});

type Sort = "relevance" | "rating" | "price-asc" | "price-desc" | "duration";

function CoursesPage() {
  const [lang] = useLang();
  const tr = (kk: string, ru: string) => (lang === "kk" ? kk : ru);

  // Filters
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("Все");
  const [format, setFormat] = useState<string>("Все");
  const [level, setLevel] = useState<string>("Все");
  const [profession, setProfession] = useState<string>("Все");
  const [maxPrice, setMaxPrice] = useState<number>(1_000_000);
  const [schedule, setSchedule] = useState<string>("Все");
  const [certOnly, setCertOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(18);

  // Pre-fill city from profile
  useEffect(() => {
    const p = loadProfile();
    if (p.city) setCity(p.city);
  }, []);

  const filtered = useMemo(() => {
    const out = COURSES.filter((c) => {
      if (q && !`${c.title} ${c.provider} ${c.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "Все" && c.city !== city) return false;
      if (format !== "Все" && c.format !== format) return false;
      if (level !== "Все" && c.level !== level) return false;
      if (schedule !== "Все" && c.schedule !== schedule) return false;
      if (profession !== "Все" && !c.professions.includes(profession)) return false;
      if (c.priceKZT > maxPrice) return false;
      if (certOnly && !c.certificate) return false;
      if (freeOnly && c.priceKZT > 0) return false;
      return true;
    });
    out.sort((a, b) => {
      switch (sort) {
        case "rating": return b.rating - a.rating;
        case "price-asc": return a.priceKZT - b.priceKZT;
        case "price-desc": return b.priceKZT - a.priceKZT;
        case "duration": return a.durationWeeks - b.durationWeeks;
        default:
          // relevance = rating × (city-match boost)
          const aBoost = a.city === city ? 0.5 : 0;
          const bBoost = b.city === city ? 0.5 : 0;
          return (b.rating + bBoost) - (a.rating + aBoost);
      }
    });
    return out;
  }, [q, city, format, level, schedule, profession, maxPrice, certOnly, freeOnly, sort]);

  useEffect(() => { setVisible(18); }, [q, city, format, level, schedule, profession, maxPrice, certOnly, freeOnly, sort]);

  const activeCount =
    (city !== "Все" ? 1 : 0) + (format !== "Все" ? 1 : 0) + (level !== "Все" ? 1 : 0) +
    (schedule !== "Все" ? 1 : 0) + (profession !== "Все" ? 1 : 0) +
    (maxPrice < 1_000_000 ? 1 : 0) + (certOnly ? 1 : 0) + (freeOnly ? 1 : 0);

  function reset() {
    setQ(""); setCity("Все"); setFormat("Все"); setLevel("Все");
    setSchedule("Все"); setProfession("Все"); setMaxPrice(1_000_000);
    setCertOnly(false); setFreeOnly(false); setSort("relevance");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {COURSES.length} {tr("курс · бүкіл ҚР", "курсов · по всему Казахстану")}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{tr("Курстар каталогы", "Каталог курсов")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tr("Қаладан, бюджеттен, мамандықтан сүзіп ал.", "Фильтруйте по городу, бюджету и профессии.")}
          </p>
        </div>

        {/* Search + sort bar */}
        <div className="sticky top-[68px] z-30 -mx-6 mb-6 border-b border-border bg-background/90 px-6 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tr("Дағды, мамандық немесе мектеп бойынша…", "Навык, профессия или школа…")}
                className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="relevance">{tr("Маңыздылық бойынша", "По релевантности")}</option>
              <option value="rating">{tr("Рейтинг бойынша", "По рейтингу")}</option>
              <option value="price-asc">{tr("Арзаннан қымбатқа", "Цена: дешевле сначала")}</option>
              <option value="price-desc">{tr("Қымбаттан арзанға", "Цена: дороже сначала")}</option>
              <option value="duration">{tr("Қысқа курстар", "Самые короткие")}</option>
            </select>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
                showFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
              }`}
            >
              {tr("Сүзгілер", "Фильтры")}{activeCount > 0 && <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeCount}</span>}
            </button>
            {activeCount > 0 && (
              <button onClick={reset} className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                {tr("Тазалау", "Сбросить")}
              </button>
            )}
          </div>

          {/* Quick chips */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <Chip active={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>{tr("Тегін", "Бесплатно")}</Chip>
            <Chip active={certOnly} onClick={() => setCertOnly(!certOnly)}>{tr("Сертификатпен", "С сертификатом")}</Chip>
            <Chip active={format === "Online"} onClick={() => setFormat(format === "Online" ? "Все" : "Online")}>Online</Chip>
            <Chip active={format === "Offline"} onClick={() => setFormat(format === "Offline" ? "Все" : "Offline")}>Offline</Chip>
            <Chip active={level === "Beginner"} onClick={() => setLevel(level === "Beginner" ? "Все" : "Beginner")}>{tr("Бастаушы", "Для новичков")}</Chip>
            <Chip active={schedule === "Evenings"} onClick={() => setSchedule(schedule === "Evenings" ? "Все" : "Evenings")}>{tr("Кешке", "Вечером")}</Chip>
            <Chip active={schedule === "Self-paced"} onClick={() => setSchedule(schedule === "Self-paced" ? "Все" : "Self-paced")}>{tr("Өз қарқынымен", "В своём темпе")}</Chip>
          </div>
        </div>

        {/* Advanced filters drawer */}
        {showFilters && (
          <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-surface p-5 md:grid-cols-3">
            <Select label={tr("Қала", "Город")} value={city} onChange={setCity} options={["Все", ...CITIES]} />
            <Select
              label={tr("Мамандық", "Профессия")}
              value={profession}
              onChange={setProfession}
              options={["Все", ...PROFESSIONS.map((p) => p.id)]}
              renderOption={(o) => o === "Все" ? tr("Барлығы", "Все") : pName(o, lang, PROFESSIONS.find((p) => p.id === o)?.title ?? o)}
            />
            <Select label={tr("Деңгей", "Уровень")} value={level} onChange={setLevel} options={["Все", "Beginner", "Intermediate", "Advanced"]} />
            <Select label={tr("Формат", "Формат")} value={format} onChange={setFormat} options={["Все", "Online", "Offline", "Hybrid"]} />
            <Select label={tr("Кесте", "Расписание")} value={schedule} onChange={setSchedule} options={["Все", "Weekdays", "Evenings", "Weekends", "Self-paced"]} />
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {tr("Бюджет", "Бюджет")} · {new Intl.NumberFormat("ru-RU").format(maxPrice)} ₸
              </label>
              <input
                type="range" min={0} max={1_000_000} step={25_000} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {filtered.length} {tr("курс табылды", "курсов найдено")}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {tr("Сүзгі бойынша курс табылмады.", "По этим фильтрам курсов не найдено.")}
            </p>
            <button onClick={reset} className="rounded-full bg-foreground px-5 py-2 text-sm text-background">
              {tr("Сүзгілерді тазалау", "Сбросить фильтры")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + 18)}
                  className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:border-foreground"
                >
                  {tr("Тағы көрсету", "Показать ещё")} ({filtered.length - visible})
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <AIAssistant />
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition-all ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  label, value, onChange, options, renderOption,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  renderOption?: (o: string) => string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {options.map((o) => (<option key={o} value={o}>{renderOption ? renderOption(o) : o}</option>))}
      </select>
    </div>
  );
}
