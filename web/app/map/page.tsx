import type { Metadata } from "next";
import { LegacyRuntime } from "@/components/LegacyRuntime";
import { AllForOne } from "@/components/map/AllForOne";
import { CAMP, MAP_APP } from "@/lib/map";
import "../map.css";

export const metadata: Metadata = {
  title: "Hall of Fame | Hamster Hub",
  description: "แผนที่ผลงานน้อง Hamster Hub ทั่วประเทศ ผลงานจาก All for One และค่าย Portfolio Camp",
};

// Laid out from พี่ฮิว's Figma (27 พ.ย.): the map, then All for One, then the camp to join. Nothing else.
// The 3D map is น้องไอดิน's app, built into /hamtercocol/map-app/ by dev/builds/map_app.py and shown in an iframe.
export default function Page() {
  return (
    <main className="mp">
      <section className="mp-map" aria-label="แผนที่ผลงาน">
        <iframe src={MAP_APP} title="แผนที่ผลงานน้อง Hamster Hub ทั่วประเทศ" loading="eager" allow="autoplay; fullscreen" />
        <h1 className="mp-title">2026 every<i>Ham&apos;s</i>Projects</h1>
      </section>

      <section className="mp-sec" aria-labelledby="afo-h">
        <h2 id="afo-h" className="mp-h">All for One</h2>
        <AllForOne />
      </section>

      <section className="mp-sec mp-join" aria-labelledby="join-h">
        <h2 id="join-h" className="mp-h">เข้าร่วมกิจกรรม</h2>
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
                    ? <video src={t.media.clip} poster={t.media.img} muted loop autoPlay playsInline preload="metadata" aria-label={`คลิปเกม ${t.name}`} />
                    : <img src={t.media.img} alt={`ตัวอย่างพอร์ต ${t.name}`} />}
                </div>
                <p className="camp-tn">{t.name}</p>
                <p className="camp-td">{t.have} <span aria-hidden="true">→</span><span className="sr-only">ได้</span> {t.get}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LegacyRuntime view="shell" current="nv-w" />
    </main>
  );
}
