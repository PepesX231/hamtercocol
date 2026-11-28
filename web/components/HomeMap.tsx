import { AutoVideo } from "@/components/AutoVideo";
import { JumpLink } from "@/components/JumpLink";
import { MapFrame } from "@/components/MapFrame";
import { ClipStage } from "@/components/map/ClipStage";
import { ALL_FOR_ONE, CAMP, GAME_SHOW, SECTIONS } from "@/lib/map";

// Top of the home page (28 พ.ย., owner after พี่อุ้ย's review): the 3D map under "2026 every Ham's Projects" (its TCAS line links to
// the seniors' section "รุ่นพี่ปี 69 ติดมหาลัยแล้ว" further down), then the current activity
// under "กิจกรรม" (Portfolio Camp for TCAS 1, which replaces All for One now that it has ended), then
// Thailand Game Show and All for One.
// The map is น้องไอดิน's app, built into /hamtercocol/map-app/ by dev/builds/map_app.py and shown in an iframe.
export function HomeMap() {
  return (
    <div className="mp">
      <section className="mp-map" aria-label="แผนที่ผลงาน">
        <MapFrame />
        <div className="mp-title">
          <h1>2026 every<i>Ham<span>&apos;s</span></i>Projects</h1>
          <JumpLink to="tcas">รุ่นพี่ปี 69 ติดมหาลัยแล้ว 48 คน <span aria-hidden="true">↓</span></JumpLink>
        </div>
      </section>

      <section id="join" className="mp-sec" aria-labelledby="join-h">
        <h2 id="join-h" className="mp-h">กิจกรรม</h2>
        <div className="camp">
          <div className="camp-l">
            <p className="camp-k">เปิดรับสมัคร</p>
            <h3 className="camp-name">{CAMP.name}<br />for {CAMP.for}</h3>
            <p className="camp-meta">{CAMP.when} · {CAMP.where}</p>
            <div className="camp-buy">
              <a className="camp-btn" href={CAMP.apply} target="_blank" rel="noopener">สมัครค่าย</a>
              <p className="camp-price">{CAMP.price}</p>
            </div>
          </div>
          <div className="camp-art">
            {CAMP.tracks.map((t, k) => (
              <div key={t.name} className={`camp-media m${k}`}>
                {"clip" in t.media
                  ? <AutoVideo src={t.media.clip} poster={t.media.img} aria-label={`คลิปเกม ${t.name}`} />
                  : <img src={t.media.img} alt={`ตัวอย่างพอร์ต ${t.name}`} />}
                <p className="camp-tag"><b>{t.name}</b> {t.have} <span aria-hidden="true">→</span><span className="sr-only">ได้</span> {t.get}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="tgs" className="mp-sec" aria-labelledby="tgs-h">
        <h2 id="tgs-h" className="mp-h">{SECTIONS.tgs}</h2>
        <ClipStage works={GAME_SHOW} />
      </section>

      <section id="afo" className="mp-sec mp-small" aria-labelledby="afo-h">
        <h2 id="afo-h" className="mp-h">{SECTIONS.afo}</h2>
        <ClipStage works={ALL_FOR_ONE} />
      </section>

    </div>
  );
}
