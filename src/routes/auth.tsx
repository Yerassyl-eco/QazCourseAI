import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход и регистрация — QazCourse AI" },
      { name: "description", content: "Создайте аккаунт через email с кодом подтверждения или войдите через Google." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";
type Step = "form" | "code";

function AuthPage() {
  const navigate = useNavigate();
  const [lang] = useLang();
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in → go to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const tr = (kk: string, ru: string) => (lang === "kk" ? kk : ru);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(tr("Дұрыс email енгіз", "Введите корректный email"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: mode === "signup",
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: name ? { display_name: name } : undefined,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setInfo(tr("Поштаңа 6 таңбалы код жіберілді", "Мы отправили 6-значный код на вашу почту"));
    setStep("code");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (code.length < 6) {
      setError(tr("6 таңбалы кодты енгіз", "Введите 6-значный код"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  async function signInWithGoogle() {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    if (result.error) {
      setBusy(false);
      setError(String((result.error as { message?: string }).message ?? result.error));
      return;
    }
    if (result.redirected) return; // browser will redirect
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          QazCourse AI · {tr("Аккаунт", "Аккаунт")}
        </span>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {mode === "signup"
            ? tr("Тіркелу", "Регистрация")
            : tr("Кіру", "Вход")}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {mode === "signup"
            ? tr(
                "Поштаға 6 таңбалы код жібереміз — пароль қажет емес.",
                "Отправим 6-значный код на вашу почту — пароль не нужен.",
              )
            : tr(
                "Поштаны енгіз — растау кодын жібереміз.",
                "Введите email — пришлём код подтверждения.",
              )}
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={busy}
          className="mb-5 flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-foreground disabled:opacity-50"
        >
          <GoogleIcon />
          {tr("Google арқылы жалғастыру", "Продолжить с Google")}
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {tr("немесе email", "или email")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {step === "form" && (
          <form onSubmit={sendCode} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr("Атың (қалаулы)", "Ваше имя (по желанию)")}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                maxLength={80}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              maxLength={120}
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy
                ? tr("Жіберілуде…", "Отправляем…")
                : tr("Кодты алу →", "Получить код →")}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verifyCode} className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {tr("Код жіберілді:", "Код отправлен на:")} <span className="text-foreground">{email}</span>
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="rounded-xl border border-border bg-background px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:border-primary focus:outline-none"
              maxLength={6}
              required
            />
            <button
              type="submit"
              disabled={busy || code.length < 6}
              className="mt-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? tr("Тексерілуде…", "Проверяем…") : tr("Растау →", "Подтвердить →")}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setCode("");
                setInfo(null);
                setError(null);
              }}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              ← {tr("Поштаны өзгерту", "Изменить email")}
            </button>
          </form>
        )}

        {info && (
          <p className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-primary">{info}</p>
        )}
        {error && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setStep("form");
            setCode("");
            setError(null);
            setInfo(null);
          }}
          className="mt-8 text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signup"
            ? tr("Аккаунт бар ма? Кіру →", "Уже есть аккаунт? Войти →")
            : tr("Аккаунт жоқ па? Тіркелу →", "Нет аккаунта? Зарегистрироваться →")}
        </button>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
