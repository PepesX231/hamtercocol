"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";
import { img } from "@/lib/site";

/*
 * All for One as a bookshelf (owner, 28 พ.ย., from a Pinterest "personal curation" shelf): every work is a book.
 * The others stand as spines on the shelf; the chosen one slides to the middle, shows its cover
 * ("All for One University 2026" and the work), then opens: the cover turns over to the left page (name, maker)
 * and the clip plays on the right page. Kept small on purpose: All for One is a smaller event than Thailand Game Show.
 * It moves on by itself after the clip (or a few seconds for a mock), stops off screen, can be paused,
 * and stays still for reduced-motion users.
 */
const SPINE = ["#1167dc", "#ffd84d", "#c8561b", "#1d1712", "#7aa7f0", "#e8dccb"];
const LIGHT = new Set(["#ffd84d", "#7aa7f0", "#e8dccb"]);
const TALL = [0.92, 0.84, 1, 0.88, 0.95, 0.8];
const EVENT = "All for One University 2026";

export function BookShelf({ works }: { works: Work[] }) {
  const n = works.length;
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const still = useRef(false);

  const go = useCallback((i: number) => { setAt(((i % n) + n) % n); setOpen(false); }, [n]);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) setPaused(true);
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

  // the book in the middle shows its cover first, then opens
  useEffect(() => {
    if (open || !seen) return;
    const t = setTimeout(() => setOpen(true), still.current ? 0 : 900);
    return () => clearTimeout(t);
  }, [at, open, seen]);

  // clip plays once the book is open; a mock (no clip) stays open a few seconds
  const w = works[at];
  useEffect(() => {
    const v = video.current;
    if (v) {
      if (open && seen && !paused) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    }
    if (!w.clip && open && seen && !paused && n > 1) {
      const t = setTimeout(() => go(at + 1), 3500);
      return () => clearTimeout(t);
    }
  }, [open, seen, paused, at, w, n, go]);

  return (
    <div ref={box} className="bs" data-open={open || undefined}>
      <div className="bs-shelf">
        {works.map((item, k) => {
          const d = k - at;
          if (d === 0) {
            return (
              <div key={item.id} className="bs-book">
                <div className="bs-inner">
                {/* right page: the clip, uncovered when the cover turns over to the left */}
                <div className="bs-page">
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
                    <div className="bs-soon"><img src={img("k-afo-logo.webp")} alt="" /><span>เร็วๆ นี้</span></div>
                  )}
                </div>
                <div className="bs-cover">
                  <div className="bs-front">
                    {item.poster ? <img src={item.poster} alt="" /> : <img className="bs-logo" src={img("k-afo-logo.webp")} alt="" />}
                    <p className="bs-ev">{EVENT}</p>
                    <p className="bs-t">{item.name}</p>
                  </div>
                  <div className="bs-back">
                    <p className="bs-ev">{EVENT}</p>
                    <p className="bs-t">{item.name}</p>
                    <p className="bs-by">{item.by}{item.award ? <><br /><b>{item.award}</b></> : null}</p>
                  </div>
                </div>
                </div>
              </div>
            );
          }
          return (
            <button
              key={item.id}
              type="button"
              className="bs-spine"
              onClick={() => go(k)}
              aria-label={`เปิด ${item.name}`}
              data-light={LIGHT.has(SPINE[k % SPINE.length]) || undefined}
              style={{ "--side": d < 0 ? -1 : 1, "--neg": d < 0 ? 1 : 0, "--n": Math.abs(d) - 1, "--c": SPINE[k % SPINE.length], "--h": TALL[k % TALL.length] } as React.CSSProperties}
            >
              <span>{item.mock ? "เร็วๆ นี้" : item.name}</span>
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
