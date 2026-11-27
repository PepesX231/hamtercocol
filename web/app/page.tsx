import { HomeMap } from "@/components/HomeMap";
import { HomeStore } from "@/components/HomeStore";
import { LegacyRuntime } from "@/components/LegacyRuntime";
import "./map.css";

// Home, top to bottom (owner, 27 พ.ย.): map, Thailand Game Show, All for One, เข้าร่วมกับ Hamster Hub,
// สิ่งที่ Hamster Hub สร้าง (legacy, moved into #nx-made), Hams Route shelves, then the rest of the legacy page.
// Hall of Fame is gone from home (the awards list stays on /works/). The hero and its search bar (components/Hero.tsx)
// are no longer shown; the file is kept in case the owner wants them back.
const H = '[data-view="home"]';

export default function Home() {
  return (
    <main>
      <div className="nx-home">
        <HomeMap />
        <div id="nx-made" />
        <HomeStore />
      </div>
      {/* the rest of the home page still runs from the original code; parts already moved to React are hidden there */}
      <LegacyRuntime
        view="home"
        hide={[`${H} > .zq`, `${H} > .je`, `${H} > section.ft`, `${H} > section.zc2`,
          `${H} > #wkRift`, `${H} > .rau`, `${H} > .rsd`, `${H} > section.h5f`]}
        move={[
          [`${H} > section.hbx`, "into", "#nx-made"],
          [`${H} > section.ptn`, "after", `${H} > section.nw2`],
        ]}
      />
    </main>
  );
}
