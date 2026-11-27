import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CLIP_FRAMES, GRID_FRAMES, GRID_PICK, STYLES, WIPE_FRAMES } from "./styles";

export type Props = { available: string[] };

const ACCENT = "#ff4d3d";
const font = "Inter, 'Helvetica Neue', Arial, sans-serif";

// Clipe real se o arquivo existir, senão placeholder (render.mjs lista o que existe em public/clips).
const Clip: React.FC<{ i: number; available: string[] }> = ({ i, available }) => {
  const s = STYLES[i];
  if (available.includes(s.file)) {
    return <OffthreadVideo src={staticFile(`clips/${s.file}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  const hue = (i * 36) % 360;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, hsl(${hue} 70% 35%), hsl(${(hue + 60) % 360} 70% 15%))`, alignItems: "center", justifyContent: "center", fontFamily: font, color: "#fff" }}>
      <div style={{ fontSize: 160, fontWeight: 800 }}>{String(i + 1).padStart(2, "0")}</div>
      <div style={{ fontSize: 40, opacity: 0.85 }}>{s.name}</div>
    </AbsoluteFill>
  );
};

const Card: React.FC<Props & { w: number; h: number }> = ({ available, w, h }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 28, overflow: "hidden", background: "#111" }}>
      {STYLES.map((_, i) => {
        const start = i * CLIP_FRAMES;
        const local = frame - start;
        if (local < 0 || frame >= start + CLIP_FRAMES + WIPE_FRAMES) return null;
        // o clipe novo entra da esquerda para a direita sobre o anterior
        const reveal = i === 0 ? 100 : interpolate(local, [0, WIPE_FRAMES], [0, 100], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        return (
          <Sequence key={i} from={start} durationInFrames={CLIP_FRAMES + WIPE_FRAMES} layout="none">
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
              <Clip i={i} available={available} />
            </div>
          </Sequence>
        );
      })}
    </div>
  );
};

const Intro: React.FC<Props> = ({ available }) => {
  const frame = useCurrentFrame();
  const active = Math.min(STYLES.length - 1, Math.floor(frame / CLIP_FRAMES));
  return (
    <AbsoluteFill style={{ fontFamily: font, color: "#fff" }}>
      <div style={{ position: "absolute", top: 90, left: 60, right: 60, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
        10 <span style={{ color: ACCENT }}>Claude</span> Animation styles
      </div>
      <div style={{ position: "absolute", top: 560, left: 60, width: 400 }}>
        {STYLES.map((s, i) => (
          <div key={s.file} style={{ display: "flex", gap: 18, alignItems: "baseline", height: 100, fontSize: 40, fontWeight: i === active ? 800 : 500, color: i === active ? "#fff" : "#666", transition: "none" }}>
            <span style={{ color: i === active ? ACCENT : "#444", fontVariantNumeric: "tabular-nums", width: 56 }}>{String(i + 1).padStart(2, "0")}</span>
            <span>{s.name}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 520, right: 50 }}>
        <Card available={available} w={520} h={925} />
      </div>
    </AbsoluteFill>
  );
};

const Grid: React.FC<Props> = ({ available }) => {
  const frame = useCurrentFrame();
  const w = 320;
  const h = 569;
  return (
    <AbsoluteFill style={{ fontFamily: font, color: "#fff", alignItems: "center" }}>
      <div style={{ marginTop: 90, fontSize: 84, fontWeight: 800 }}>
        10 <span style={{ color: ACCENT }}>Claude</span> Animation styles
      </div>
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: `repeat(3, ${w}px)`, gap: 24 }}>
        {GRID_PICK.map((idx, n) => {
          const o = interpolate(frame, [n * 4, n * 4 + 10], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={idx} style={{ opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
              <div style={{ width: w, height: h, borderRadius: 22, overflow: "hidden", position: "relative" }}>
                <Clip i={idx} available={available} />
              </div>
              <div style={{ marginTop: 10, fontSize: 28, fontWeight: 600 }}>{STYLES[idx].name}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Compilation: React.FC<Props> = (props) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={STYLES.length * CLIP_FRAMES}>
      <Intro {...props} />
    </Sequence>
    <Sequence from={STYLES.length * CLIP_FRAMES} durationInFrames={GRID_FRAMES}>
      <Grid {...props} />
    </Sequence>
  </AbsoluteFill>
);
