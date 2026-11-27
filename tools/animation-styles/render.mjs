// Uso: node render.mjs [saida.mp4] | node render.mjs --still [frame]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const clips = path.join(here, "public", "clips");
const available = existsSync(clips) ? readdirSync(clips).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, "")) : [];
console.log(`Clipes encontrados: ${available.length}/10`, available);

const browserExecutable = process.env.YS_BROWSER_EXECUTABLE || undefined;
const serveUrl = await bundle({ entryPoint: path.join(here, "src", "index.tsx") });
const inputProps = { available };
const comp = await selectComposition({ serveUrl, browserExecutable, id: "Compilation", inputProps });
const args = process.argv.slice(2);
if (args[0] === "--still") {
  const frame = Number(args[1] ?? 0);
  const out = path.join(here, `still-${frame}.png`);
  await renderStill({ browserExecutable, composition: comp, serveUrl, inputProps, frame, output: out });
  console.log("Still:", out);
} else {
  const out = path.resolve(args[0] ?? path.join(here, "compilation.mp4"));
  await renderMedia({ browserExecutable, composition: comp, serveUrl, inputProps, codec: "h264", outputLocation: out });
  console.log("Vídeo:", out);
}
