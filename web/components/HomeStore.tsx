import { PACKAGES } from "@/lib/routes";
import { PackageCard } from "./store/Cards";
import { Shelf } from "./store/Shelf";

// Home: the Packages shelf. The single-Route shelf was removed from home on 27 พ.ย. (owner); Routes live on /routes/.

export function HomeStore() {
  return (
    <section className="hm-store" aria-label="แพ็กเกจ">
      <div className="st-wrap">
        <Shelf label="แพ็กเกจตามเป้าหมาย" title="แพ็กเกจ" sub="ตัวเลือกเป้าหมายของน้อง">
          {PACKAGES.map((p) => <PackageCard key={p.id} p={p} />)}
        </Shelf>
      </div>
    </section>
  );
}
