export type Profession = {
  id: string;
  title: string;
  category: "IT" | "Design" | "Business" | "Languages" | "Engineering" | "Marketing" | "Creative";
  blurb: string;
  coreSkills: string[];
  // average salary in Kazakhstan, KZT/month, rough
  salaryKZT: [number, number];
};

export const PROFESSIONS: Profession[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "IT",
    blurb: "Build modern web interfaces with React, TypeScript, and design systems.",
    coreSkills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Git", "UI Fundamentals"],
    salaryKZT: [400_000, 1_200_000],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "IT",
    blurb: "Design APIs, databases, and the systems that power applications.",
    coreSkills: ["Python or Go", "SQL", "REST/GraphQL", "Linux", "Docker", "System Design"],
    salaryKZT: [500_000, 1_400_000],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "IT",
    blurb: "Turn raw data into decisions with SQL, statistics, and dashboards.",
    coreSkills: ["SQL", "Excel", "Statistics", "Python", "Tableau / Power BI", "Storytelling"],
    salaryKZT: [350_000, 900_000],
  },
  {
    id: "ai-engineer",
    title: "AI / ML Engineer",
    category: "IT",
    blurb: "Build and ship machine learning systems in production.",
    coreSkills: ["Python", "Linear Algebra", "ML Theory", "PyTorch", "MLOps", "English"],
    salaryKZT: [600_000, 2_000_000],
  },
  {
    id: "cybersecurity-specialist",
    title: "Cybersecurity Specialist",
    category: "IT",
    blurb: "Protect infrastructure, find vulnerabilities, respond to incidents.",
    coreSkills: ["Networking", "Linux", "Python", "Cryptography", "SIEM", "Pentesting"],
    salaryKZT: [500_000, 1_500_000],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    category: "Design",
    blurb: "Design intuitive products end-to-end — research, flows, UI, prototypes.",
    coreSkills: ["Figma", "UX Research", "Interaction Design", "Visual Design", "Design Systems"],
    salaryKZT: [400_000, 1_100_000],
  },
  {
    id: "ux-researcher",
    title: "UX Researcher",
    category: "Design",
    blurb: "Discover what users need through interviews, testing, and data.",
    coreSkills: ["Qualitative Research", "Surveys", "Analytics", "Synthesis", "Communication"],
    salaryKZT: [350_000, 900_000],
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    category: "Marketing",
    blurb: "Grow brands through performance, content, and analytics.",
    coreSkills: ["SEO", "Paid Ads", "Analytics", "Copywriting", "Email", "CRM"],
    salaryKZT: [300_000, 800_000],
  },
  {
    id: "smm-manager",
    title: "SMM Manager",
    category: "Marketing",
    blurb: "Build communities and brand presence on social platforms.",
    coreSkills: ["Content Strategy", "Copywriting", "Instagram/TikTok", "Analytics", "Design Basics"],
    salaryKZT: [200_000, 600_000],
  },
  {
    id: "project-manager",
    title: "Project Manager",
    category: "Business",
    blurb: "Lead teams to ship products on time and within scope.",
    coreSkills: ["Agile/Scrum", "Stakeholder Comms", "Jira", "Roadmapping", "Risk Management"],
    salaryKZT: [450_000, 1_300_000],
  },
  {
    id: "english-teacher",
    title: "English Teacher / IELTS Tutor",
    category: "Languages",
    blurb: "Teach English at any level, prepare students for IELTS / TOEFL.",
    coreSkills: ["C1+ English", "Methodology", "IELTS structure", "Speaking practice"],
    salaryKZT: [200_000, 700_000],
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    category: "Creative",
    blurb: "Craft visual identity, illustrations, and brand systems.",
    coreSkills: ["Figma", "Illustrator", "Typography", "Composition", "Color Theory"],
    salaryKZT: [200_000, 700_000],
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    category: "Engineering",
    blurb: "Design and supervise construction of infrastructure and buildings.",
    coreSkills: ["AutoCAD", "Revit", "Structural Analysis", "Project Management", "Materials"],
    salaryKZT: [300_000, 900_000],
  },
];

export const PROFESSIONS_BY_ID = Object.fromEntries(PROFESSIONS.map((p) => [p.id, p]));
