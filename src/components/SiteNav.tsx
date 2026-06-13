import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/profile";
import { useLang, t } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/lib/auth";

export function SiteNav() {
  const [lang] = useLang();
  const { user, signOut } = useAuth();
  const [city, setCity] = useState("Almaty");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setCity(loadProfile().city);
    sync();
    window.addEventListener("qazcourse:profile", sync);
    return () => window.removeEventListener("qazcourse:profile", sync);
  }, []);

  const initial = (user?.user_metadata?.display_name as string | undefined)?.[0]
    ?? user?.email?.[0]?.toUpperCase()
    ?? "?";

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            QazCourse<span className="text-primary">AI</span>
          </Link>
          <div className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/courses" className="transition-colors hover:text-primary" activeProps={{ className: "text-foreground" }}>
              {t("nav.courses", lang)}
            </Link>
            <Link to="/dashboard" className="transition-colors hover:text-primary" activeProps={{ className: "text-foreground" }}>
              {t("nav.dashboard", lang)}
            </Link>
            <Link to="/compare" className="transition-colors hover:text-primary" activeProps={{ className: "text-foreground" }}>
              {t("nav.compare", lang)}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground sm:inline">
            {city}
          </span>
          <LanguageToggle />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                aria-label="Account"
              >
                {initial}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b border-border p-3 text-xs">
                    <div className="font-medium">{user.user_metadata?.display_name as string ?? (lang === "kk" ? "Қолданушы" : "Пользователь")}</div>
                    <div className="truncate text-muted-foreground">{user.email}</div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm hover:bg-secondary">
                    {t("nav.dashboard", lang)}
                  </Link>
                  <button
                    onClick={async () => { setMenuOpen(false); await signOut(); }}
                    className="block w-full px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
                  >
                    {lang === "kk" ? "Шығу" : "Выйти"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground sm:inline-block"
              >
                {lang === "kk" ? "Кіру" : "Войти"}
              </Link>
              <Link
                to="/onboarding"
                className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t("nav.start", lang)}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
