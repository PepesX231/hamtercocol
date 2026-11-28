import { HomeMap } from "@/components/HomeMap";
import { LegacyRuntime } from "@/components/LegacyRuntime";
import "./map.css";

// Home, top to bottom (owner, 27–28 พ.ย.): map (TCAS 2026), กิจกรรม (Portfolio Camp banner), Thailand Game Show,
// All for One, then the legacy page: จัดกิจกรรมร่วมกับ, รุ่นพี่ติดมหาลัย, สร้างอนาคตไปด้วยกัน.
// Removed from home: กิจกรรมล่าสุด (the old All for One banner, 28 พ.ย.; the camp banner took its place), Hall of Fame (the awards list stays on /works/), "สิ่งที่ Hamster Hub สร้าง", the Route shelf,
// and for now the Packages shelf (components/HomeStore.tsx, kept for when it comes back). The hero and its search bar (components/Hero.tsx)
// are no longer shown; the file is kept in case the owner wants them back.
const H = '[data-view="home"]';

export default function Home() {
  return (
    <main>
      <div className="nx-home">
        <HomeMap />
      </div>
      {/* the rest of the home page still runs from the original code; parts already moved to React are hidden there */}
      <LegacyRuntime
        view="home"
        hide={[`${H} > .zq`, `${H} > .je`, `${H} > section.ft`, `${H} > section.zc2`,
          `${H} > #wkRift`, `${H} > .rau`, `${H} > .rsd`, `${H} > section.h5f`, `${H} > section.hbx`,
          `${H} > section.nw2`]}
        move={[
          [`${H} > section.ptn`, "after", `${H} > section.nw2`],
          [`${H} > section.mc`, "after", `${H} > section.ptn`],
        ]}
      />
    </main>
  );
}
