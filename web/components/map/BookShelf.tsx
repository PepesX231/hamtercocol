"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";
import { img } from "@/lib/site";

/*
 * All for One as a bookshelf (owner, 28 พ.ย., from a Pinterest "personal curation" shelf): every work is a book.
 * The others stand as spines on the shelf; the chosen one slides to the middle and turns to face out, its cover
 * filled with the work (the clip plays on it) and a small label: "All for One University 2026" and the name.
 * Owner, 28 พ.ย. (2nd pass): the work full on the cover instead of an opening book, and a full shelf (mocks for now).
 * Owner, 28 พ.ย. (3rd pass): the shelf full from edge to edge. A book-opening animation was tried and dropped
 * (owner: the first one, the spine turning to face out, is better).
 * Smaller than Thailand Game Show on purpose. It moves on by itself, stops off screen, can be paused,
 * and stays still for reduced-motion users.
 */
const SPINE = ["#1167dc", "#ffd84d", "#c8561b", "#1d1712", "#7aa7f0", "#e8dccb", "#f29a4a", "#2b4fa8", "#f4ead9", "#8c3d12"];
const LIGHT = new Set(["#ffd84d", "#7aa7f0", "#e8dccb", "#f29a4a", "#f4ead9"]);
const TALL = [0.96, 0.86, 1.04, 0.9, 1, 0.82, 0.94, 1.08, 0.88, 0.98];
const THICK = [1, 0.8, 1.25, 0.9, 1.1, 0.75, 1, 1.35, 0.85, 1.05];
const EVENT = "All for One University 2026";
const FILL = 16; // plain books on each end so the shelf runs from edge to edge (owner, 28 พ.ย.: "เต็มซ้ายขวา")

export function BookShelf({ works }: { works: Work[] }) {
  const n = works.length;
  const first = Math.max(0, works.findIndex((w) => !w.mock));
  const [at, setAt] = useState(first);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const go = useCallback((i: number) => setAt(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // the map's student cards can ask to show one work here (components/MapFrame.tsx)
  useEffect(() => {
    const show = (e: Event) => {
      const k = works.findIndex((w) => w.mapProject && w.mapProject === (e as CustomEvent<{ project?: string }>).detail?.project);
      if (k >= 0) { go(k); setPaused(false); }
    };
    window.addEventListener("hh-show", show);
    return () => window.removeEventListener("hh-show", show);
  }, [works, go]);

  // the clip on the cover plays once; a mock cover stays a few seconds
  const w = works[at];
  useEffect(() => {
    const v = video.current;
    if (v) { if (seen && !paused) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); }
    if (!w.clip && seen && !paused && n > 1) {
      const t = setTimeout(() => go(at + 1), 2600);
      return () => clearTimeout(t);
    }
  }, [seen, paused, at, w, n, go]);

  // the shelf: plain books, the works, plain books; positions count spine thicknesses out from the book in the middle
  const items: (Work | null)[] = [...Array(FILL).fill(null), ...works, ...Array(FILL).fill(null)];
  const mid = at + FILL;
  const off = (v: number) => {
    let x = 0;
    if (v < mid) for (let j = v + 1; j < mid; j++) x += THICK[j % THICK.length];
    else for (let j = mid + 1; j < v; j++) x += THICK[j % THICK.length];
    return x;
  };

  return (
    <div ref={box} className="bs">
      <div className="bs-shelf">
        {items.map((item, v) => {
          const c = SPINE[v % SPINE.length];
          if (v === mid && item) {
            return (
              <div key={item.id} className="bs-book">
                <div className="bs-cover" data-mock={item.mock || undefined}>
                  {item.clip ? (
                    <video
                      ref={video}
                      src={item.clip}
                      poster={item.poster}
                      muted
                      playsInline
                      loop={n < 2}
                      preload="metadata"
                      onEnded={() => { if (!paused) go(at + 1); }}
                      aria-label={`คลิป ${item.name} โดย ${item.by}`}
                    />
                  ) : (
                    <img className="bs-logo" src={img("k-afo-logo.webp")} alt="" />
                  )}
                  <div className="bs-label">
                    <p className="bs-ev">{EVENT}</p>
                    <p className="bs-t">{item.name}</p>
                  </div>
                </div>
              </div>
            );
          }
          const style = {
            "--side": v < mid ? -1 : 1, "--neg": v < mid ? 1 : 0, "--x": off(v),
            "--c": c, "--h": TALL[v % TALL.length], "--t": THICK[v % THICK.length],
          } as React.CSSProperties;
          if (!item) return <span key={`f${v}`} className="bs-spine bs-fill" aria-hidden="true" data-light={LIGHT.has(c) || undefined} style={style}><span>All for One</span></span>;
          const k = v - FILL;
          return (
            <button key={item.id} type="button" className="bs-spine" onClick={() => go(k)} aria-label={`ดู ${item.name}`}
              data-light={LIGHT.has(c) || undefined} style={style}>
              <span>{item.mock ? "All for One" : item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="afo-cap" aria-live="polite">
        <div key={w.id} className="afo-cap-in">
          <p className="afo-name">{w.name}</p>
          <p className="afo-by">{w.by}{w.award ? <> · <b>{w.award}</b></> : null}</p>
        </div>
      </div>

      {n > 1 && (
        <div className="afo-ctl">
          <button type="button" className="afo-play" onClick={() => go(at - 1)} aria-label="เล่มก่อนหน้า">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <button type="button" className="afo-play" onClick={() => setPaused((p) => !p)} aria-label={paused ? "เล่นต่อ" : "หยุด"}>
            {paused
              ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>}
          </button>
          <button type="button" className="afo-play" onClick={() => go(at + 1)} aria-label="เล่มถัดไป">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
