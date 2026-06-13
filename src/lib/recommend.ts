import { COURSES, type Course } from "./data/courses";
import type { UserProfile } from "./profile";
import { getProfession } from "./profile";

export type Recommendation = {
  course: Course;
  score: number; // 0..100
  reasons: string[];
};

export function recommendCourses(profile: UserProfile, limit = 6): Recommendation[] {
  const prof = getProfession(profile);
  const profSkills = new Set(prof?.coreSkills ?? []);

  const scored = COURSES.map<Recommendation>((course) => {
    let score = 0;
    const reasons: string[] = [];

    // profession match
    if (prof && course.professions.includes(prof.id)) {
      score += 45;
      reasons.push(`Directly maps to ${prof.title}`);
    } else if (prof) {
      const overlap = course.skills.filter((s) => profSkills.has(s)).length;
      if (overlap) {
        score += Math.min(25, overlap * 8);
        reasons.push(`Teaches ${overlap} skill${overlap > 1 ? "s" : ""} from your path`);
      }
    } else {
      score += 10;
    }

    // city match (offline strongly prefers same city)
    if (course.city === profile.city) {
      score += 25;
      reasons.push(`Available in ${profile.city}`);
    } else if (course.format === "Online") {
      score += 15;
      reasons.push("Online — available anywhere");
    }

    // skill-gap match: courses that teach skills the user is weakest at
    const gaps = (prof?.coreSkills ?? []).filter((s) => (profile.skills[s] ?? 0) < 40);
    const fillsGap = course.skills.filter((s) => gaps.includes(s));
    if (fillsGap.length) {
      score += Math.min(20, fillsGap.length * 7);
      reasons.push(`Closes gap in ${fillsGap.slice(0, 2).join(", ")}`);
    }

    // rating
    score += (course.rating - 4) * 8; // small boost for high ratings

    return { course, score: Math.max(0, Math.min(100, Math.round(score))), reasons };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
