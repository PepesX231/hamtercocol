"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";

/*
 * Thailand Game Show as a gallery wall (owner, 28 พ.ย., from a Pinterest gallery: tall white cards hung in a row
 * that runs off the edge, title and maker on top, the picture filling the bottom, long soft shadows; no chair).
 * The card in view plays its clip (muted) and lifts; on a computer the card under the mouse plays. Cards fade up one
 * after another when the section comes into view. Swipe or use the arrows; no row of dots (the owner: don't spoil
 * what's next). RE//SLASH first, as พี่ฮิว asked. Reduced-motion users get still cards that play only on hover/tap.
 */
export function ClipStage({ works }: { works: Work[] }) {
  const [live, setLive] = useState(0); // the card that plays
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false); // stays true once the cards have faded in
  const row = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const hover = useRef(false);

  // the section coming into view starts the fade-up and the first clip
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setShown(true); }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // on touch screens (no hover), the card nearest the middle of the row plays
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (hover.current) return;
      const best = es.filter((e) => e.isIntersecting && e.intersectionRatio > 0.75)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best) setLive(Number((best.target as HTMLElement).dataset.k));
    }, { root: el, threshold: [0.75, 1] });
    cards.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
  }, [works]);

  useEffect(() => {
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === live && inView) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, [live, inView]);

  const scrollTo = useCallback((k: number) => {
    const c = cards.current[k];
    const el = row.current;
    if (!c || !el) return;
    el.scrollTo({ left: c.offsetLeft - el.offsetLeft - (el.clientWidth - c.clientWidth) / 2, behavior: "smooth" });
    setLive(k);
  }, []);
  const step = (d: number) => scrollTo(Math.min(works.length - 1, Math.max(0, live + d)));

  // the map's student cards can ask to show one work here (components/MapFrame.tsx)
  useEffect(() => {
    const show = (e: Event) => {
      const k = works.findIndex((w) => w.mapProject && w.mapProject === (e as CustomEvent<{ project?: string }>).detail?.project);
      if (k >= 0) setTimeout(() => scrollTo(k), 500);
    };
    window.addEventListener("hh-show", show);
    return () => window.removeEventListener("hh-show", show);
  }, [works, scrollTo]);

  return (
    <div className="gw" data-in={shown || undefined}>
      <div ref={row} className="gw-row" role="list">
        {works.map((w, k) => (
          <article
            key={w.id}
            ref={(el) => { cards.current[k] = el; }}
            data-k={k}
            role="listitem"
            className="gw-card"
            data-live={k === live || undefined}
            style={{ "--i": k } as React.CSSProperties}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") { hover.current = true; setLive(k); } }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") hover.current = false; }}
            onClick={() => setLive(k)}
          >
            <div className="gw-head">
              <h3 className="gw-name">{w.name}</h3>
              <p className="gw-by">{w.by}</p>
            </div>
            <div className="gw-media">
              <video
                ref={(el) => { vids.current[k] = el; }}
                src={w.clip}
                poster={w.poster}
                muted
                loop
                playsInline
                preload={k === 0 ? "metadata" : "none"}
                aria-label={`คลิป ${w.name} โดย ${w.by}`}
              />
              {w.award && <p className="gw-award">{w.award}</p>}
            </div>
          </article>
        ))}
      </div>
      {works.length > 1 && (
        <div className="gw-ctl">
          <button type="button" className="afo-play" onClick={() => step(-1)} aria-label="เกมก่อนหน้า" disabled={live === 0}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <button type="button" className="afo-play" onClick={() => step(1)} aria-label="เกมถัดไป" disabled={live === works.length - 1}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
