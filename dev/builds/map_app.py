#!/usr/bin/env python3
"""Builds น้องไอดิน's 3D Thailand map (repo hamsterhub-hall-of-fame-map) into ../map-app/.

GitHub Pages serves it at /hamtercocol/map-app/. The Next.js page /map/ (web/app/map/page.tsx)
shows it in an iframe with ?embed, so the mouse wheel scrolls the page instead of zooming.

    python3 dev/builds/map_app.py /path/to/hamsterhub-hall-of-fame-map

The map repo needs `npm ci` first. Data is the map's review data (public/__local-preview/data.json),
the same students and projects as https://hamsterhub-map-review.vercel.app.
The hamster chat (Gemini) needs a server, so on GitHub Pages it shows its "browse by hand" fallback.
"""
import os, re, shutil, subprocess, sys, tempfile

BASE = "/hamtercocol/map-app/"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "map-app")

# The map's code and data use absolute paths like "/demo/x.png". Vite's base only fixes imported
# files, so prefix every public-folder path that sits right after a quote, backtick or "(".
PUBLIC = r"(?:demo|audio|projects|review|__local-preview|data)/|(?:hamster-official\.webp|hamsterhub-logo\.png|credits\.txt|hamster-icon\.png|footer-icon\.webp|favicon\.(?:ico|svg))\b"
PATH_RE = re.compile(r"""(["'`(])/(""" + PUBLIC + ")")


def main():
    src = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "..", "hamsterhub-hall-of-fame-map"))
    if not os.path.isdir(os.path.join(src, "node_modules")):
        sys.exit(f"Run `npm ci` in {src} first.")
    tmp = tempfile.mkdtemp(prefix="map-app-")
    env = dict(os.environ, VITE_PUBLIC_REVIEW="true")
    subprocess.run(["npx", "vite", "build", f"--base={BASE}", f"--outDir={tmp}", "--emptyOutDir"],
                   cwd=src, env=env, check=True)

    changed = 0
    for folder, _, files in os.walk(tmp):
        for name in files:
            if not name.endswith((".js", ".css", ".html", ".json")):
                continue
            path = os.path.join(folder, name)
            text = open(path, encoding="utf-8").read()
            new = PATH_RE.sub(lambda m: m.group(1) + BASE + m.group(2), text)
            if new != text:
                open(path, "w", encoding="utf-8").write(new)
                changed += 1
    print(f"prefixed public paths in {changed} files")

    # Project clips are 6-97 MB. Re-encode big ones for the web (720p, sharp enough on a big screen).
    if shutil.which("ffmpeg"):
        for folder, _, files in os.walk(os.path.join(tmp, "projects")):
            for name in files:
                path = os.path.join(folder, name)
                if name.endswith(".mp4") and os.path.getsize(path) > 4_000_000:
                    small = path + ".small.mp4"
                    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", path,
                                    "-vf", "scale=min(1280\\,iw):-2", "-c:v", "libx264", "-preset", "veryfast",
                                    "-crf", "29", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", small],
                                   check=True)
                    os.replace(small, path)
    else:
        print("ffmpeg not found: project clips are copied at full size")

    # Clips nobody links to (project-none-x) stay out of the site.
    data = open(os.path.join(tmp, "__local-preview", "data.json"), encoding="utf-8").read()
    for folder in os.listdir(os.path.join(tmp, "projects")):
        clip = os.path.join(tmp, "projects", folder, "video.mp4")
        if os.path.exists(clip) and f"projects/{folder}/video.mp4" not in data:
            os.remove(clip)

    shutil.rmtree(OUT, ignore_errors=True)
    shutil.copytree(tmp, OUT)
    shutil.rmtree(tmp)
    print("map-app ready:", OUT)


if __name__ == "__main__":
    main()
