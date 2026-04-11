export type ProgramItem = {
  time: string;
  title: string;
  description: string;
  align: "left" | "right";
  top: number;
};

export type StoryPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type SaveDateItem = {
  title: string;
  copy: string;
};

export type VenuePhoto = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

export type DetailItem = {
  number: string;
  text: string;
  align: "left" | "right";
};

export type DresscodeLook = {
  id: string;
  src: string;
  alt: string;
  variant: "women" | "men";
  width: number;
  height: number;
};

export type KissMeItem = {
  id: string;
  label: string;
  assetSrc: string;
  startPosition: {
    x: number;
    y: number;
  };
  targetZone: {
    x: number;
    y: number;
    radius: number;
  };
  snapPosition: {
    x: number;
    y: number;
  };
  width: number;
  required: boolean;
};

export type HeroWordLetter = {
  char: string;
  top: number;
  left: number;
  scale: number;
  rotate: number;
};

const engagementPhoto01 = new URL(
  "../../people/photo_2026-03-28_21-24-21_final.jpg",
  import.meta.url,
).href;
const engagementPhoto02 = new URL(
  "../../people/photo_2026-03-28_21-24-36_final.jpg",
  import.meta.url,
).href;
const engagementPhoto03 = new URL(
  "../../people/photo_2026-03-28_21-24-39_final.jpg",
  import.meta.url,
).href;
const engagementPhoto04 = new URL(
  "../../people/photo_2026-03-28_21-24-42_final.jpg",
  import.meta.url,
).href;
const engagementPhoto05 = new URL(
  "../../people/photo_2026-03-28_21-24-45_final.jpg",
  import.meta.url,
).href;
const engagementPhoto06 = new URL(
  "../../people/photo_2026-03-28_21-24-48_final.jpg",
  import.meta.url,
).href;
const dresscodeLookModules = import.meta.glob("../../dresscode/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const kissMeCat = new URL("../../kissme/kissmeV2.png", import.meta.url).href;
const kissMeFlowers = new URL("../../kissme/flowers.png", import.meta.url).href;
const kissMeBow = new URL("../../kissme/bow.png", import.meta.url).href;
const weddingMarch = new URL(
  "../../music/Мендельсон - Свадебный Марш.mp3",
  import.meta.url,
).href;
const saburovHallPhoto = new URL("../../saburov/saburov.png", import.meta.url)
  .href;
const birkinHallPhoto = new URL("../../saburov/birkin.png", import.meta.url)
  .href;
const storyIntroPhoto = new URL("../../history/history1.png", import.meta.url)
  .href;

const dresscodeLooks = (() => {
  const looks = Object.entries(dresscodeLookModules)
    .map(([path, src]) => {
      const filename = path.split("/").pop() ?? path;
      const id = filename.replace(/\.[^.]+$/, "");
      const variant = id.startsWith("w") ? "women" : "men";

      return {
        id,
        src,
        variant,
        width: 1024,
        height: 1536,
        alt:
          variant === "women"
            ? "Женский образ для дресс-кода"
            : "Мужской образ для дресс-кода",
      } satisfies DresscodeLook;
    })
    .sort((left, right) => left.id.localeCompare(right.id));
  const women = looks.filter((look) => look.variant === "women");
  const men = looks.filter((look) => look.variant === "men");
  const mixed: DresscodeLook[] = [];
  const longestGroup = Math.max(women.length, men.length);

  for (let index = 0; index < longestGroup; index += 1) {
    if (men[index]) {
      mixed.push(men[index]);
    }

    if (women[index]) {
      mixed.push(women[index]);
    }
  }

  return mixed;
})();

export const invitationContent = {
  weddingDate: new Date("2026-07-04T15:00:00+03:00"),
  sceneDepths: {
    hero: 146,
    intro: 138,
    story: 182,
    calendar: 132,
    program: 212,
    route: 184,
    dresscode: 122,
    details: 168,
    kissMe: 172,
    rsvp: 148,
    countdown: 138,
  },
  audio: {
    src: weddingMarch,
  },
  hero: {
    kicker: "Анастасия и Владимир",
    names: ["Анастасия", "Владимир"],
    wordLetters: [
      { char: "Л", top: 0, left: 44, scale: 1, rotate: 0 },
      { char: "Ю", top: 14, left: 58, scale: 0.96, rotate: 0 },
      { char: "Б", top: 31, left: 56, scale: 0.93, rotate: 0 },
      { char: "О", top: 49, left: 47, scale: 1.08, rotate: 0 },
      { char: "В", top: 71, left: 50, scale: 0.92, rotate: 0 },
      { char: "Ь", top: 86, left: 50, scale: 0.9, rotate: 0 },
    ] satisfies HeroWordLetter[],
    invitationEyebrow: "Дорогие",
    invitationTitle: "близкие и родные",
    message:
      "Это официальное приглашение на нашу свадьбу! А получили вы его потому, что мы очень хотим видеть вас рядом с нами в этот день!",
  },
  storyIntro: {
    eyebrow: "Наша история",
    title: "",
    paragraphs: [
      "Есть моменты, которые становятся началом чего-то прекрасного. Лайк от Насти и мое первое сообщение были именно таким моментом — важным и изменившим всё.",
    ],
    monogram: "А & В",
    image: {
      src: storyIntroPhoto,
      alt: "Настя и Вова в моменте из нашей истории",
    },
  },
  storyGallery: {
    eyebrow: "",
    title: "Наши фото",
    photos: [
      {
        src: engagementPhoto01,
        alt: "Ура! Ты приблизил фото, продолжай листать дальше",
      },
      {
        src: engagementPhoto02,
        alt: "Еще чуть-чуть",
      },
      {
        src: engagementPhoto03,
        alt: "И еще",
      },
      {
        src: engagementPhoto05,
        alt: "Почти добрались",
      },
      {
        src: engagementPhoto06,
        alt: "Тут должно быть что-то с юмором, но вы просто листайте дальше",
      },
    ] satisfies StoryPhoto[],
  },
  saveDate: {
    eyebrow: "Сохраните дату",
    title: "4 июля 2026",
    items: [
      {
        title: "Суббота",
        copy: "День нашей свадьбы",
      },
      {
        title: "15:00",
        copy: "Сбор гостей",
      },
    ] satisfies SaveDateItem[],
  },
  program: {
    title: "План дня",
    items: [
      {
        time: "15:00",
        title: "Сбор гостей",
        description:
          "Ваши улыбки и хорошее настроение пригодятся вам на welcome-фуршете.",
        align: "left",
        top: 9,
      },
      {
        time: "15:30",
        title: "Выездная церемония",
        description: "Трогательная регистрация и наши главные слова «Да!».",
        align: "right",
        top: 23,
      },
      {
        time: "17:00",
        title: "Праздничный ужин",
        description: "Танцы, веселье, любовь и чудесная атмосфера.",
        align: "left",
        top: 49,
      },
      {
        time: "23:00",
        title: "Завершение вечера",
        description: "Тёплое завершение праздника в окружении самых близких.",
        align: "right",
        top: 63,
      },
    ] satisfies ProgramItem[],
  },
  venue: {
    eyebrow: "Место проведения",
    title: "",
    subtitle: "",
    photos: [
      {
        src: saburovHallPhoto,
        alt: "Сабуров Холл на набережной",
        title: "Сабуров Холл",
        description:
          "Видовая площадка на набережной для нашего свадебного вечера",
      },
      {
        src: birkinHallPhoto,
        alt: "Зал Биркин в Сабуров Холле",
        title: "Зал Биркин",
        description:
          "Светлый зал с панорамным видом на набережную для праздничного ужина",
      },
    ] satisfies VenuePhoto[],
    city: "г. Воронеж",
    addressLines: ["ул. Пролетарская, 87в", ""],
    mapUrl:
      "https://yandex.ru/maps/?text=%D0%A1%D0%B0%D0%B1%D1%83%D1%80%D0%BE%D0%B2%20%D0%A5%D0%BE%D0%BB%D0%BB%2C%20%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%2C%20%D0%9F%D1%80%D0%BE%D0%BB%D0%B5%D1%82%D0%B0%D1%80%D1%81%D0%BA%D0%B0%D1%8F%2087%D0%B2",
    mapLabel: "Открыть на карте",
  },
  dresscode: {
    title: "Дресс-код",
    description:
      "Мы очень ждём и с удовольствием готовимся к нашему незабываемому дню! Поддержите нас вашими улыбками и объятиями, а также красивыми нарядами в палитре торжества — ice blue. Соблюдение дресс-кода желательно, но не обязательно. Просим воздержаться от образов в стиле total white и оставить их только для невесты.",
    looks: dresscodeLooks,
  },
  details: {
    title: "Детали",
    items: [
      {
        number: "01",
        text: "Просим вас не дарить нам цветы — сразу после свадьбы мы улетаем в свадебное путешествие и не успеем насладиться их красотой.",
        align: "left",
      },
      {
        number: "02",
        text: "Вы можете не переживать по поводу подарка, любая комфортная для вас сумма в конверте приблизит нас к мечте!",
        align: "right",
      },
      {
        number: "03",
        text: "Будем признательны, если вы не будете кричать «Горько» во время наших поцелуев. (Только, если чуть-чуть)",
        align: "left",
      },
    ] satisfies DetailItem[],
    image: {
      src: engagementPhoto04,
      alt: "Анастасия и Владимир вместе на закате",
    },
  },
  kissMe: {
    titleLineOne: "Киссми собирается",
    titleLineTwo: "к нам на свадьбу",
    subtitle: "помогите ей собраться",
    hint: "",
    completeMessage: "Теперь я готова!",
    cat: {
      src: kissMeCat,
      alt: "Кошечка Киссми собирается на свадьбу",
    },
    items: [
      {
        id: "flowers",
        label: "Букет",
        assetSrc: kissMeFlowers,
        startPosition: { x: 18, y: 58 },
        targetZone: { x: 21, y: 70, radius: 15.84 },
        snapPosition: { x: 18, y: 67 },
        width: 22,
        required: true,
      },
      {
        id: "bow",
        label: "Бабочка",
        assetSrc: kissMeBow,
        startPosition: { x: 78, y: 30 },
        targetZone: { x: 27, y: 48, radius: 12.96 },
        snapPosition: { x: 28, y: 47 },
        width: 19,
        required: true,
      },
    ] satisfies KissMeItem[],
  },
  rsvp: {
    title: "Анкета гостя",
    description:
      "Пожалуйста, заполните форму до 20.05.2026, чтобы мы могли комфортно организовать праздник для всех гостей.",
    fields: {
      fullName: {
        label: "Ваше имя и фамилия",
        placeholder: "Иван Петров",
      },
      phone: {
        label: "Номер телефона",
        placeholder: "+7 (900) 123-45-67",
      },
      attending: {
        label: "Сможете присутствовать?",
        placeholder: "Выберите вариант",
        options: [
          { value: "yes", label: "Да, с радостью!" },
          { value: "no", label: "К сожалению, не смогу" },
        ],
      },
      favoriteTrack: {
        label: "Любимый трек",
        placeholder: "Elvis Presley - Can't Help Falling in Love",
      },
      drinkPreferences: {
        label: "Предпочтения по напиткам",
        hint: "Можно выбрать несколько вариантов. Нужно отметить хотя бы один.",
        options: [
          { value: "Вино", label: "Вино" },
          { value: "Вермут", label: "Вермут" },
          { value: "Виски", label: "Виски" },
          { value: "Водка", label: "Водка" },
          { value: "Шампанское", label: "Шампанское" },
          { value: "Настойка сливочная", label: "Настойка сливочная" },
          { value: "Джин", label: "Джин" },
          { value: "Безалкогольное", label: "Безалкогольное" },
        ],
      },
      message: {
        label: "Комментарий",
        placeholder: "Есть аллергии / и тд",
      },
    },
    submitLabel: "Отправить",
    submittingLabel: "Отправляем...",
    successMessage: "Спасибо! Мы получили ваш ответ.",
    errorMessage: "Не удалось отправить ответ. Попробуйте ещё раз.",
    googleFormMissingMessage:
      "Нужно заполнить настройки Google Form для отправки ответов.",
  },
  countdownSection: {
    title: "До нашей свадьбы осталось:",
    message: [
      "В конце концов, самое важное в любом празднике — это люди, которые рядом.",
      "А наши самые важные люди — это вы.",
      "С нетерпением ждём встречи!",
    ],
    expiredMessage: "Мы уже сказали друг другу «Да!»",
  },
} as const;
