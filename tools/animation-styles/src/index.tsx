import React from "react";
import { Composition, registerRoot } from "remotion";
import { Compilation } from "./Compilation";
import { FPS, TOTAL_FRAMES } from "./styles";

const Root: React.FC = () => (
  <Composition id="Compilation" component={Compilation} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} defaultProps={{ available: [] as string[] }} />
);
registerRoot(Root);
