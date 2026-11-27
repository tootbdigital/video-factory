// Ordem da lista = ordem do playbook. O arquivo esperado é public/clips/<file>.mp4
export const STYLES = [
  { file: "01-claymation", name: "Claymation" },
  { file: "02-anime", name: "Anime" },
  { file: "03-pixel-art", name: "Pixel Art" },
  { file: "04-flat-vector", name: "Flat Vector" },
  { file: "05-comic-book", name: "Comic Book" },
  { file: "06-3d-animation", name: "3D Animation" },
  { file: "07-cartoon", name: "Cartoon" },
  { file: "08-low-poly", name: "Retro Low-Poly" },
  { file: "09-storybook", name: "Storybook" },
  { file: "10-toy-bricks", name: "Toy Bricks" },
] as const;

export const FPS = 30;
export const CLIP_FRAMES = 36; // 1,2 s por clipe
export const WIPE_FRAMES = 8; // cortina horizontal
export const GRID_FRAMES = 90; // 3 s de grade final
export const GRID_PICK = [0, 1, 2, 5, 8, 9]; // índices dos 6 clipes da grade (troque à vontade)
export const TOTAL_FRAMES = STYLES.length * CLIP_FRAMES + GRID_FRAMES;
