import { useEffect, useRef, useState } from "react";
import { loadProfile, getProfession } from "@/lib/profile";
import { recommendCourses } from "@/lib/recommend";
import { PROFESSIONS } from "@/lib/data/professions";
import { COURSES } from "@/lib/data/courses";

type Msg = { role: "user" | "ai"; text: string };

function answer(q: string): string {
  const profile = loadProfile();
  const prof = getProfession(profile);
  const lower = q.toLowerCase();

  if (/skill|gap|missing|improve/.test(lower) && prof) {
    const weak = prof.coreSkills.filter((s) => (profile.skills[s] ?? 0) < 40);
    if (weak.length === 0) return `For ${prof.title} you're solid on the core skills. Look for advanced electives.`;
    return `For ${prof.title} you should improve: ${weak.join(", ")}.`;
  }
  if (/profession|career|which.*suit|what.*become/.test(lower)) {
    const list = PROFESSIONS.slice(0, 5).map((p) => p.title).join(", ");
    return `Popular paths on QazCourse: ${list}. Run the AI assessment to get a personalized shortlist.`;
  }
  if (/almaty|astana|shymkent|city/.test(lower)) {
    const city = profile.city;
    const inCity = COURSES.filter((c) => c.city === city).length;
    return `There are ${inCity} courses available in ${city}. Plus online options work from anywhere.`;
  }
  if (/recommend|best course|what.*take/.test(lower)) {
    const recs = recommendCourses(profile, 3);
    if (recs.length === 0) return "Tell me your future profession first — start with /onboarding.";
    return "Top picks: " + recs.map((r) => r.course.title).join(" · ");
  }
  if (/next|what.*do/.test(lower)) {
    if (!prof) return "Start with the AI Assessment — it picks a profession that fits your interests.";
    return `Open your dashboard — your next best course closes your weakest skill on the ${prof.title} path.`;
  }
  return "I can help with: skill gaps, course picks, professions, or what to do next. Try: 'What should I learn next?'";
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "I'm your QazCourse AI guide. Ask about courses, skills, or professions." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, open]);

  function send() {
    const q = input.trim();
    if (!q) return;
    const next: Msg[] = [...messages, { role: "user", text: q }];
    setMessages([...next, { role: "ai", text: answer(q) }]);
    setInput("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-2xl shadow-primary/10 transition-transform hover:scale-[1.02]"
      >
        <span className="size-2 animate-pulse rounded-full bg-accent" />
        Ask QazCourse AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <div className="size-2 animate-pulse rounded-full bg-primary" />
          </div>
          <div>
            <p className="text-xs font-bold">QazCourse AI</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Online · Ready to analyze
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 text-sm ${
              m.role === "user"
                ? "ml-6 bg-primary text-primary-foreground"
                : "mr-6 bg-secondary text-secondary-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a career question..."
          className="w-full rounded-xl border border-border bg-background p-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={send}
          className="rounded-xl bg-foreground px-3 text-xs font-medium text-background"
        >
          Send
        </button>
      </div>
    </div>
  );
}
