// Deep AI assessment: 40 questions across 5 sections.
// Mixed types: multiple choice, rating (1-10), scenario, open-ended.
// Each option carries `tags` mapped to profession categories used by scoring.

export type Category = "IT" | "Design" | "Business" | "Languages" | "Engineering" | "Marketing" | "Creative" | "Science" | "Medicine";

export type MultiOption = { id: string; kk: string; ru: string; tags: Category[] };

export type Question =
  | { id: string; type: "multi"; section: string; kk: string; ru: string; options: MultiOption[]; multi?: boolean }
  | { id: string; type: "rating"; section: string; kk: string; ru: string; tags: Category[] }
  | { id: string; type: "scenario"; section: string; kk: string; ru: string; options: MultiOption[] }
  | { id: string; type: "open"; section: string; kk: string; ru: string; hintKK?: string; hintRU?: string; minLen?: number };

const S1 = { kk: "Сен туралы", ru: "О тебе" };
const S2 = { kk: "Қызығушылықтарың", ru: "Интересы" };
const S3 = { kk: "Күшті жақтарыңды бағала", ru: "Оцени сильные стороны" };
const S4 = { kk: "Сценарийлер", ru: "Сценарии" };
const S5 = { kk: "Армандарың мен мақсаттарың", ru: "Мечты и цели" };

export const SECTIONS = [S1, S2, S3, S4, S5];

export const QUESTIONS: Question[] = [
  // ── Section 1: About you (5)
  { id: "fav-subject", type: "multi", section: "s1", kk: "Мектепте қандай пәндерді көбірек ұнатасың? (бірнешеуін таңда)", ru: "Какие предметы в школе тебе ближе всего? (можно несколько)", multi: true, options: [
    { id: "math", kk: "Математика", ru: "Математика", tags: ["IT", "Engineering", "Science"] },
    { id: "physics", kk: "Физика", ru: "Физика", tags: ["Engineering", "Science", "IT"] },
    { id: "bio", kk: "Биология / Химия", ru: "Биология / Химия", tags: ["Medicine", "Science"] },
    { id: "lit", kk: "Әдебиет / Тілдер", ru: "Литература / Языки", tags: ["Languages", "Marketing", "Creative"] },
    { id: "art", kk: "Өнер / Сурет", ru: "Искусство / Рисование", tags: ["Creative", "Design"] },
    { id: "history", kk: "Тарих / Қоғамтану", ru: "История / Обществознание", tags: ["Business", "Languages"] },
    { id: "cs", kk: "Информатика", ru: "Информатика", tags: ["IT"] },
    { id: "econ", kk: "Экономика", ru: "Экономика", tags: ["Business", "Marketing"] },
  ]},
  { id: "hobby", type: "multi", section: "s1", kk: "Бос уақытыңда не істегенді ұнатасың?", ru: "Чем любишь заниматься в свободное время?", multi: true, options: [
    { id: "code", kk: "Код жазу немесе техникамен араласу", ru: "Писать код или возиться с техникой", tags: ["IT"] },
    { id: "draw", kk: "Сурет, иллюстрация, дизайн", ru: "Рисовать, иллюстрировать, дизайнить", tags: ["Creative", "Design"] },
    { id: "games", kk: "Видеоойындар", ru: "Видеоигры", tags: ["IT", "Creative"] },
    { id: "books", kk: "Кітап оқу", ru: "Читать книги", tags: ["Languages", "Science"] },
    { id: "social", kk: "Достармен серуен / іс-шаралар ұйымдастыру", ru: "Гулять с друзьями / организовывать события", tags: ["Business", "Marketing"] },
    { id: "music", kk: "Музыка / видео жасау", ru: "Делать музыку / видео", tags: ["Creative"] },
    { id: "build", kk: "Қолмен бір нәрсе жасау, жөндеу", ru: "Что-то делать руками, чинить", tags: ["Engineering"] },
    { id: "help", kk: "Адамдарға көмектесу, оқыту", ru: "Помогать людям, учить", tags: ["Medicine", "Languages", "Business"] },
  ]},
  { id: "workenv", type: "multi", section: "s1", kk: "Сені қандай жұмыс ортасы көбірек қызықтырады?", ru: "Какая рабочая среда тебе ближе?", options: [
    { id: "remote", kk: "Үйде, өз бетімше, тыныш", ru: "Дома, в одиночку, спокойно", tags: ["IT", "Creative", "Design"] },
    { id: "team", kk: "Бір команда, бір кеңсе, ынтымақ", ru: "Команда, офис, постоянная коммуникация", tags: ["Business", "Marketing"] },
    { id: "field", kk: "Далада / адамдармен / қозғалыста", ru: "В поле / с людьми / в движении", tags: ["Engineering", "Medicine"] },
    { id: "lab", kk: "Зертхана / зерттеу", ru: "Лаборатория / исследование", tags: ["Science", "Medicine"] },
  ]},
  { id: "study-style", type: "multi", section: "s1", kk: "Қалай оқуды ұнатасың?", ru: "Как тебе удобнее учиться?", options: [
    { id: "video", kk: "Видеосабақтар арқылы өз қарқыныммен", ru: "Видеоуроки в своём темпе", tags: ["IT"] },
    { id: "practice", kk: "Тек тәжірибе арқылы — жобалар жасап", ru: "Только через практику и проекты", tags: ["IT", "Engineering", "Creative"] },
    { id: "teacher", kk: "Тірі мұғаліммен, кері байланыспен", ru: "С живым преподавателем и фидбэком", tags: ["Languages", "Business"] },
    { id: "books", kk: "Кітап / мақала оқу", ru: "Через книги и статьи", tags: ["Science", "Languages"] },
  ]},
  { id: "budget", type: "multi", section: "s1", kk: "Бір айлық оқуға бюджет (₸):", ru: "Бюджет на обучение в месяц (₸):", options: [
    { id: "free", kk: "Тегін / минималды", ru: "Бесплатно / минимум", tags: [] },
    { id: "low", kk: "30 000 дейін", ru: "до 30 000", tags: [] },
    { id: "mid", kk: "30 000 — 100 000", ru: "30 000 — 100 000", tags: [] },
    { id: "high", kk: "100 000+", ru: "100 000+", tags: [] },
  ]},

  // ── Section 2: Interests (5 multi)
  { id: "tech-interest", type: "multi", section: "s2", kk: "Қандай технологиялар сені қызықтырады? (бірнешеуін таңда)", ru: "Какие технологии тебя интересуют?", multi: true, options: [
    { id: "web", kk: "Веб / қосымшалар", ru: "Веб / приложения", tags: ["IT"] },
    { id: "ai", kk: "Жасанды интеллект", ru: "Искусственный интеллект", tags: ["IT", "Science"] },
    { id: "robot", kk: "Робототехника", ru: "Робототехника", tags: ["Engineering"] },
    { id: "crypto", kk: "Блокчейн / қаржы", ru: "Блокчейн / финансы", tags: ["IT", "Business"] },
    { id: "cyber", kk: "Киберқауіпсіздік", ru: "Кибербезопасность", tags: ["IT"] },
    { id: "none", kk: "Технологияға қызықпаймын", ru: "Технологии не интересуют", tags: ["Creative", "Languages", "Medicine"] },
  ]},
  { id: "creative-interest", type: "multi", section: "s2", kk: "Шығармашылықта не жақын?", ru: "Что ближе в творчестве?", multi: true, options: [
    { id: "ux", kk: "Қолданушы интерфейстері", ru: "Интерфейсы", tags: ["Design"] },
    { id: "brand", kk: "Брендтер / иллюстрация", ru: "Бренды / иллюстрация", tags: ["Creative", "Design"] },
    { id: "video", kk: "Видео / монтаж", ru: "Видео / монтаж", tags: ["Creative"] },
    { id: "music", kk: "Музыка / дыбыс", ru: "Музыка / звук", tags: ["Creative"] },
    { id: "fashion", kk: "Мода / стиль", ru: "Мода / стиль", tags: ["Creative"] },
    { id: "none", kk: "Шығармашылық — менікі емес", ru: "Творчество — не моё", tags: ["IT", "Engineering", "Science"] },
  ]},
  { id: "people-interest", type: "multi", section: "s2", kk: "Адамдармен қандай байланыс жақын?", ru: "Какое взаимодействие с людьми тебе ближе?", options: [
    { id: "teach", kk: "Оқыту / тәлімгерлік", ru: "Обучать / наставлять", tags: ["Languages", "Business"] },
    { id: "lead", kk: "Көшбасшылық / команда басқару", ru: "Лидерство / управление командой", tags: ["Business"] },
    { id: "heal", kk: "Көмектесу / емдеу", ru: "Помогать / лечить", tags: ["Medicine"] },
    { id: "persuade", kk: "Сату / сендіру", ru: "Продавать / убеждать", tags: ["Marketing", "Business"] },
    { id: "solo", kk: "Жалғыз жұмыс істеймін", ru: "Предпочитаю работать один", tags: ["IT", "Creative", "Science"] },
  ]},
  { id: "science-interest", type: "multi", section: "s2", kk: "Ғылыммен қаншалықты қызығасың?", ru: "Насколько тебе интересна наука?", options: [
    { id: "very", kk: "Зерттеуді жақсы көремін", ru: "Обожаю исследовать", tags: ["Science", "Medicine"] },
    { id: "some", kk: "Қызықты, бірақ кәсіп ретінде емес", ru: "Интересно, но не как профессия", tags: [] },
    { id: "no", kk: "Жоқ", ru: "Нет", tags: ["Business", "Marketing"] },
  ]},
  { id: "lang-interest", type: "multi", section: "s2", kk: "Қандай тілдерді білесің / үйренгің келеді?", ru: "Какие языки знаешь или хочешь учить?", multi: true, options: [
    { id: "en", kk: "Ағылшын", ru: "Английский", tags: ["IT", "Business", "Languages"] },
    { id: "ru", kk: "Орыс", ru: "Русский", tags: [] },
    { id: "kk", kk: "Қазақ", ru: "Казахский", tags: [] },
    { id: "cn", kk: "Қытай", ru: "Китайский", tags: ["Business", "Languages"] },
    { id: "tr", kk: "Түрік", ru: "Турецкий", tags: ["Languages"] },
    { id: "de", kk: "Неміс", ru: "Немецкий", tags: ["Engineering", "Languages"] },
  ]},

  // ── Section 3: Self-rating (10)
  { id: "r-logic", type: "rating", section: "s3", kk: "Логикалық ойлау", ru: "Логическое мышление", tags: ["IT", "Engineering", "Science"] },
  { id: "r-creative", type: "rating", section: "s3", kk: "Креативтілік", ru: "Креативность", tags: ["Creative", "Design", "Marketing"] },
  { id: "r-lead", type: "rating", section: "s3", kk: "Көшбасшылық", ru: "Лидерство", tags: ["Business"] },
  { id: "r-comm", type: "rating", section: "s3", kk: "Коммуникация", ru: "Коммуникация", tags: ["Marketing", "Business", "Languages"] },
  { id: "r-math", type: "rating", section: "s3", kk: "Математикалық қабілет", ru: "Математические способности", tags: ["IT", "Engineering", "Science"] },
  { id: "r-empathy", type: "rating", section: "s3", kk: "Эмпатия / адамдарды түсіну", ru: "Эмпатия / понимание людей", tags: ["Medicine", "Design", "Languages"] },
  { id: "r-detail", type: "rating", section: "s3", kk: "Бөлшекке мұқияттылық", ru: "Внимание к деталям", tags: ["Design", "Engineering", "Medicine"] },
  { id: "r-curious", type: "rating", section: "s3", kk: "Білуге құмарлық", ru: "Любознательность", tags: ["Science", "IT"] },
  { id: "r-tech", type: "rating", section: "s3", kk: "Техникаға бейімділік", ru: "Техническая склонность", tags: ["IT", "Engineering"] },
  { id: "r-discipline", type: "rating", section: "s3", kk: "Өзін-өзі ұйымдастыру", ru: "Самоорганизация", tags: ["Business"] },

  // ── Section 4: Scenarios (5)
  { id: "sc-weekend", type: "scenario", section: "s4", kk: "Бос демалысың бар. Ең қызықтысы — қайсы?", ru: "У тебя свободный выходной. Что выберешь?", options: [
    { id: "code", kk: "Жаңа қосымшаны нөлден жазу", ru: "Написать с нуля новое приложение", tags: ["IT"] },
    { id: "design", kk: "Жаңа брендтің визуалын жобалау", ru: "Спроектировать визуал нового бренда", tags: ["Design", "Creative"] },
    { id: "event", kk: "Іс-шара ұйымдастыру", ru: "Организовать ивент", tags: ["Business", "Marketing"] },
    { id: "study", kk: "Қызықты тақырып бойынша курс өту", ru: "Пройти курс по интересной теме", tags: ["Science"] },
    { id: "help", kk: "Біреуге көмектесу / еріктілер жұмысы", ru: "Помочь кому-то / волонтёрить", tags: ["Medicine"] },
  ]},
  { id: "sc-problem", type: "scenario", section: "s4", kk: "Командаңда үлкен мәселе пайда болды. Сенің рөлің:", ru: "В команде возникла большая проблема. Твоя роль:", options: [
    { id: "analyze", kk: "Деректерді жинап, түбіне жетем", ru: "Соберу данные и докопаюсь до сути", tags: ["IT", "Science"] },
    { id: "lead", kk: "Жұртты ұйымдастырып, бағыт беремін", ru: "Соберу людей и задам направление", tags: ["Business"] },
    { id: "calm", kk: "Эмоцияны басып, әр адамды тыңдаймын", ru: "Сглажу эмоции, выслушаю каждого", tags: ["Medicine", "Languages"] },
    { id: "create", kk: "Стандартты емес шешім ойлап табамын", ru: "Придумаю нестандартное решение", tags: ["Creative", "Design"] },
  ]},
  { id: "sc-success", type: "scenario", section: "s4", kk: "10 жылдан кейінгі жетістік сен үшін:", ru: "Успех через 10 лет — это:", options: [
    { id: "money", kk: "Жоғары жалақы мен қаржылық еркіндік", ru: "Высокая зарплата и финансовая свобода", tags: ["IT", "Business"] },
    { id: "impact", kk: "Жұртқа пайда тигізетін жоба", ru: "Проект, который реально помогает людям", tags: ["Medicine", "Engineering"] },
    { id: "fame", kk: "Танымалдық, ықпал", ru: "Известность, влияние", tags: ["Creative", "Marketing"] },
    { id: "expert", kk: "Өз саласындағы терең сарапшы", ru: "Глубокий эксперт в своей области", tags: ["Science", "Engineering", "IT"] },
  ]},
  { id: "sc-start", type: "scenario", section: "s4", kk: "Жаңа жобада сен қалай бастайсың?", ru: "Как ты начинаешь новый проект?", options: [
    { id: "plan", kk: "Жоспар құрып, барлығын жазып шығам", ru: "Составлю план и распишу всё по шагам", tags: ["Business", "Engineering"] },
    { id: "proto", kk: "Бірден прототип жасап көрем", ru: "Сразу делаю прототип", tags: ["IT", "Design"] },
    { id: "research", kk: "Зерттеуден бастаймын", ru: "Начинаю с исследования", tags: ["Science", "Design"] },
    { id: "talk", kk: "Адамдармен сөйлесіп, идея жинаймын", ru: "Сначала поговорю с людьми и соберу идеи", tags: ["Marketing", "Languages"] },
  ]},
  { id: "sc-fail", type: "scenario", section: "s4", kk: "Сәтсіздікке ұшырадың. Реакцияң:", ru: "Ты потерпел неудачу. Реакция:", options: [
    { id: "analyze", kk: "Не дұрыс емес болғанын талдаймын", ru: "Разбираю, что пошло не так", tags: ["IT", "Science"] },
    { id: "again", kk: "Бірден қайта көрем", ru: "Сразу пробую снова", tags: ["Business", "Engineering"] },
    { id: "share", kk: "Біреумен бөлісіп, кеңес сұраймын", ru: "Поделюсь и спрошу совета", tags: ["Languages", "Medicine"] },
    { id: "rest", kk: "Демалып, басқа қырынан көрем", ru: "Отдыхаю и смотрю под другим углом", tags: ["Creative"] },
  ]},

  // ── Section 5: Open-ended (15) — AI analyzes these in natural language
  { id: "o-self", type: "open", section: "s5", kk: "Өзің туралы бірнеше сөйлеммен айт.", ru: "Расскажи о себе в нескольких предложениях.", hintKK: "Кім екеніңді, не нәрсе қызықтыратыныңды.", hintRU: "Кто ты, что тебя зажигает.", minLen: 30 },
  { id: "o-flow", type: "open", section: "s5", kk: "Қандай іс істегенде уақытты ұмытасың?", ru: "За каким занятием ты теряешь счёт времени?", hintKK: "Бірден ойыңа келген нәрсені жаз.", hintRU: "Пиши то, что приходит первым.", minLen: 20 },
  { id: "o-proud", type: "open", section: "s5", kk: "Ең мақтан тұтатын жетістігің қандай?", ru: "Каким своим достижением ты гордишься больше всего?", minLen: 20 },
  { id: "o-future", type: "open", section: "s5", kk: "5 жылдан кейінгі болашағыңды елестетіп жаз.", ru: "Опиши своё будущее через 5 лет.", minLen: 30 },
  { id: "o-nomoney", type: "open", section: "s5", kk: "Егер ақша мәселе болмаса, қандай мамандықты таңдар едің?", ru: "Если бы деньги не имели значения, какую профессию ты бы выбрал?", minLen: 15 },
  { id: "o-skills", type: "open", section: "s5", kk: "Қандай дағдыларды дамытқың келеді?", ru: "Какие навыки ты хотел бы развить?", minLen: 15 },
  { id: "o-problem", type: "open", section: "s5", kk: "Әлемде қандай мәселені шешкің келеді?", ru: "Какую проблему в мире ты хотел бы решить?", minLen: 20 },
  { id: "o-hero", type: "open", section: "s5", kk: "Сенің кумирің / шабыттандыратын адамың кім және неге?", ru: "Кто твой кумир / кто тебя вдохновляет и почему?", minLen: 15 },
  { id: "o-fear", type: "open", section: "s5", kk: "Мансапта ең қорқатын нәрсең қандай?", ru: "Чего ты больше всего боишься в карьере?", minLen: 15 },
  { id: "o-environment", type: "open", section: "s5", kk: "Қандай жұмыс ортасы сені бақытты етеді?", ru: "Какая рабочая среда сделает тебя счастливым?", minLen: 20 },
];

export const RECOMMENDED_OPEN_MIN = 15;
