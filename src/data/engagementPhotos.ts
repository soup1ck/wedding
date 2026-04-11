export type EngagementPhoto = {
  id: string;
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

const engagementPhoto2018 = new URL("../../people/2018.jpg", import.meta.url)
  .href;
const engagementPhoto2019 = new URL("../../people/2019.jpg", import.meta.url)
  .href;
const engagementPhoto2020 = new URL("../../people/2020.jpg", import.meta.url)
  .href;
const engagementPhoto2021 = new URL("../../people/2021.jpg", import.meta.url)
  .href;
const engagementPhoto2022 = new URL("../../people/2022.jpg", import.meta.url)
  .href;
const engagementPhoto2023 = new URL("../../people/2023.jpg", import.meta.url)
  .href;
const engagementPhoto2024 = new URL("../../people/2024.jpg", import.meta.url)
  .href;
const engagementPhoto2025 = new URL("../../people/2025.jpg", import.meta.url)
  .href;
const engagementPhoto2026 = new URL("../../people/2026.jpg", import.meta.url)
  .href;

export const engagementPhotos: EngagementPhoto[] = [
  {
    id: "engagement-2018",
    thumbSrc: engagementPhoto2018,
    fullSrc: engagementPhoto2018,
    alt: "Мы в 2018 году",
    caption: "2018 вместе",
    width: 721,
    height: 960,
  },
  {
    id: "engagement-2019",
    thumbSrc: engagementPhoto2019,
    fullSrc: engagementPhoto2019,
    alt: "Мы в 2019 году",
    caption: "2019 год",
    width: 960,
    height: 960,
  },
  {
    id: "engagement-2020",
    thumbSrc: engagementPhoto2020,
    fullSrc: engagementPhoto2020,
    alt: "Мы в 2020 году",
    caption: "2020 год",
    width: 960,
    height: 1280,
  },
  {
    id: "engagement-2021",
    thumbSrc: engagementPhoto2021,
    fullSrc: engagementPhoto2021,
    alt: "Мы в 2021 году",
    caption: "2021 год",
    width: 682,
    height: 852,
  },
  {
    id: "engagement-2022",
    thumbSrc: engagementPhoto2022,
    fullSrc: engagementPhoto2022,
    alt: "Мы в 2022 году",
    caption: "2022 год",
    width: 5160,
    height: 6384,
  },
  {
    id: "engagement-2023",
    thumbSrc: engagementPhoto2023,
    fullSrc: engagementPhoto2023,
    alt: "Мы в 2023 году",
    caption: "2023 год",
    width: 1151,
    height: 1280,
  },
  {
    id: "engagement-2024",
    thumbSrc: engagementPhoto2024,
    fullSrc: engagementPhoto2024,
    alt: "Мы в 2024 году",
    caption: "2024 год",
    width: 960,
    height: 1280,
  },
  {
    id: "engagement-2025",
    thumbSrc: engagementPhoto2025,
    fullSrc: engagementPhoto2025,
    alt: "Мы в 2025 году",
    caption: "2025 год",
    width: 960,
    height: 1280,
  },
  {
    id: "engagement-2026",
    thumbSrc: engagementPhoto2026,
    fullSrc: engagementPhoto2026,
    alt: "Мы в 2026 году",
    caption: "2026 и навсегда",
    width: 1280,
    height: 960,
  },
];
