import { HomeMap } from "@/components/HomeMap";
import { HomeStore } from "@/components/HomeStore";
import { LegacyRuntime } from "@/components/LegacyRuntime";
import "./map.css";

// Home, top to bottom (owner, 27 พ.ย.): map, Thailand Game Show, All for One, เข้าร่วมกับ Hamster Hub, Packages,
// then the legacy page: กิจกรรมล่าสุด, จัดกิจกรรมร่วมกับ, รุ่นพี่ติดมหาลัย, สร้างอนาคตไปด้วยกัน.
// Removed from home: Hall of Fame (the awards list stays on /works/), "สิ่งที่ Hamster Hub สร้าง", the Route shelf. The hero and its search bar (components/Hero.tsx)
// are no longer shown; the file is kept in case the owner wants them back.
const H = '[data-view="home"]';

export default function Home() {
  return (
    <main>
      <div className="nx-home">
        <HomeMap />
        <HomeStore />
      </div>
      {/* the rest of the home page still runs from the original code; parts already moved to React are hidden there */}
      <LegacyRuntime
        view="home"
        hide={[`${H} > .zq`, `${H} > .je`, `${H} > section.ft`, `${H} > section.zc2`,
          `${H} > #wkRift`, `${H} > .rau`, `${H} > .rsd`, `${H} > section.h5f`, `${H} > section.hbx`]}
        move={[
          [`${H} > section.ptn`, "after", `${H} > section.nw2`],
          [`${H} > section.mc`, "after", `${H} > section.ptn`],
        ]}
      />
    </main>
  );
}
