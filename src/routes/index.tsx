import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { AIAssistant } from "@/components/AIAssistant";
import { CITIES } from "@/lib/data/cities";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QazCourse AI — Поиск курсов в Казахстане" },
      {
        name: "description",
        content:
          "Найдите лучшие курсы в Казахстане для вашей будущей профессии. AI-рекомендации на основе ваших навыков, города и целей.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [city, setCity] = useState("Алматы");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <section className="mb-20">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              AI-навигатор по курсам · Казахстан
            </span>
            <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Стройте профессиональное будущее на{" "}
              <span className="text-muted-foreground">объективных данных.</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Интеллектуальный навигатор по образованию в Казахстане. Откройте лучшие курсы для
              вашей будущей профессии — на основе реальных пробелов в навыках, а не маркетинга.
            </p>

            <div className="mb-12 flex flex-wrap gap-3">
              <Link
                to="/onboarding"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
              >
                Пройти AI-оценку
              </Link>
              <Link
                to="/courses"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-all hover:bg-secondary"
              >
                Смотреть курсы
              </Link>
            </div>
          </div>

          {/* City selector */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border pb-4">
            <span className="mr-4 self-center font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Город
            </span>
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
                  city === c
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-24 grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Расскажите о цели",
              d: "Выберите профессию или позвольте AI-оценке определить её по вашим интересам, сильным сторонам и любимым предметам.",
            },
            {
              n: "02",
              t: "Мы анализируем навыки",
              d: "Сравним то, что вы знаете, с тем, что требует ваша будущая профессия. Пробелы — наглядно.",
            },
            {
              n: "03",
              t: "Подбираем курсы",
              d: "Онлайн и офлайн курсы в вашем городе, отсортированные по релевантности. Каждая рекомендация — с обоснованием.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </section>

        {/* Value prop */}
        <section className="mb-24">
          <h2 className="mb-6 text-3xl font-bold tracking-tight">
            От «не знаю» — к чёткому следующему шагу.
          </h2>
          <p className="mb-6 max-w-3xl text-muted-foreground">
            QazCourse AI — это не теоретический инструмент профориентации. Это поисковый движок,
            который отвечает на один вопрос очень хорошо:{" "}
            <span className="font-semibold text-foreground">какой курс пройти следующим?</span>
          </p>
          <ul className="grid gap-4 text-sm md:grid-cols-2">
            {[
              "Тысячи онлайн и офлайн курсов по всему Казахстану",
              "AI-ранжирование рекомендаций с понятным объяснением",
              "Умные фильтры: город, бюджет, расписание, уровень, сертификат",
              "Сравнение любых двух курсов рядом",
              "Сохранение курсов и личный список обучения",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
          <div>
            <span className="mb-4 block text-sm font-bold tracking-tighter">
              QazCourse<span className="text-primary">AI</span>
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Будущее профессионального образования в Казахстане под управлением AI.
            </p>
          </div>
          <FooterCol title="Платформа" links={["Каталог курсов", "Карта профессий", "Гид по городам"]} />
          <FooterCol title="Сообщество" links={["Школы-партнёры", "Истории успеха", "Для преподавателей"]} />
          <FooterCol title="Правовое" links={["Политика конфиденциальности", "Этика данных", "Контакты"]} />
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
      {links.map((l) => (
        <a key={l} href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
          {l}
        </a>
      ))}
    </div>
  );
}
