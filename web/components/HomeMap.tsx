import { AutoVideo } from "@/components/AutoVideo";
import { MapFrame } from "@/components/MapFrame";
import { ClipStage } from "@/components/map/ClipStage";
import { ALL_FOR_ONE, CAMP, GAME_SHOW, SECTIONS } from "@/lib/map";

// Top of the home page (27 พ.ย., from พี่ฮิว's Figma and the owner): the 3D map, Thailand Game Show, All for One,
// then the camp to join. "สิ่งที่ Hamster Hub สร้าง" follows (moved up from the legacy page, see app/page.tsx).
// The map is น้องไอดิน's app, built into /hamtercocol/map-app/ by dev/builds/map_app.py and shown in an iframe.
export function HomeMap() {
  return (
    <div className="mp">
      <section className="mp-map" aria-label="แผนที่ผลงาน">
        <MapFrame />
        <h1 className="mp-title">2026 every<i>Ham&apos;s</i>Projects</h1>
      </section>

      <section id="tgs" className="mp-sec" aria-labelledby="tgs-h">
        <h2 id="tgs-h" className="mp-h">{SECTIONS.tgs}</h2>
        <ClipStage works={GAME_SHOW} />
      </section>

      <section id="afo" className="mp-sec" aria-labelledby="afo-h">
        <h2 id="afo-h" className="mp-h">{SECTIONS.afo}</h2>
        <ClipStage works={ALL_FOR_ONE} />
      </section>

      <section id="join" className="mp-sec" aria-labelledby="join-h">
        <h2 id="join-h" className="mp-h">เข้าร่วมกับ Hamster Hub</h2>
        <div className="camp">
          <div className="camp-top">
            <div>
              <p className="camp-name">{CAMP.name} <span>for {CAMP.for}</span></p>
              <p className="camp-meta">{CAMP.when} · {CAMP.where}</p>
            </div>
            <div className="camp-buy">
              <p className="camp-price">{CAMP.price}</p>
              <a className="st-btn st-btn-main" href={CAMP.apply} target="_blank" rel="noopener">สมัครค่าย</a>
            </div>
          </div>
          <div className="camp-tracks">
            {CAMP.tracks.map((t) => (
              <div key={t.name} className="camp-track">
                <div className="camp-media">
                  {"clip" in t.media
                    ? <AutoVideo src={t.media.clip} poster={t.media.img} aria-label={`คลิปเกม ${t.name}`} />
                    : <img src={t.media.img} alt={`ตัวอย่างพอร์ต ${t.name}`} />}
                </div>
                <p className="camp-tn">{t.name}</p>
                <p className="camp-td">{t.have} <span aria-hidden="true">→</span><span className="sr-only">ได้</span> {t.get}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
