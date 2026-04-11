import type { CSSProperties } from "react";

type PetalSpec = {
  top: string;
  left: string;
  width: number;
  height: number;
  rotate: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
};

type DrapeSpec = {
  top: string;
  left: string;
  rotate: number;
  width: number;
  height: number;
  zIndex?: number;
};

type PaperFlowerVariant = "default" | "hero";

type PaperFlowerProps = {
  variant?: PaperFlowerVariant;
  className?: string;
  ariaHidden?: boolean;
};

type FlowerSpec = {
  outerPetals: PetalSpec[];
  innerPetals: PetalSpec[];
  bridgePetal: PetalSpec;
  drapes: DrapeSpec[];
  wrapper: CSSProperties;
  center: CSSProperties;
  core: CSSProperties;
};

const defaultOuterPetals: PetalSpec[] = [
  {
    top: "24%",
    left: "40%",
    width: 146,
    height: 188,
    rotate: -28,
    scale: 1.06,
    zIndex: 1,
  },
  {
    top: "24%",
    left: "60%",
    width: 146,
    height: 188,
    rotate: 28,
    scale: 1.06,
    zIndex: 1,
  },
  {
    top: "38%",
    left: "33%",
    width: 158,
    height: 176,
    rotate: -78,
    scale: 1.04,
    zIndex: 1,
  },
  {
    top: "38%",
    left: "67%",
    width: 158,
    height: 176,
    rotate: 78,
    scale: 1.04,
    zIndex: 1,
  },
  {
    top: "53.8%",
    left: "42%",
    width: 168,
    height: 228,
    rotate: 160,
    scale: 1.16,
    zIndex: 2,
  },
  {
    top: "53.8%",
    left: "58%",
    width: 168,
    height: 228,
    rotate: 200,
    scale: 1.16,
    zIndex: 2,
  },
];

const heroOuterPetals: PetalSpec[] = [
  {
    top: "22%",
    left: "38%",
    width: 152,
    height: 194,
    rotate: -40,
    scale: 1.12,
    zIndex: 1,
  },
  {
    top: "22%",
    left: "62%",
    width: 152,
    height: 194,
    rotate: 40,
    scale: 1.12,
    zIndex: 1,
  },
  {
    top: "38%",
    left: "30%",
    width: 168,
    height: 182,
    rotate: -88,
    scale: 1.08,
    zIndex: 1,
  },
  {
    top: "38%",
    left: "70%",
    width: 168,
    height: 182,
    rotate: 88,
    scale: 1.08,
    zIndex: 1,
  },
  {
    top: "56%",
    left: "39%",
    width: 176,
    height: 234,
    rotate: 166,
    scale: 1.2,
    zIndex: 2,
  },
  {
    top: "56%",
    left: "61%",
    width: 176,
    height: 234,
    rotate: 194,
    scale: 1.2,
    zIndex: 2,
  },
];

const defaultInnerPetals: PetalSpec[] = [
  {
    top: "31%",
    left: "50%",
    width: 96,
    height: 112,
    rotate: 0,
    scale: 0.95,
    zIndex: 4,
  },
  {
    top: "37%",
    left: "45%",
    width: 108,
    height: 124,
    rotate: -18,
    scale: 0.96,
    zIndex: 4,
  },
  {
    top: "37%",
    left: "55%",
    width: 108,
    height: 124,
    rotate: 18,
    scale: 0.96,
    zIndex: 4,
  },
  {
    top: "44%",
    left: "42%",
    width: 94,
    height: 108,
    rotate: -44,
    scale: 0.92,
    zIndex: 5,
  },
  {
    top: "44%",
    left: "58%",
    width: 94,
    height: 108,
    rotate: 44,
    scale: 0.92,
    zIndex: 5,
  },
  {
    top: "45%",
    left: "50%",
    width: 104,
    height: 114,
    rotate: 0,
    scale: 0.92,
    zIndex: 6,
  },
];

const heroInnerPetals: PetalSpec[] = [
  {
    top: "29%",
    left: "50%",
    width: 104,
    height: 118,
    rotate: 0,
    scale: 0.98,
    zIndex: 4,
  },
  {
    top: "36%",
    left: "44%",
    width: 112,
    height: 128,
    rotate: -24,
    scale: 0.98,
    zIndex: 4,
  },
  {
    top: "36%",
    left: "56%",
    width: 112,
    height: 128,
    rotate: 24,
    scale: 0.98,
    zIndex: 4,
  },
  {
    top: "44%",
    left: "40%",
    width: 100,
    height: 112,
    rotate: -54,
    scale: 0.94,
    zIndex: 5,
  },
  {
    top: "44%",
    left: "60%",
    width: 100,
    height: 112,
    rotate: 54,
    scale: 0.94,
    zIndex: 5,
  },
  {
    top: "46%",
    left: "50%",
    width: 110,
    height: 118,
    rotate: 0,
    scale: 0.96,
    zIndex: 6,
  },
];

const defaultBridgePetal: PetalSpec = {
  top: "52.6%",
  left: "50%",
  width: 128,
  height: 112,
  rotate: 0,
  scale: 1,
  zIndex: 5,
};

const heroBridgePetal: PetalSpec = {
  top: "52.2%",
  left: "50%",
  width: 140,
  height: 118,
  rotate: 0,
  scale: 1.03,
  zIndex: 5,
};

const defaultWrapperStyle: CSSProperties = {
  position: "relative",
  width: 420,
  height: 560,
  background: "transparent",
  overflow: "visible",
};

const heroWrapperStyle: CSSProperties = {
  ...defaultWrapperStyle,
  width: 438,
  height: 584,
};

const petalStyle = (petal: PetalSpec, inner = false): CSSProperties => ({
  position: "absolute",
  top: petal.top,
  left: petal.left,
  width: petal.width,
  height: petal.height,
  transform: `translate(-50%, -50%) rotate(${petal.rotate}deg) scale(${petal.scale ?? 1})`,
  transformOrigin: "50% 80%",
  borderRadius: inner
    ? "56% 44% 63% 37% / 59% 41% 71% 29%"
    : "58% 42% 66% 34% / 61% 39% 72% 28%",
  clipPath: inner
    ? "polygon(50% 0%, 61% 5%, 74% 11%, 87% 24%, 96% 41%, 92% 58%, 83% 73%, 69% 88%, 50% 100%, 33% 90%, 18% 76%, 10% 60%, 5% 41%, 13% 23%, 28% 10%, 40% 5%)"
    : "polygon(50% 0%, 62% 4%, 77% 10%, 90% 21%, 98% 39%, 94% 58%, 84% 76%, 67% 91%, 50% 100%, 30% 92%, 14% 77%, 7% 58%, 2% 39%, 10% 20%, 24% 10%, 39% 4%)",
  backgroundImage: [
    "radial-gradient(ellipse at 50% 28%, rgba(255,255,255,0.99) 0 20%, rgba(248,245,240,0.98) 38%, rgba(235,230,223,0.92) 62%, rgba(205,198,189,0.34) 100%)",
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,244,239,0.90) 42%, rgba(231,226,218,0.76) 100%)",
    "repeating-linear-gradient(98deg, rgba(255,255,255,0) 0 5px, rgba(205,199,190,0.18) 5px 6px, rgba(255,255,255,0) 6px 12px)",
    "repeating-linear-gradient(84deg, rgba(255,255,255,0) 0 15px, rgba(255,255,255,0.12) 15px 17px, rgba(0,0,0,0.03) 17px 18px, rgba(255,255,255,0) 18px 28px)",
    "radial-gradient(circle at 24% 16%, rgba(255,255,255,0.62), transparent 36%)",
    "radial-gradient(circle at 82% 80%, rgba(178,172,165,0.12), transparent 34%)",
  ].join(","),
  backgroundBlendMode: "normal, normal, multiply, soft-light, screen, multiply",
  boxShadow: [
    "inset 0 0 18px rgba(255,255,255,0.40)",
    "inset -14px -18px 26px rgba(195,188,180,0.16)",
    "inset 10px 8px 16px rgba(255,255,255,0.20)",
  ].join(", "),
  filter: "drop-shadow(0 7px 10px rgba(80,80,80,0.10))",
  opacity: petal.opacity ?? 1,
  zIndex: petal.zIndex ?? 2,
});

const drapeStyle = ({
  top,
  left,
  rotate,
  width,
  height,
  zIndex = 0,
}: DrapeSpec): CSSProperties => ({
  position: "absolute",
  top,
  left,
  width,
  height,
  transform: `translateX(-50%) rotate(${rotate}deg)`,
  transformOrigin: "50% 0%",
  borderRadius: "24% 24% 10% 10% / 8% 8% 22% 22%",
  clipPath:
    "polygon(28% 0%, 72% 0%, 80% 4%, 88% 16%, 92% 34%, 89% 100%, 11% 100%, 8% 34%, 12% 16%, 20% 4%)",
  backgroundImage: [
    "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(247,244,239,0.96) 45%, rgba(233,228,221,0.90) 100%)",
    "repeating-linear-gradient(90deg, rgba(203,198,191,0.16) 0 2px, rgba(255,255,255,0) 2px 11px)",
    "radial-gradient(circle at 30% 12%, rgba(255,255,255,0.35), transparent 30%)",
  ].join(","),
  backgroundBlendMode: "normal, multiply, screen",
  boxShadow:
    "inset -8px 0 16px rgba(210,205,198,0.18), inset 10px 0 16px rgba(255,255,255,0.35)",
  filter: "drop-shadow(0 14px 18px rgba(55,55,55,0.15))",
  zIndex,
});

const defaultCenterStyle: CSSProperties = {
  position: "absolute",
  top: "43%",
  left: "50%",
  width: 96,
  height: 96,
  transform: "translate(-50%, -50%)",
  borderRadius: "58% 42% 61% 39% / 60% 40% 58% 42%",
  backgroundImage: [
    "radial-gradient(circle at 50% 42%, rgba(255,255,255,1) 0 25%, rgba(245,241,236,0.98) 48%, rgba(228,223,215,0.84) 72%, rgba(208,201,193,0.30) 100%)",
    "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0 7px, rgba(210,205,197,0.10) 7px 9px)",
  ].join(","),
  boxShadow:
    "inset 0 0 16px rgba(255,255,255,0.45), inset -10px -12px 20px rgba(196,190,181,0.12)",
  zIndex: 7,
};

const heroCenterStyle: CSSProperties = {
  ...defaultCenterStyle,
  top: "42.6%",
  width: 102,
  height: 102,
};

const defaultCoreStyle: CSSProperties = {
  position: "absolute",
  top: "43%",
  left: "50%",
  width: 38,
  height: 38,
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0 34%, rgba(241,237,231,0.98) 66%, rgba(214,208,200,0.40) 100%)",
  zIndex: 8,
};

const heroCoreStyle: CSSProperties = {
  ...defaultCoreStyle,
  top: "42.6%",
  width: 40,
  height: 40,
};

const flowerSpecs: Record<PaperFlowerVariant, FlowerSpec> = {
  default: {
    outerPetals: defaultOuterPetals,
    innerPetals: defaultInnerPetals,
    bridgePetal: defaultBridgePetal,
    drapes: [
      {
        top: "42.8%",
        left: "47.2%",
        rotate: -8,
        width: 128,
        height: 268,
        zIndex: 1,
      },
      {
        top: "42.8%",
        left: "52.8%",
        rotate: 6,
        width: 136,
        height: 316,
        zIndex: 1,
      },
    ],
    wrapper: defaultWrapperStyle,
    center: defaultCenterStyle,
    core: defaultCoreStyle,
  },
  hero: {
    outerPetals: heroOuterPetals,
    innerPetals: heroInnerPetals,
    bridgePetal: heroBridgePetal,
    drapes: [
      {
        top: "40.6%",
        left: "46.7%",
        rotate: -12,
        width: 132,
        height: 286,
        zIndex: 1,
      },
      {
        top: "40.8%",
        left: "53.3%",
        rotate: 10,
        width: 142,
        height: 332,
        zIndex: 1,
      },
    ],
    wrapper: heroWrapperStyle,
    center: heroCenterStyle,
    core: heroCoreStyle,
  },
};

export const PaperFlower = ({
  variant = "default",
  className,
  ariaHidden = false,
}: PaperFlowerProps) => {
  const flower = flowerSpecs[variant];

  return (
    <div
      className={className ? `paper-flower ${className}` : "paper-flower"}
      style={flower.wrapper}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : "white paper flower"}
    >
      {flower.drapes.map((drape, index) => (
        <div key={`drape-${index}`} style={drapeStyle(drape)} />
      ))}

      <div style={petalStyle(flower.bridgePetal, true)} />

      {flower.outerPetals.map((petal, index) => (
        <div key={`outer-${index}`} style={petalStyle(petal, false)} />
      ))}

      {flower.innerPetals.map((petal, index) => (
        <div key={`inner-${index}`} style={petalStyle(petal, true)} />
      ))}

      <div style={flower.center} />
      <div style={flower.core} />
    </div>
  );
};
