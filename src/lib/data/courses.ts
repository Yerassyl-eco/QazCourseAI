import { CITIES } from "./cities";

export type Course = {
  id: string;
  title: string;
  provider: string;
  city: (typeof CITIES)[number];
  format: "Online" | "Offline" | "Hybrid";
  durationWeeks: number;
  priceKZT: number; // 0 = free
  language: "Kazakh" | "Russian" | "English" | "RU/KZ" | "RU/EN";
  schedule: "Weekdays" | "Evenings" | "Weekends" | "Self-paced";
  rating: number; // 0-5
  certificate: boolean;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  professions: string[]; // profession ids
};

let _id = 0;
const nid = (prefix: string) => `${prefix}-${++_id}`;

type Tmpl = Omit<Course, "id" | "city" | "provider"> & {
  providers: string[];
  cities: (typeof CITIES)[number][];
};

const TEMPLATES: Tmpl[] = [
  // Frontend
  {
    title: "Frontend Pro: React & TypeScript",
    providers: ["nFactorial School", "Tomorrow School", "Astana IT Open"],
    cities: ["Almaty", "Astana", "Shymkent"],
    format: "Offline", durationWeeks: 16, priceKZT: 480_000, language: "RU/KZ",
    schedule: "Evenings", rating: 4.8, certificate: true, level: "Beginner",
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Git"],
    professions: ["frontend-developer"],
  },
  {
    title: "JavaScript Fundamentals",
    providers: ["Astana IT University Open", "Coddy School", "Codify KZ"],
    cities: ["Astana", "Almaty", "Karaganda", "Pavlodar"],
    format: "Hybrid", durationWeeks: 8, priceKZT: 120_000, language: "RU/KZ",
    schedule: "Weekends", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["JavaScript", "HTML/CSS", "Git"],
    professions: ["frontend-developer", "backend-developer"],
  },
  {
    title: "React Mastery",
    providers: ["Stepik · Local mentors", "Skillbox KZ", "Hexlet KZ"],
    cities: ["Online / Remote"],
    format: "Online", durationWeeks: 12, priceKZT: 60_000, language: "Russian",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Intermediate",
    skills: ["React", "Hooks", "State Management"],
    professions: ["frontend-developer"],
  },
  {
    title: "Next.js & SSR Workshop",
    providers: ["nFactorial School", "JetClass"],
    cities: ["Almaty", "Online / Remote"],
    format: "Online", durationWeeks: 6, priceKZT: 95_000, language: "Russian",
    schedule: "Self-paced", rating: 4.7, certificate: true, level: "Intermediate",
    skills: ["Next.js", "React", "SSR", "TypeScript"],
    professions: ["frontend-developer"],
  },
  {
    title: "CSS Architecture & Tailwind",
    providers: ["UX Almaty", "Method Education"],
    cities: ["Almaty", "Astana"],
    format: "Hybrid", durationWeeks: 4, priceKZT: 55_000, language: "Russian",
    schedule: "Evenings", rating: 4.4, certificate: true, level: "Beginner",
    skills: ["CSS", "Tailwind", "Responsive Design"],
    professions: ["frontend-developer", "product-designer"],
  },

  // Backend
  {
    title: "Backend with Python & Django",
    providers: ["IT Step Academy", "Coddy School"],
    cities: ["Almaty", "Astana", "Shymkent"],
    format: "Offline", durationWeeks: 24, priceKZT: 540_000, language: "RU/KZ",
    schedule: "Evenings", rating: 4.4, certificate: true, level: "Beginner",
    skills: ["Python", "Django", "SQL", "REST", "Git"],
    professions: ["backend-developer"],
  },
  {
    title: "Go for Backend Engineers",
    providers: ["Tomorrow School", "Astana Hub School"],
    cities: ["Astana", "Almaty"],
    format: "Hybrid", durationWeeks: 14, priceKZT: 380_000, language: "Russian",
    schedule: "Evenings", rating: 4.7, certificate: true, level: "Intermediate",
    skills: ["Go", "REST", "PostgreSQL", "Docker"],
    professions: ["backend-developer"],
  },
  {
    title: "Node.js & Express in Practice",
    providers: ["Hexlet KZ", "Skillbox KZ"],
    cities: ["Online / Remote"],
    format: "Online", durationWeeks: 10, priceKZT: 140_000, language: "Russian",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Intermediate",
    skills: ["Node.js", "Express", "REST", "MongoDB"],
    professions: ["backend-developer"],
  },
  {
    title: "Linux & DevOps Foundations",
    providers: ["Codify KZ", "EngineerKZ Center"],
    cities: ["Shymkent", "Aktobe", "Karaganda"],
    format: "Offline", durationWeeks: 10, priceKZT: 220_000, language: "RU/KZ",
    schedule: "Weekends", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Linux", "Bash", "Docker", "Networking"],
    professions: ["backend-developer", "cybersecurity-specialist"],
  },
  {
    title: "Docker & Kubernetes Intensive",
    providers: ["Tomorrow School", "Astana Hub School"],
    cities: ["Astana", "Almaty", "Online / Remote"],
    format: "Hybrid", durationWeeks: 6, priceKZT: 180_000, language: "Russian",
    schedule: "Evenings", rating: 4.8, certificate: true, level: "Intermediate",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    professions: ["backend-developer"],
  },
  {
    title: "PostgreSQL Deep Dive",
    providers: ["DataLab Kostanay", "Astana IT Open"],
    cities: ["Kostanay", "Astana", "Online / Remote"],
    format: "Online", durationWeeks: 5, priceKZT: 70_000, language: "Russian",
    schedule: "Self-paced", rating: 4.6, certificate: true, level: "Intermediate",
    skills: ["PostgreSQL", "SQL", "Indexing", "Query Optimization"],
    professions: ["backend-developer", "data-analyst"],
  },

  // Data
  {
    title: "Data Analyst Bootcamp",
    providers: ["DataCamp KZ", "Bilim Online"],
    cities: ["Almaty", "Astana", "Online / Remote"],
    format: "Hybrid", durationWeeks: 20, priceKZT: 450_000, language: "Russian",
    schedule: "Evenings", rating: 4.9, certificate: true, level: "Beginner",
    skills: ["SQL", "Excel", "Python", "Tableau", "Statistics"],
    professions: ["data-analyst"],
  },
  {
    title: "Statistics for Data Science",
    providers: ["Astana Hub School", "Nazarbayev University Open"],
    cities: ["Astana", "Almaty"],
    format: "Offline", durationWeeks: 8, priceKZT: 0, language: "English",
    schedule: "Weekdays", rating: 4.8, certificate: true, level: "Intermediate",
    skills: ["Statistics", "Probability", "Python"],
    professions: ["data-analyst", "ai-engineer"],
  },
  {
    title: "Power BI for Analysts",
    providers: ["Bilim Online", "Skillbox KZ"],
    cities: ["Online / Remote"],
    format: "Online", durationWeeks: 4, priceKZT: 45_000, language: "Russian",
    schedule: "Self-paced", rating: 4.3, certificate: true, level: "Beginner",
    skills: ["Power BI", "DAX", "Data Modeling"],
    professions: ["data-analyst"],
  },
  {
    title: "Tableau от нуля",
    providers: ["DataCamp KZ"],
    cities: ["Online / Remote", "Almaty"],
    format: "Online", durationWeeks: 5, priceKZT: 65_000, language: "Russian",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Tableau", "Data Viz"],
    professions: ["data-analyst"],
  },
  {
    title: "SQL для всех",
    providers: ["DataLab Kostanay", "Bilim Online"],
    cities: ["Kostanay", "Online / Remote", "Almaty", "Astana"],
    format: "Hybrid", durationWeeks: 6, priceKZT: 75_000, language: "Russian",
    schedule: "Evenings", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["SQL", "Databases"],
    professions: ["data-analyst", "backend-developer"],
  },

  // AI / ML
  {
    title: "Machine Learning Fundamentals",
    providers: ["Nazarbayev University Open", "ML Almaty Community"],
    cities: ["Astana", "Almaty"],
    format: "Hybrid", durationWeeks: 16, priceKZT: 300_000, language: "English",
    schedule: "Evenings", rating: 4.9, certificate: true, level: "Intermediate",
    skills: ["Python", "Linear Algebra", "ML Theory", "scikit-learn"],
    professions: ["ai-engineer"],
  },
  {
    title: "Deep Learning with PyTorch",
    providers: ["ML Almaty Community", "Astana IT Open"],
    cities: ["Almaty", "Online / Remote"],
    format: "Online", durationWeeks: 12, priceKZT: 180_000, language: "English",
    schedule: "Weekends", rating: 4.6, certificate: false, level: "Advanced",
    skills: ["PyTorch", "Neural Networks", "Computer Vision"],
    professions: ["ai-engineer"],
  },
  {
    title: "Prompt Engineering & LLM Apps",
    providers: ["nFactorial School", "Tomorrow School"],
    cities: ["Almaty", "Astana", "Online / Remote"],
    format: "Online", durationWeeks: 4, priceKZT: 95_000, language: "Russian",
    schedule: "Self-paced", rating: 4.7, certificate: true, level: "Beginner",
    skills: ["LLMs", "Prompting", "Python", "APIs"],
    professions: ["ai-engineer", "frontend-developer", "digital-marketer"],
  },
  {
    title: "MLOps на практике",
    providers: ["DataCamp KZ"],
    cities: ["Online / Remote", "Astana"],
    format: "Hybrid", durationWeeks: 8, priceKZT: 220_000, language: "Russian",
    schedule: "Evenings", rating: 4.5, certificate: true, level: "Advanced",
    skills: ["MLOps", "Docker", "AWS", "MLflow"],
    professions: ["ai-engineer"],
  },

  // Cybersecurity
  {
    title: "Ethical Hacking Introduction",
    providers: ["Cyber Academy KZ", "Codify KZ"],
    cities: ["Almaty", "Astana", "Karaganda"],
    format: "Offline", durationWeeks: 12, priceKZT: 250_000, language: "Russian",
    schedule: "Evenings", rating: 4.9, certificate: true, level: "Beginner",
    skills: ["Linux", "Networking", "Kali", "Pentesting"],
    professions: ["cybersecurity-specialist"],
  },
  {
    title: "Networking Fundamentals (CCNA)",
    providers: ["Cisco Networking Academy KZ"],
    cities: ["Karaganda", "Almaty", "Astana", "Shymkent"],
    format: "Hybrid", durationWeeks: 16, priceKZT: 150_000, language: "RU/EN",
    schedule: "Evenings", rating: 4.7, certificate: true, level: "Beginner",
    skills: ["Networking", "TCP/IP", "Routing", "Switching"],
    professions: ["cybersecurity-specialist", "backend-developer"],
  },
  {
    title: "SOC Analyst Bootcamp",
    providers: ["Cyber Academy KZ"],
    cities: ["Almaty", "Online / Remote"],
    format: "Hybrid", durationWeeks: 10, priceKZT: 320_000, language: "Russian",
    schedule: "Evenings", rating: 4.6, certificate: true, level: "Intermediate",
    skills: ["SIEM", "Incident Response", "Log Analysis"],
    professions: ["cybersecurity-specialist"],
  },

  // Design
  {
    title: "Product Design Intensive",
    providers: ["Method Education", "UX Almaty", "Tomorrow School"],
    cities: ["Almaty", "Astana"],
    format: "Offline", durationWeeks: 12, priceKZT: 380_000, language: "RU/KZ",
    schedule: "Evenings", rating: 5.0, certificate: true, level: "Beginner",
    skills: ["Figma", "UX", "UI", "Prototyping", "Design Systems"],
    professions: ["product-designer"],
  },
  {
    title: "Figma с нуля",
    providers: ["UX Almaty", "Shabyt Creative School"],
    cities: ["Online / Remote", "Almaty"],
    format: "Online", durationWeeks: 4, priceKZT: 35_000, language: "Russian",
    schedule: "Self-paced", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["Figma", "UI Basics"],
    professions: ["product-designer", "graphic-designer"],
  },
  {
    title: "UX Research Methods",
    providers: ["Tomorrow School", "Method Education"],
    cities: ["Astana", "Almaty"],
    format: "Hybrid", durationWeeks: 6, priceKZT: 160_000, language: "Russian",
    schedule: "Weekends", rating: 4.7, certificate: true, level: "Intermediate",
    skills: ["Interviews", "Usability Testing", "Synthesis"],
    professions: ["ux-researcher", "product-designer"],
  },
  {
    title: "Design Systems в продукте",
    providers: ["Method Education"],
    cities: ["Almaty", "Online / Remote"],
    format: "Online", durationWeeks: 5, priceKZT: 110_000, language: "Russian",
    schedule: "Evenings", rating: 4.8, certificate: true, level: "Advanced",
    skills: ["Design Systems", "Figma", "Tokens", "Documentation"],
    professions: ["product-designer"],
  },
  {
    title: "Motion Design Basics",
    providers: ["Shabyt Creative School"],
    cities: ["Almaty", "Astana"],
    format: "Offline", durationWeeks: 6, priceKZT: 140_000, language: "Russian",
    schedule: "Weekends", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["After Effects", "Animation", "Storyboard"],
    professions: ["graphic-designer", "product-designer"],
  },

  // Marketing
  {
    title: "Digital Marketing Pro",
    providers: ["Skillbox KZ", "MarketingHub Atyrau"],
    cities: ["Online / Remote", "Almaty", "Atyrau"],
    format: "Online", durationWeeks: 20, priceKZT: 280_000, language: "Russian",
    schedule: "Self-paced", rating: 4.4, certificate: true, level: "Beginner",
    skills: ["SEO", "Paid Ads", "Analytics", "Email", "CRM"],
    professions: ["digital-marketer", "smm-manager"],
  },
  {
    title: "SMM практический курс",
    providers: ["MarketingHub Atyrau", "Skillbox KZ"],
    cities: ["Atyrau", "Aktau", "Shymkent", "Online / Remote"],
    format: "Offline", durationWeeks: 6, priceKZT: 95_000, language: "RU/KZ",
    schedule: "Evenings", rating: 4.3, certificate: true, level: "Beginner",
    skills: ["Content Strategy", "Instagram", "TikTok", "Copywriting"],
    professions: ["smm-manager"],
  },
  {
    title: "Performance Marketing",
    providers: ["Skillbox KZ"],
    cities: ["Online / Remote", "Almaty"],
    format: "Online", durationWeeks: 10, priceKZT: 220_000, language: "Russian",
    schedule: "Self-paced", rating: 4.6, certificate: true, level: "Intermediate",
    skills: ["Google Ads", "Meta Ads", "Funnels", "Analytics"],
    professions: ["digital-marketer"],
  },
  {
    title: "SEO с нуля до результата",
    providers: ["MarketingHub Atyrau"],
    cities: ["Online / Remote", "Almaty", "Astana"],
    format: "Online", durationWeeks: 8, priceKZT: 130_000, language: "Russian",
    schedule: "Self-paced", rating: 4.4, certificate: true, level: "Beginner",
    skills: ["SEO", "Keyword Research", "Technical SEO"],
    professions: ["digital-marketer"],
  },
  {
    title: "Копирайтинг и контент",
    providers: ["Shabyt Creative School"],
    cities: ["Online / Remote", "Almaty"],
    format: "Online", durationWeeks: 4, priceKZT: 55_000, language: "Russian",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Copywriting", "Storytelling", "Content Strategy"],
    professions: ["smm-manager", "digital-marketer"],
  },

  // Business / PM
  {
    title: "Agile Project Management",
    providers: ["PM School KZ", "Tomorrow School"],
    cities: ["Astana", "Almaty", "Online / Remote"],
    format: "Hybrid", durationWeeks: 8, priceKZT: 220_000, language: "Russian",
    schedule: "Evenings", rating: 4.7, certificate: true, level: "Intermediate",
    skills: ["Agile", "Scrum", "Jira", "Stakeholders"],
    professions: ["project-manager"],
  },
  {
    title: "Product Management основы",
    providers: ["PM School KZ"],
    cities: ["Almaty", "Online / Remote"],
    format: "Online", durationWeeks: 10, priceKZT: 260_000, language: "Russian",
    schedule: "Evenings", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["Discovery", "Roadmapping", "Metrics", "User Research"],
    professions: ["project-manager", "product-designer"],
  },
  {
    title: "Business Analysis для IT",
    providers: ["IT Step Academy"],
    cities: ["Almaty", "Karaganda"],
    format: "Offline", durationWeeks: 8, priceKZT: 180_000, language: "Russian",
    schedule: "Evenings", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["BPMN", "Requirements", "SQL Basics"],
    professions: ["project-manager", "data-analyst"],
  },

  // Languages
  {
    title: "IELTS 7.0 Intensive",
    providers: ["London Express", "Interpress School"],
    cities: ["Almaty", "Astana", "Shymkent", "Aktobe"],
    format: "Hybrid", durationWeeks: 10, priceKZT: 180_000, language: "English",
    schedule: "Evenings", rating: 4.8, certificate: true, level: "Intermediate",
    skills: ["IELTS Reading", "Writing", "Listening", "Speaking"],
    professions: ["english-teacher"],
  },
  {
    title: "English B1 → B2",
    providers: ["Interpress School", "London Express"],
    cities: ["Shymkent", "Almaty", "Astana", "Taraz", "Pavlodar"],
    format: "Offline", durationWeeks: 16, priceKZT: 140_000, language: "English",
    schedule: "Weekdays", rating: 4.5, certificate: true, level: "Intermediate",
    skills: ["Grammar", "Vocabulary", "Speaking"],
    professions: ["english-teacher", "frontend-developer", "ai-engineer"],
  },
  {
    title: "Business English",
    providers: ["London Express"],
    cities: ["Almaty", "Astana", "Online / Remote"],
    format: "Online", durationWeeks: 8, priceKZT: 95_000, language: "English",
    schedule: "Evenings", rating: 4.6, certificate: true, level: "Intermediate",
    skills: ["Business Vocabulary", "Emails", "Presentations"],
    professions: ["english-teacher", "project-manager"],
  },
  {
    title: "TOEFL Preparation",
    providers: ["Interpress School"],
    cities: ["Almaty", "Astana"],
    format: "Hybrid", durationWeeks: 8, priceKZT: 160_000, language: "English",
    schedule: "Weekends", rating: 4.5, certificate: true, level: "Advanced",
    skills: ["TOEFL", "Academic English"],
    professions: ["english-teacher"],
  },
  {
    title: "Қазақ тілі: kasıbi deñgey",
    providers: ["Bilim Online", "Astana IT Open"],
    cities: ["Online / Remote", "Astana", "Almaty"],
    format: "Online", durationWeeks: 12, priceKZT: 45_000, language: "Kazakh",
    schedule: "Self-paced", rating: 4.7, certificate: true, level: "Intermediate",
    skills: ["Қазақ тілі", "Жазылым", "Сөйлеу"],
    professions: ["english-teacher"],
  },

  // Creative
  {
    title: "Graphic Design Foundations",
    providers: ["Shabyt Creative School"],
    cities: ["Almaty", "Astana", "Shymkent"],
    format: "Offline", durationWeeks: 12, priceKZT: 220_000, language: "Russian",
    schedule: "Evenings", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["Typography", "Illustrator", "Composition", "Color"],
    professions: ["graphic-designer"],
  },
  {
    title: "Иллюстрация в Procreate",
    providers: ["Shabyt Creative School"],
    cities: ["Almaty", "Online / Remote"],
    format: "Online", durationWeeks: 6, priceKZT: 70_000, language: "Russian",
    schedule: "Self-paced", rating: 4.7, certificate: true, level: "Beginner",
    skills: ["Procreate", "Illustration", "Color"],
    professions: ["graphic-designer"],
  },
  {
    title: "Видеомонтаж в Premiere Pro",
    providers: ["Skillbox KZ"],
    cities: ["Online / Remote", "Almaty"],
    format: "Online", durationWeeks: 5, priceKZT: 80_000, language: "Russian",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Premiere Pro", "Editing", "Color Grading"],
    professions: ["graphic-designer", "smm-manager"],
  },
  {
    title: "Фотография: студия и портрет",
    providers: ["Shabyt Creative School"],
    cities: ["Almaty", "Astana"],
    format: "Offline", durationWeeks: 4, priceKZT: 90_000, language: "Russian",
    schedule: "Weekends", rating: 4.6, certificate: true, level: "Beginner",
    skills: ["Composition", "Lighting", "Lightroom"],
    professions: ["graphic-designer"],
  },

  // Engineering
  {
    title: "AutoCAD & Revit Practical",
    providers: ["EngineerKZ Center"],
    cities: ["Aktobe", "Almaty", "Astana", "Aktau", "Atyrau"],
    format: "Offline", durationWeeks: 10, priceKZT: 175_000, language: "RU/KZ",
    schedule: "Weekdays", rating: 4.4, certificate: true, level: "Beginner",
    skills: ["AutoCAD", "Revit", "BIM"],
    professions: ["civil-engineer"],
  },
  {
    title: "Сметное дело и строительство",
    providers: ["EngineerKZ Center"],
    cities: ["Astana", "Karaganda", "Aktobe"],
    format: "Hybrid", durationWeeks: 8, priceKZT: 130_000, language: "Russian",
    schedule: "Evenings", rating: 4.3, certificate: true, level: "Beginner",
    skills: ["Estimating", "Construction Norms", "Excel"],
    professions: ["civil-engineer", "project-manager"],
  },

  // Free / regional access
  {
    title: "Free IT Basics — Tech Orda",
    providers: ["Tech Orda by Astana Hub"],
    cities: ["Online / Remote"],
    format: "Online", durationWeeks: 8, priceKZT: 0, language: "RU/KZ",
    schedule: "Self-paced", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Computer Basics", "Internet", "Soft Skills"],
    professions: ["frontend-developer", "data-analyst", "digital-marketer"],
  },
  {
    title: "Python с нуля",
    providers: ["Coddy School", "Hexlet KZ"],
    cities: ["Pavlodar", "Oskemen", "Semey", "Kyzylorda", "Oral", "Petropavl"],
    format: "Offline", durationWeeks: 10, priceKZT: 140_000, language: "RU/KZ",
    schedule: "Weekends", rating: 4.5, certificate: true, level: "Beginner",
    skills: ["Python", "Algorithms"],
    professions: ["backend-developer", "data-analyst", "ai-engineer", "cybersecurity-specialist"],
  },
  {
    title: "Базовая компьютерная грамотность",
    providers: ["Bilim Online"],
    cities: ["Online / Remote", "Taraz", "Kyzylorda", "Petropavl"],
    format: "Online", durationWeeks: 3, priceKZT: 0, language: "RU/KZ",
    schedule: "Self-paced", rating: 4.3, certificate: true, level: "Beginner",
    skills: ["Windows", "Word", "Excel", "Internet"],
    professions: ["digital-marketer", "smm-manager"],
  },
];

// Expand templates into individual courses (city × provider variations)
export const COURSES: Course[] = [];
for (const tmpl of TEMPLATES) {
  for (const city of tmpl.cities) {
    for (let i = 0; i < tmpl.providers.length; i++) {
      const provider = tmpl.providers[i];
      // tiny price/rating variation so courses feel distinct
      const priceJitter = i === 0 ? 0 : (i % 2 === 0 ? +10_000 : -10_000);
      const ratingJitter = i === 0 ? 0 : (i % 2 === 0 ? +0.1 : -0.1);
      COURSES.push({
        id: nid("c"),
        title: tmpl.title,
        provider,
        city,
        format: tmpl.format,
        durationWeeks: tmpl.durationWeeks,
        priceKZT: Math.max(0, tmpl.priceKZT + priceJitter),
        language: tmpl.language,
        schedule: tmpl.schedule,
        rating: Math.min(5, Math.max(3.5, +(tmpl.rating + ratingJitter).toFixed(1))),
        certificate: tmpl.certificate,
        level: tmpl.level,
        skills: [...tmpl.skills],
        professions: [...tmpl.professions],
      });
    }
  }
}

export const COURSES_BY_ID = Object.fromEntries(COURSES.map((c) => [c.id, c]));

export function formatKZT(n: number): string {
  if (n === 0) return "Бесплатно";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₸";
}

// All unique categories of professions covered by any course (for filter chips)
export const COURSE_CATEGORIES = Array.from(
  new Set(COURSES.flatMap((c) => c.professions)),
);
