"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/map";
import { img } from "@/lib/site";

// a work the team has not sent yet: the All for One logo on its own, no clip
function Mock() {
  return (
    <div className="afo-mock" aria-hidden="true">
      <img src={img("k-afo-logo.webp")} alt="" />
      <span>เร็วๆ นี้</span>
    </div>
  );
}

/*
 * A row of work clips on the home page (Thailand Game Show, All for One): one big clip in the middle, the ones
 * before and after turned away in 3D at the edges (cover flow; owner, 28 พ.ย.: "เฟี้ยวๆ"). The bars under it fill as
 * the clip plays. Each clip plays once (muted) and the next slides in; RE//SLASH first,
 * as พี่ฮิว asked. It stops off screen, can be paused (it moves on its own), and stays still for reduced-motion users.
 * Tap a side clip, a square under it, or swipe to choose. With one work it simply loops.
 */
export function ClipStage({ works }: { works: Work[] }) {
  const n = works.length;
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [prog, setProg] = useState(0); // how far the middle clip has played, 0..1 (drives the bar under it)
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const swipe = useRef<number | null>(null);

  const go = useCallback((i: number) => { setAt(((i % n) + n) % n); setProg(0); }, [n]);

  // the map's student cards can ask to show one work here (components/MapFrame.tsx)
  useEffect(() => {
    const show = (e: Event) => {
      const k = works.findIndex((w) => w.mapProject && w.mapProject === (e as CustomEvent<{ project?: string }>).detail?.project);
      if (k >= 0) { setAt(k); setPaused(false); }
    };
    window.addEventListener("hh-show", show);
    return () => window.removeEventListener("hh-show", show);
  }, [works]);

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

  // a mock card has no clip to end, so it moves on after a few seconds
  const w = works[at];
  useEffect(() => {
    if (w.clip || n < 2 || !seen || paused) return;
    const t = setTimeout(() => go(at + 1), 4000);
    return () => clearTimeout(t);
  }, [w, n, at, seen, paused, go]);

  return (
    <div ref={box} className="afo">
      <div
        className="afo-stage"
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
          const mid = off === 0;
          return (
            <div
              key={item.id}
              className="afo-item"
              data-mid={mid || undefined}
              data-far={Math.abs(off) > 1 || undefined}
              style={{ "--off": off } as React.CSSProperties}
            >
              {mid && !item.clip ? (
                <Mock />
              ) : mid ? (
                <video
                  ref={video}
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
              ) : (
                <button type="button" tabIndex={Math.abs(off) === 1 ? 0 : -1} onClick={() => go(k)} aria-label={`ดู ${item.name}`}>
                  {item.poster ? <img src={item.poster} alt="" loading="lazy" /> : <Mock />}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="afo-cap" aria-live="polite">
        <div key={w.id} className="afo-cap-in">
          {n > 1 && <p className="afo-no" aria-hidden="true">{String(at + 1).padStart(2, "0")}<span>/{String(n).padStart(2, "0")}</span></p>}
          <div>
            <p className="afo-name">{w.name}</p>
            <p className="afo-by">{w.by}{w.award ? <> · <b>{w.award}</b></> : null}</p>
          </div>
        </div>
      </div>

      {n > 1 && (
        <div className="afo-ctl">
          <div className="afo-dots" role="group" aria-label="เลือกผลงาน">
            {works.map((item, k) => (
              <button
                key={k === at ? `${item.id}-${at}` : item.id}
                type="button"
                aria-label={item.name}
                aria-current={k === at || undefined}
                data-done={k < at || undefined}
                data-mock={(k === at && !item.clip) || undefined}
                data-paused={paused || !seen || undefined}
                style={k === at && item.clip ? ({ "--p": prog } as React.CSSProperties) : undefined}
                onClick={() => go(k)}
              />
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
