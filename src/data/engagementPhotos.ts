export type EngagementPhoto = {
  id: string;
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
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

export const engagementPhotos: EngagementPhoto[] = [
  {
    id: "engagement-01",
    thumbSrc: engagementPhoto01,
    fullSrc: engagementPhoto01,
    alt: "Ура! Ты приблизил фото, продолжай листать дальше",
    width: 5160,
    height: 6388,
  },
  {
    id: "engagement-02",
    thumbSrc: engagementPhoto02,
    fullSrc: engagementPhoto02,
    alt: "Еще чуть-чуть",
    width: 5160,
    height: 6360,
  },
  {
    id: "engagement-03",
    thumbSrc: engagementPhoto03,
    fullSrc: engagementPhoto03,
    alt: "И еще",
    width: 5160,
    height: 6276,
  },
  {
    id: "engagement-04",
    thumbSrc: engagementPhoto04,
    fullSrc: engagementPhoto04,
    alt: "Почти добрались",
    width: 5160,
    height: 6360,
  },
  {
    id: "engagement-05",
    thumbSrc: engagementPhoto05,
    fullSrc: engagementPhoto05,
    alt: "Тут должно быть что-то с юмором, но вы просто листайте дальше",
    width: 5160,
    height: 6384,
  },
  {
    id: "engagement-06",
    thumbSrc: engagementPhoto06,
    fullSrc: engagementPhoto06,
    alt: "Финальный кадр, а теперь можно смотреть заново",
    width: 5456,
    height: 8192,
  },
];
