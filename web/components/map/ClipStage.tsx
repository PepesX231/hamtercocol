"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";

/*
 * Thailand Game Show as a gallery wall (owner, 28 พ.ย., from a Pinterest gallery; 2nd pass): big squares hung in a row
 * that runs off the edge, each one filled with its game's clip, all clips playing at once. The square in the middle
 * grows (real size, not a CSS scale: a scaled video leaves a 1px line on its edge) and every square's edges melt into
 * the page colour, the middle one most (owner: no hard edges). Name and maker sit under each square; the award is an orange label on it. Swipe or use the arrows; no dots
 * (the owner: don't spoil what's next). RE//SLASH first, as พี่ฮิว asked. Clips stop when the section is off screen and
 * for reduced-motion users.
 */
export function ClipStage({ works }: { works: Work[] }) {
  const [mid, setMid] = useState(0);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setShown(true); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // every clip plays while the section is on screen
  useEffect(() => {
    vids.current.forEach((v) => { if (!v) return; if (inView && !still.current) v.play().catch(() => {}); else v.pause(); });
  }, [inView]);

  // the square nearest the middle of the row is the one in the middle
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const c = el.getBoundingClientRect().left + el.clientWidth / 2;
      let best = 0, d = Infinity;
      cards.current.forEach((card, k) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const dd = Math.abs(r.left + r.width / 2 - c);
        if (dd < d) { d = dd; best = k; }
      });
      setMid(best);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [works]);

  const scrollTo = useCallback((k: number) => {
    const c = cards.current[k];
    const el = row.current;
    if (!c || !el) return;
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.clientWidth) / 2, behavior: still.current ? "auto" : "smooth" });
  }, []);

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
            role="listitem"
            className="gw-card"
            data-mid={k === mid || undefined}
            style={{ "--i": k } as React.CSSProperties}
            onClick={() => scrollTo(k)}
          >
            <div className="gw-media">
              <div className="gw-pic">
              <video
                ref={(el) => { vids.current[k] = el; }}
                src={w.clip}
                poster={w.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`คลิป ${w.name} โดย ${w.by}`}
              />
              </div>
              {w.award && <p className="gw-award">{w.award}</p>}
            </div>
            <h3 className="gw-name">{w.name}</h3>
            <p className="gw-by">{w.by}</p>
          </article>
        ))}
      </div>
      {works.length > 1 && (
        <div className="gw-ctl">
          <button type="button" className="afo-play" onClick={() => scrollTo(Math.max(0, mid - 1))} aria-label="เกมก่อนหน้า" disabled={mid === 0}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <button type="button" className="afo-play" onClick={() => scrollTo(Math.min(works.length - 1, mid + 1))} aria-label="เกมถัดไป" disabled={mid === works.length - 1}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
