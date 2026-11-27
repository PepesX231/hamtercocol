"use client";

import { useEffect, useRef } from "react";
import { ALL_FOR_ONE, GAME_SHOW, MAP_APP, SECTIONS } from "@/lib/map";

// The 3D map (น้องไอดิน's app) in an iframe, and the messages between it and the page (see src/embed.ts in the map repo):
// - tells the map when it is off screen, so it stops animating (the main cause of lag while scrolling the page);
// - tells it which works the page shows in Thailand Game Show / All for One, so a student card can link down here;
// - when a card asks ("hh-goto"), scrolls to that section and shows that work (ClipStage listens for "hh-show").
const sections: Record<string, { label: string; target: string }> = {};
for (const w of GAME_SHOW) if (w.mapProject) sections[w.mapProject] = { label: SECTIONS.tgs, target: "tgs" };
for (const w of ALL_FOR_ONE) if (w.mapProject) sections[w.mapProject] = { label: SECTIONS.afo, target: "afo" };

export function MapFrame() {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const send = (msg: object) => el.contentWindow?.postMessage(msg, location.origin);
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; send({ type: "hh-visible", visible }); }, { threshold: 0.02 });
    io.observe(el);
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== el.contentWindow) return;
      const data = event.data as { type?: string; target?: string; project?: string };
      if (data?.type === "hh-map-ready") { send({ type: "hh-sections", sections }); send({ type: "hh-visible", visible }); }
      if (data?.type === "hh-goto" && data.target) {
        document.getElementById(data.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.dispatchEvent(new CustomEvent("hh-show", { detail: { project: data.project } }));
      }
    };
    window.addEventListener("message", onMessage);
    const onLoad = () => send({ type: "hh-sections", sections });
    el.addEventListener("load", onLoad);
    return () => { io.disconnect(); window.removeEventListener("message", onMessage); el.removeEventListener("load", onLoad); };
  }, []);

  return <iframe ref={frame} src={MAP_APP} title="แผนที่ผลงานน้อง Hamster Hub ทั่วประเทศ" loading="eager" allow="autoplay; fullscreen" />;
}
