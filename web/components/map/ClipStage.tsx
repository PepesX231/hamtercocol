"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";

/*
 * Thailand Game Show (owner, 28 พ.ย.: "เท่กว่านี้อีกเยอะ", and not the same as All for One): one big clip in the middle
 * that tilts toward the pointer, the clips before and after resting at the sides behind a cream wash, a wipe when the
 * clip changes, the name on a square white label over the clip, and a filmstrip of all the games under it whose bar
 * fills as the clip plays. RE//SLASH first, as พี่ฮิว asked. Each clip plays once (muted) and the next comes in.
 * It stops off screen, can be paused, and stays still for reduced-motion users. Swipe or tap a frame to choose.
 */
export function ClipStage({ works }: { works: Work[] }) {
  const n = works.length;
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [prog, setProg] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const swipe = useRef<number | null>(null);
  const still = useRef(false);

  const go = useCallback((i: number) => { setAt(((i % n) + n) % n); setProg(0); }, [n]);

  useEffect(() => {
    const show = (e: Event) => {
      const k = works.findIndex((w) => w.mapProject && w.mapProject === (e as CustomEvent<{ project?: string }>).detail?.project);
      if (k >= 0) { go(k); setPaused(false); }
    };
    window.addEventListener("hh-show", show);
    return () => window.removeEventListener("hh-show", show);
  }, [works, go]);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) setPaused(true);
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (seen && !paused) { v.currentTime = 0; v.play().catch(() => {}); }
    else v.pause();
  }, [at, seen, paused]);

  // the middle clip leans toward the pointer (a few degrees)
  const tilt = (e: React.PointerEvent) => {
    const el = mid.current;
    if (!el || still.current || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -5}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 7}deg`);
  };
  const untilt = () => { mid.current?.style.setProperty("--rx", "0deg"); mid.current?.style.setProperty("--ry", "0deg"); };

  const w = works[at];
  return (
    <div ref={box} className="gs">
      <div
        className="gs-stage"
        onPointerDown={(e) => { swipe.current = e.clientX; }}
        onPointerUp={(e) => {
          if (swipe.current === null || n < 2) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 48) go(at + (dx < 0 ? 1 : -1));
        }}
      >
        {works.map((item, k) => {
          let off = (((k - at) % n) + n) % n;
          if (off > n / 2) off -= n;
          if (off === 0) {
            return (
              <div key={item.id} ref={mid} className="gs-item" data-mid style={{ "--off": 0 } as React.CSSProperties}
                onPointerMove={tilt} onPointerLeave={untilt}>
                <video
                  key={`${item.id}-${at}`}
                  ref={video}
                  className="gs-wipe"
                  src={item.clip}
                  poster={item.poster}
                  muted
                  playsInline
                  loop={n < 2}
                  preload="auto"
                  onEnded={() => { if (!paused) go(at + 1); }}
                  onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProg(v.currentTime / v.duration); }}
                  aria-label={`คลิป ${item.name} โดย ${item.by}`}
                />
                <div key={`l-${item.id}-${at}`} className="gs-label">
                  {item.award && <p className="gs-award">{item.award}</p>}
                  <p className="gs-name">{item.name}</p>
                  <p className="gs-by">{item.by}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={item.id} className="gs-item" data-far={Math.abs(off) > 1 || undefined} style={{ "--off": off } as React.CSSProperties}>
              <button type="button" tabIndex={-1} onClick={() => go(k)} aria-hidden="true">
                <img src={item.poster} alt="" loading="lazy" />
              </button>
            </div>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{w.name} โดย {w.by}{w.award ? ` ${w.award}` : ""}</p>

      {n > 1 && (
        <div className="gs-strip">
          <div className="gs-frames" role="group" aria-label="เลือกเกม">
            {works.map((item, k) => (
              <button key={item.id} type="button" className="gs-frame" aria-label={item.name} aria-current={k === at || undefined} onClick={() => go(k)}>
                <img src={item.poster} alt="" loading="lazy" />
                <span className="gs-bar" style={k === at ? ({ "--p": prog } as React.CSSProperties) : undefined} />
              </button>
            ))}
          </div>
          <button type="button" className="afo-play" onClick={() => setPaused((p) => !p)} aria-label={paused ? "เล่นต่อ" : "หยุด"}>
            {paused
              ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>}
          </button>
        </div>
      )}
    </div>
  );
}
