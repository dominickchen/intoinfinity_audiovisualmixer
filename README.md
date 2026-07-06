# INTO INFINITY — AudioVisual Mixer

An endless, self-playing chain of creativity. 8‑second loop sounds (**EAR**) from artists
around the world are paired with rotating disc images (**EYE**) and streamed at random,
orbiting a central ∞ logo. Drag a circle toward the centre to raise its volume, throw it to
fling it away, tap the ∞ to freeze the scene and export the mix.

This is a web port of the original iOS app by **dublab × Creative Commons**.

## Try it

Because the app uses `fetch`, the Web Audio API and a service worker, it must be served over
HTTP — it will not run from a `file://` URL. There is **no build step, bundler, or
dependencies**: just serve the directory.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works. When editing, hard‑reload to bypass the service‑worker cache
(or bump `CACHE_NAME` in `sw.js`).

## How to play

- **Drag** a circle — closer to the centre = louder, edge = silent.
- **Throw** a circle to fling it away.
- **Tap** a circle to see the artists behind its sound and image.
- **Tap the ∞** to freeze / unfreeze the scene. While frozen, a **Save Mix (WAV)** button
  appears to export the current blend as an 8‑second stereo loop.
- Browse the full **Loop Collection** (157 pairs) from the grid button and add any pair to
  the mix (up to 4 play at once).

Up to 4 sounds play simultaneously; new pairs spawn on a timer and drift away at the end of
their life, so the mix is always evolving.

## How it works

Everything lives in a single file, **`index.html`** — CSS in `<style>`, all logic in one
inline `<script>`. Highlights:

- **Data** — `paring.json` is an array of 157 pair objects (`ear`, `eye`, plus artist / city
  / region for each). All media lives in `EYE_EAR/` (`ear_*.wav`, `eye_*.png`).
- **Motion** — circles orbit the centre (and one another) via a potential‑well + tangential
  attraction model; newborns pull the strongest and objects spiral outward at end of life.
  All spatial values are ratios of the screen scale, so the composition stays similar at any
  size or aspect ratio.
- **Audio** — the Web Audio graph gives each sound a gain (volume by distance to centre),
  a stereo panner (position by screen x) and an analyser that drives audio‑reactive size and
  beat ripples.
- **Trail** — a WebGL2 float16 feedback buffer paints motion trails, with a Canvas‑2D
  fallback (`?trail=2d`).
- **WAV export** — re‑renders the active loops through an `OfflineAudioContext`, peak‑
  normalises, and encodes a 16‑bit stereo PCM WAV in‑browser.

Tunable feel lives in the `TUNING` object near the top of the script (exposed as
`window.TUNING` for live tweaking in the console).

## Credits

INTO INFINITY project by **dublab × Creative Commons**.
The original iOS application was conceived by **Dominique Chen** (Creative Commons Japan),
developed by **Kensuke Sembo** (exonemo) and **Hiroshi Okamura** (Ages5&Up), and produced by
**Alex Taisuke Odajima** (APPLIYA Inc.).

## License

- **Code** — GNU General Public License v3 (see [`LICENSE`](LICENSE)).
- **Media** — all EAR and EYE assets are published under **CC BY‑NC**.
