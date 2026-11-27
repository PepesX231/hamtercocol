"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_FOR_ONE as WORKS } from "@/lib/map";

/*
 * "All for One" on /map/: one big clip in the middle, the ones before and after peeking in at the edges.
 * Each clip plays once (muted) and then the next one slides in, starting with RE//SLASH, as พี่ฮิว asked.
 * It stops while off screen, can be paused (it moves on its own), and does not move for reduced-motion users.
 * Tap a side clip, a square under it, or swipe to choose.
 */
export function AllForOne() {
  const n = WORKS.length;
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const swipe = useRef<number | null>(null);

  const go = useCallback((i: number) => setAt(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // play the middle clip from the start whenever it changes; stop it when paused or off screen
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (seen && !paused) { v.currentTime = 0; v.play().catch(() => {}); }
    else v.pause();
  }, [at, seen, paused]);

  const w = WORKS[at];
  return (
    <div ref={box} className="afo">
      <div
        className="afo-stage"
        onPointerDown={(e) => { swipe.current = e.clientX; }}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 48) go(at + (dx < 0 ? 1 : -1));
        }}
      >
        {WORKS.map((item, k) => {
          let off = (((k - at) % n) + n) % n;
          if (off > n / 2) off -= n;
          const mid = off === 0;
          return (
            <div
              key={item.id}
              className="afo-item"
              data-mid={mid || undefined}
              data-far={Math.abs(off) > 1 || undefined}
              style={{ "--off": off } as React.CSSProperties}
            >
              {mid ? (
                <video
                  ref={video}
                  src={item.clip}
                  poster={item.poster}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => { if (!paused) go(at + 1); }}
                  aria-label={`คลิป ${item.name} โดย${item.by}`}
                />
              ) : (
                <button type="button" tabIndex={Math.abs(off) === 1 ? 0 : -1} onClick={() => go(k)} aria-label={`ดู ${item.name}`}>
                  <img src={item.poster} alt="" loading="lazy" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="afo-cap" aria-live="polite">
        <p className="afo-name">{w.name}</p>
        <p className="afo-by">{w.by}{w.award ? <> · <b>{w.award}</b></> : null}</p>
      </div>

      <div className="afo-ctl">
        <div className="afo-dots" role="group" aria-label="เลือกผลงาน">
          {WORKS.map((item, k) => (
            <button key={item.id} type="button" aria-label={item.name} aria-current={k === at || undefined} onClick={() => go(k)} />
          ))}
        </div>
        <button type="button" className="afo-play" onClick={() => setPaused((p) => !p)} aria-label={paused ? "เล่นต่อ" : "หยุด"}>
          {paused
            ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>}
        </button>
      </div>
    </div>
  );
}
