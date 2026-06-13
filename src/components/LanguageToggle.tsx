import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const [lang, setLang] = useLang();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 font-mono text-[10px] font-bold tracking-wider">
      {(["kk", "ru"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "kk" ? "ҚАЗ" : "РУС"}
        </button>
      ))}
    </div>
  );
}
