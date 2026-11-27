import { img } from "./site";

// Data for the top of the home page (map, Thailand Game Show, All for One, เข้าร่วมกับ Hamster Hub). Only facts we can point to:
// - names and makers: the map's review data (hamsterhub-hall-of-fame-map, public/__local-preview/data.json)
// - awards: the team sheet (TGGS 2026 Top 12 for RE//SLASH) and the owner (depa 2026 winner for Apocalypis Building)
// - camp: the Portfolio Camp page (github.com/PepesX231/PortfolioCamp)
// RE//SLASH is the newer name of SLASH//SPEED (same game by น้องดินสอ), so it is listed once.

export const MAP_APP = "/hamtercocol/map-app/?embed";

// mapProject: the same work's id in the 3D map's data, so a student card on the map can jump here.
export type Work = { id: string; name: string; by: string; award?: string; clip: string; poster: string; mapProject?: string };

// Thailand Game Show (the owner, 27 พ.ย.: this row is the Game Show works)
export const GAME_SHOW: Work[] = [
  { id: "reslash", name: "RE//SLASH", by: "น้องดินสอ", award: "TGGS 2026 Top 12", clip: img("afo-reslash.mp4"), poster: img("afo-reslash.webp"), mapProject: "project-reslash" },
  { id: "apocalypis", name: "Apocalypis Building", by: "น้องฟาร์", award: "ชนะเลิศ depa 2026", clip: img("afo-apocalypis.mp4"), poster: img("afo-apocalypis.webp") },
  { id: "potato", name: "Potatogame", by: "น้องธาม", clip: img("afo-potato.mp4"), poster: img("afo-potato.webp"), mapProject: "project-potatogame" },
  { id: "tripora", name: "TripOra", by: "น้องเตอร์", clip: img("afo-tripora.mp4"), poster: img("afo-tripora.webp"), mapProject: "project-tripora" },
  { id: "lasthost", name: "The Last Host", by: "น้องปัณณ์", clip: img("afo-lasthost.mp4"), poster: img("afo-lasthost.webp"), mapProject: "project-the-last-host" },
];

// All for One University: only SmartParkin' is marked All for One in the map data so far. More works and clips from the team.
export const ALL_FOR_ONE: Work[] = [
  { id: "smartparkin", name: "SmartParkin'", by: "น้องปันปัน", clip: img("afo-smartparkin.mp4"), poster: img("afo-smartparkin.webp"), mapProject: "project-smartparkin" },
];

// Sections of the home page the map can send visitors to (see components/MapFrame.tsx).
export const SECTIONS = { tgs: "Thailand Game Show", afo: "All for One" } as const;

export const CAMP = {
  name: "Portfolio Camp",
  for: "TCAS 1",
  when: "4–6 ธ.ค. 2569",
  where: "ออนไลน์ผ่าน Discord",
  price: "190 บาท",
  apply: "https://www.hamsterhub.co/portcamp",
  tracks: [
    { name: "Portfolio Track", have: "มีผลงานแล้ว", get: "พอร์ต 1 เล่ม", media: { img: img("camp-portfolio.webp") } },
    { name: "Project Track", have: "ยังไม่มีผลงาน", get: "เกม 1 เกม", media: { clip: img("camp-command-select.mp4"), img: img("camp-command-select.webp") } },
  ],
};
