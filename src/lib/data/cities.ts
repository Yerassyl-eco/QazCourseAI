export const CITIES = [
  "Almaty",
  "Astana",
  "Shymkent",
  "Karaganda",
  "Aktobe",
  "Taraz",
  "Atyrau",
  "Aktau",
  "Kostanay",
  "Pavlodar",
  "Oskemen",
  "Semey",
  "Kyzylorda",
  "Oral",
  "Petropavl",
  "Online / Remote",
] as const;

export type City = (typeof CITIES)[number];
