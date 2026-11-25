import { type CSSProperties, useEffect, useRef } from 'react';
import { PAW_PATH } from './icons';
import { prefersReducedMotion, useReducedMotion } from './RevealScope';

// Procedural contour generator matching reference module 1063
function blob(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  wobble: number,
  startAngle = -Math.PI / 2,
  rotDeg = 0,
): string {
  const rad = (rotDeg * Math.PI) / 180;
  const pt = (a: number, rOff: number) => {
    const x = Math.cos(a) * (rx + rOff);
    const y = Math.sin(a) * (ry + (ry / rx) * rOff);
    return `${(cx + x * Math.cos(rad) - y * Math.sin(rad)).toFixed(1)} ${(cy + x * Math.sin(rad) + y * Math.cos(rad)).toFixed(1)}`;
  };
  let d = '';
  for (let i = 0; i < n; i++) {
    const a1 = startAngle + (i / n) * Math.PI * 2;
    const a2 = startAngle + ((i + 1) / n) * Math.PI * 2;
    const mid = (a1 + a2) / 2;
    d += `${i === 0 ? `M${pt(a1, 0)}` : ''}Q${pt(mid, 2.1 * wobble)} ${pt(a2, 0)}`;
  }
  return `${d}Z`;
}

export const PUP_W = 300;
export const PUP_H = 240;
export const GROUND_Y = 228;
export const EYE_Y = 98;

export const COLORS = {
  coat: '#f2be6b',
  coatShade: '#e4a352',
  muzzle: '#fbe3b4',
  collar: '#a24a1a',
  cheek: '#f9b9a6',
  ink: '#2a170e',
};

const PIVOT_BODY: [number, number] = [196, 206];
export const PIVOT_HEAD: [number, number] = [212, 100];
const SHOULDER_N: [number, number] = [186, 194];
const SHOULDER_F: [number, number] = [168, 192];
const HIP_N: [number, number] = [110, 194];
const HIP_F: [number, number] = [94, 192];
const TAIL_BASE: [number, number] = [84, 150];
const EAR_L: [number, number] = [174, 82];
const EAR_R: [number, number] = [250, 82];

export const ANCHORS = {
  shoulderN: SHOULDER_N,
  shoulderF: SHOULDER_F,
  hipN: HIP_N,
  hipF: HIP_F,
  tailBase: TAIL_BASE,
};

function makeLeg(w: number, h: number): string {
  const hw = w / 2;
  return `M${-hw} -14 C${-hw} 4 -12 ${h - 18} -12 ${h - 9} C-12 ${h - 2} -7 ${h} 0 ${h} C9 ${h} 13 ${h - 3} 13 ${h - 9} C13 ${h - 18} ${hw} 4 ${hw} -14`;
}

export const LEG_PATHS = {
  front: makeLeg(24, GROUND_Y - SHOULDER_N[1]),
  frontFar: makeLeg(22, GROUND_Y - SHOULDER_F[1]),
  back: makeLeg(30, GROUND_Y - HIP_N[1]),
  backFar: makeLeg(28, GROUND_Y - HIP_F[1]),
};

export const toePath = (len: number) => `M-3.5 ${len - 7} v5 M4.5 ${len - 7} v5`;

export const PUP_PARTS = {
  body: blob(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: blob(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: blob(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: blob(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw:
    'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: blob(212, 100, 51, 46, 16, 3.6),
  topknot: blob(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: blob(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: blob(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle:
    'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth:
    'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen:
    'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws:
    'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  shadow: { cx: 150, cy: 230, rx: 92, ry: 7 },
};

export interface PoseState {
  bodyRot: number;
  bodyX: number;
  bodyY: number;
  stretch: number;
  headX: number;
  headY: number;
  headRot: number;
  earL: number;
  earR: number;
  tail: number;
  fn: number;
  ff: number;
  bn: number;
  bf: number;
  sit: number;
  eyes: number;
  happy: number;
  tongue: number;
  mouth: number;
  front: number;
}

const BASE_POSE: PoseState = {
  bodyRot: 0,
  bodyX: 0,
  bodyY: 0,
  stretch: 1,
  headX: 0,
  headY: 0,
  headRot: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  fn: 0,
  ff: 0,
  bn: 0,
  bf: 0,
  sit: 0,
  eyes: 1,
  happy: 0,
  tongue: 0,
  mouth: 0,
  front: 0,
};

export type PoseName =
  | 'stand'
  | 'walk'
  | 'sit'
  | 'peek'
  | 'snug'
  | 'lie'
  | 'sleep'
  | 'settle'
  | 'hop'
  | 'sniff'
  | 'bow'
  | 'beg';

export const POSES: Record<PoseName, PoseState> = {
  stand: BASE_POSE,
  walk: { ...BASE_POSE, tail: -6, tongue: 1 },
  sit: { ...BASE_POSE, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...BASE_POSE, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...BASE_POSE, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: {
    ...BASE_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 12,
    headY: 40,
    headRot: 3,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 58,
    tongue: 0,
  },
  sleep: {
    ...BASE_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 14,
    headY: 44,
    headRot: -8,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 64,
    eyes: 0,
    earL: 4,
    earR: -4,
  },
  settle: {
    ...BASE_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 10,
    headY: 16,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 40,
    tongue: 1,
  },
  hop: {
    ...BASE_POSE,
    bodyRot: -9,
    stretch: 1.06,
    headY: -6,
    fn: -42,
    ff: -32,
    bn: 40,
    bf: 30,
    earL: -26,
    earR: 26,
    tail: -24,
    tongue: 1,
  },
  sniff: { ...BASE_POSE, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: {
    ...BASE_POSE,
    bodyRot: 15,
    bodyY: 2,
    headX: 14,
    headY: 30,
    fn: -58,
    ff: -52,
    tail: -32,
    happy: 1,
    tongue: 1,
  },
  beg: {
    ...BASE_POSE,
    bodyRot: -36,
    bodyY: -6,
    headX: -18,
    headY: -18,
    sit: 1,
    fn: -70,
    ff: -64,
    tail: 30,
    happy: 1,
    tongue: 1,
  },
};

const POSE_KEYS = Object.keys(BASE_POSE) as (keyof PoseState)[];

export interface MotionState {
  phase: number;
  stride: number;
  time: number;
  wag: number;
  gazeX: number;
  gazeY: number;
  blink: number;
  ear: number;
}

const DEFAULT_MOTION: MotionState = {
  phase: 0,
  stride: 0,
  time: 0,
  wag: 0,
  gazeX: 0,
  gazeY: 0,
  blink: 0,
  ear: 0,
};

const r2 = (n: number) => Math.round(100 * n) / 100;
const rot = (deg: number, [px, py]: [number, number]) => `rotate(${r2(deg)} ${px} ${py})`;

export function lerpPose(a: PoseState, b: PoseState, t: number): PoseState {
  const out = { ...a };
  for (const k of POSE_KEYS) {
    out[k] = a[k] + (b[k] - a[k]) * t;
  }
  return out;
}

export function evalPup(pose: PoseState, m: MotionState = DEFAULT_MOTION) {
  const s1 = Math.sin(m.phase);
  const s2 = Math.sin(m.phase + Math.PI);
  const swing = 20 + 10 * m.stride;
  const bobWave = (1 - Math.cos(2 * m.phase)) / 2;
  const moving = Number(m.stride > 0.01);
  const idleBreath = Math.sin(2.4 * m.time) * (1 - moving);
  const bodyY = pose.bodyY - bobWave * (2.5 + 4 * m.stride) * moving + 0.6 * idleBreath;
  const bodyRot = pose.bodyRot + 1.6 * Math.sin(m.phase) * moving;
  const negRot = -pose.bodyRot;
  const wagAmp = 5 + 17 * m.wag;
  const wagFreq = 1.2 + 2.6 * m.wag;
  const tailAngle = pose.tail + Math.sin(m.time * wagFreq * Math.PI * 2) * wagAmp;
  const headBob = -(1 - Math.cos(2 * m.phase - 0.7)) / 2 * (2 + 3 * m.stride) * moving + 0.9 * idleBreath;

  return {
    body: `translate(${r2(pose.bodyX)} ${r2(bodyY)}) ${rot(bodyRot, PIVOT_BODY)} translate(${PIVOT_BODY[0]} 0) scale(${r2(pose.stretch)} 1) translate(${-PIVOT_BODY[0]} 0)`,
    fn: `translate(${SHOULDER_N[0]} ${SHOULDER_N[1]}) rotate(${r2(pose.fn + negRot + s1 * swing * moving)})`,
    ff: `translate(${SHOULDER_F[0]} ${SHOULDER_F[1]}) rotate(${r2(pose.ff + negRot + s2 * swing * moving)})`,
    bn: `translate(${HIP_N[0]} ${HIP_N[1]}) rotate(${r2(pose.bn + s2 * swing * moving)})`,
    bf: `translate(${HIP_F[0]} ${HIP_F[1]}) rotate(${r2(pose.bf + s1 * swing * moving)})`,
    tail: rot(tailAngle, TAIL_BASE),
    haunch: `translate(0 ${r2(-(0.06 * pose.bodyRot))})`,
    head: `translate(${r2(pose.headX)} ${r2(pose.headY + headBob)}) ${rot(pose.headRot + 1.4 * Math.sin(m.phase) * moving, PIVOT_HEAD)}`,
    earL: rot(pose.earL + m.ear + 4 * Math.sin(2 * m.phase) * moving, EAR_L),
    earR: rot(pose.earR - m.ear - 4 * Math.sin(2 * m.phase) * moving, EAR_R),
    eyes: `translate(${r2(3.4 * m.gazeX)} ${r2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${r2(EYE_Y * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
    openEyes: r2(Math.max(0, pose.eyes - pose.happy)),
    happyEyes: r2(Math.min(pose.happy, pose.eyes)),
    shutEyes: r2(1 - pose.eyes),
    tongue: r2(pose.tongue * (1 - pose.mouth)),
    mouth: r2(pose.mouth),
    backLegs: r2(1 - pose.sit),
    haunchOpacity: r2(pose.sit * (1 - pose.front)),
    side: r2(1 - pose.front),
    ledge: r2(pose.front),
    shadow: `translate(${r2(0.6 * pose.bodyX)} 0) scale(${r2(1 - 0.05 * bobWave * moving)} 1)`,
    shadowOpacity: r2(0.12 * (1 - pose.front)),
  };
}

const OUTLINE = {
  stroke: COLORS.ink,
  strokeWidth: 3.4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};
const STROKE_ONLY = { ...OUTLINE, fill: 'none' as const };

function Leg({ part, d, len, fill, transform, opacity }: {
  part: string;
  d: string;
  len: number;
  fill: string;
  transform: string;
  opacity?: number;
}) {
  return (
    <g data-p={part} transform={transform} opacity={opacity}>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} {...STROKE_ONLY} />
      <path d={toePath(len)} {...STROKE_ONLY} strokeWidth={2.4} />
    </g>
  );
}

function OpenEyes() {
  return (
    <>
      <ellipse cx={194} cy={EYE_Y} rx={7.4} ry={8.6} fill={COLORS.ink} />
      <ellipse cx={230} cy={EYE_Y} rx={7.4} ry={8.6} fill={COLORS.ink} />
      <circle cx={196.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={232.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={192} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
      <circle cx={228} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
    </>
  );
}

export function PupSvg({
  pose = 'sit',
  facing = 'right',
  className,
  label,
  style,
}: {
  pose?: PoseName;
  facing?: 'left' | 'right';
  className?: string;
  label?: string;
  style?: CSSProperties;
}) {
  const f = evalPup(POSES[pose]);
  const rootTransform = facing === 'left' ? `translate(${PUP_W} 0) scale(-1 1)` : undefined;

  return (
    <svg
      viewBox={`0 0 ${PUP_W} ${PUP_H}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
      focusable="false"
    >
      <g data-p="root" transform={rootTransform}>
        <ellipse
          data-p="shadow"
          {...PUP_PARTS.shadow}
          fill={COLORS.ink}
          opacity={f.shadowOpacity}
          transform={f.shadow}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <g data-p="body" transform={f.body} opacity={f.side}>
          <Leg part="bf" d={LEG_PATHS.backFar} len={GROUND_Y - 192} fill={COLORS.coatShade} transform={f.bf} opacity={f.backLegs} />
          <Leg part="ff" d={LEG_PATHS.frontFar} len={GROUND_Y - 192} fill={COLORS.coatShade} transform={f.ff} />
          <g data-p="tail" transform={f.tail}>
            <path d={PUP_PARTS.tailStem} {...STROKE_ONLY} strokeWidth={9} />
            <path d={PUP_PARTS.tailStem} stroke={COLORS.coat} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={PUP_PARTS.tail} fill={COLORS.coat} {...OUTLINE} />
          </g>
          <Leg part="bn" d={LEG_PATHS.back} len={GROUND_Y - 194} fill={COLORS.coat} transform={f.bn} opacity={f.backLegs} />
          <path d={PUP_PARTS.body} fill={COLORS.coat} {...OUTLINE} />
          <path d={PUP_PARTS.chest} fill={COLORS.coat} {...OUTLINE} />
          <Leg part="fn" d={LEG_PATHS.front} len={GROUND_Y - 194} fill={COLORS.coat} transform={f.fn} />
        </g>
        <g data-p="haunch" opacity={f.haunchOpacity} transform={f.haunch}>
          <path d={PUP_PARTS.haunch} fill={COLORS.coat} {...OUTLINE} />
          <path d={PUP_PARTS.haunchPaw} fill={COLORS.coat} {...OUTLINE} />
          <path d="M132 222v5M139 222v5" {...STROKE_ONLY} strokeWidth={2.4} />
        </g>
        <g data-p="head" transform={f.head}>
          <path d={PUP_PARTS.collar} fill={COLORS.collar} {...OUTLINE} strokeWidth={3} />
          <path d={PUP_PARTS.tag} fill={COLORS.muzzle} {...OUTLINE} strokeWidth={2.4} />
          <path data-p="earL" d={PUP_PARTS.earL} fill={COLORS.coatShade} {...OUTLINE} transform={f.earL} />
          <path data-p="earR" d={PUP_PARTS.earR} fill={COLORS.coatShade} {...OUTLINE} transform={f.earR} />
          <path d={PUP_PARTS.head} fill={COLORS.coat} {...OUTLINE} />
          <path d={PUP_PARTS.topknot} fill={COLORS.coat} {...OUTLINE} strokeWidth={3} />
          <path d={PUP_PARTS.muzzle} fill={COLORS.muzzle} />
          <circle cx={181} cy={116} r={7} fill={COLORS.cheek} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={COLORS.cheek} opacity={0.85} />
          <g data-p="eyes" transform={f.eyes}>
            <g data-p="open" opacity={f.openEyes}>
              <g data-p="blink" transform={f.blink}>
                <OpenEyes />
              </g>
            </g>
          </g>
          <path
            data-p="happy"
            d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
            {...STROKE_ONLY}
            opacity={f.happyEyes}
          />
          <path
            data-p="shut"
            d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
            {...STROKE_ONLY}
            opacity={f.shutEyes}
          />
          <path d={PUP_PARTS.nose} fill={COLORS.ink} />
          <path d={PUP_PARTS.mouth} {...STROKE_ONLY} strokeWidth={3} />
          <path
            data-p="tongue"
            d={PUP_PARTS.tongue}
            fill="#e98c8c"
            stroke={COLORS.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
            opacity={f.tongue}
          />
          <g data-p="mouth" opacity={f.mouth}>
            <path d={PUP_PARTS.mouthOpen} fill="#6b2a1c" {...OUTLINE} strokeWidth={2.6} />
            <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
          </g>
        </g>
        <g data-p="ledge" opacity={f.ledge}>
          <path d={PUP_PARTS.ledgePaws} fill={COLORS.coat} {...OUTLINE} />
          <path d={PUP_PARTS.ledgeToes} {...STROKE_ONLY} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  );
}

const RIG_ATTRS: Array<[string, string, string]> = [
  ['root', 'transform', 'root'],
  ['shadow', 'transform', 'shadow'],
  ['shadow', 'opacity', 'shadowOpacity'],
  ['body', 'transform', 'body'],
  ['body', 'opacity', 'side'],
  ['bf', 'transform', 'bf'],
  ['bf', 'opacity', 'backLegs'],
  ['bn', 'transform', 'bn'],
  ['bn', 'opacity', 'backLegs'],
  ['ff', 'transform', 'ff'],
  ['fn', 'transform', 'fn'],
  ['tail', 'transform', 'tail'],
  ['haunch', 'transform', 'haunch'],
  ['haunch', 'opacity', 'haunchOpacity'],
  ['head', 'transform', 'head'],
  ['earL', 'transform', 'earL'],
  ['earR', 'transform', 'earR'],
  ['eyes', 'transform', 'eyes'],
  ['open', 'opacity', 'openEyes'],
  ['blink', 'transform', 'blink'],
  ['happy', 'opacity', 'happyEyes'],
  ['shut', 'opacity', 'shutEyes'],
  ['tongue', 'opacity', 'tongue'],
  ['mouth', 'opacity', 'mouth'],
  ['ledge', 'opacity', 'ledge'],
];

const damp = (dt: number, half: number) => 1 - Math.exp(-dt / half);
const clamp = (v: number, lo = -1, hi = 1) => Math.max(lo, Math.min(hi, v));

export class PupRig {
  svg: SVGSVGElement;
  els = new Map<string, Element>();
  written = new Map<string, string>();
  pose: PoseState;
  target: PoseState;
  m: MotionState;
  facing: number;
  facingTarget: number;
  strideTarget = 0;
  wagTarget = 0.35;
  gazeTarget = { x: 0, y: 0 };
  tilt = 0;
  tiltTarget = 0;
  earV = 0;
  nextBlink = 1.2;
  blinkAt = -1;
  woofUntil = 0;
  bounce = 0;
  bounceV = 0;
  offset = 0;
  offsetTarget = 0;
  pet = 0;
  petTarget = 0;
  turn = 0.07;
  lean = 0;

  constructor(svg: SVGSVGElement, pose: PoseName = 'sit', facing = 1) {
    this.svg = svg;
    this.m = { ...DEFAULT_MOTION };
    svg.querySelectorAll('[data-p]').forEach((el) => {
      const key = (el as HTMLElement).dataset.p;
      if (key) this.els.set(key, el);
    });
    this.pose = { ...POSES[pose] };
    this.target = this.pose;
    this.facing = facing;
    this.facingTarget = facing;
  }

  setPose(p: PoseName | PoseState) {
    this.target = typeof p === 'string' ? POSES[p] : p;
  }

  jump(p: PoseName, facing?: number) {
    this.pose = { ...POSES[p] };
    this.target = POSES[p];
    if (facing) {
      this.facing = this.facingTarget = facing;
    }
  }

  face(dir: number, turn = 0.07) {
    this.facingTarget = dir;
    this.turn = turn;
  }

  get facingDir() {
    return this.facingTarget;
  }

  stride(v: number) {
    this.strideTarget = clamp(v, 0, 1);
  }

  advance(px: number) {
    this.m.phase += (px / 46) * Math.PI;
  }

  walkedTo(px: number) {
    this.m.phase = (px / 46) * Math.PI;
  }

  wag(v: number) {
    this.wagTarget = clamp(v, 0, 1);
  }

  cock(deg: number) {
    this.tiltTarget = deg;
  }

  lookAt(pt: { x: number; y: number } | null) {
    if (!pt) {
      this.gazeTarget = { x: 0, y: 0 };
      return;
    }
    const rect = this.svg.getBoundingClientRect();
    const eyeX = this.facingTarget > 0 ? PIVOT_HEAD[0] : PUP_W - PIVOT_HEAD[0];
    const sx = rect.left + (eyeX / PUP_W) * rect.width;
    const sy = rect.top + (EYE_Y / PUP_H) * rect.height;
    const dx = pt.x - sx;
    const dy = pt.y - sy;
    const dist = Math.hypot(dx, dy) || 1;
    const gain = Math.min(1, dist / 160);
    this.gazeTarget = {
      x: (dx / dist) * gain * this.facingTarget,
      y: (dy / dist) * gain,
    };
  }

  woof(now: number) {
    this.woofUntil = now + 0.34;
    this.bounceV = -150;
    this.earV += 260;
  }

  jolt(power = 1) {
    this.earV += 220 * power;
  }

  hop(power = 1) {
    this.bounceV = -230 * power;
    this.earV += 200 * power;
  }

  yawn(now: number, dur = 0.9) {
    this.woofUntil = now + dur;
  }

  dash(px: number) {
    this.offsetTarget = px;
  }

  petting(on: boolean) {
    this.petTarget = Number(Boolean(on));
  }

  reset() {
    this.offsetTarget = 0;
    this.tiltTarget = 0;
    this.petTarget = 0;
  }

  tick(dt: number, now: number) {
    const step = Math.min(dt, 0.05);
    const m = this.m;
    m.time = now;
    this.pose = lerpPose(this.pose, this.target, damp(step, 0.16));
    this.facing += (this.facingTarget - this.facing) * damp(step, this.turn);
    m.stride += (this.strideTarget - m.stride) * damp(step, 0.12);
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0;
    m.wag += (this.wagTarget - m.wag) * damp(step, 0.4);
    m.gazeX += (this.gazeTarget.x - m.gazeX) * damp(step, 0.07);
    m.gazeY += (this.gazeTarget.y - m.gazeY) * damp(step, 0.07);
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * damp(step, 0.18);
    this.earV += (-150 * m.ear - 10 * this.earV) * step;
    m.ear = clamp(m.ear + this.earV * step, -28, 28);
    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * step;
    this.bounce += this.bounceV * step;

    const prevOffset = this.offset;
    this.offset += (this.offsetTarget - this.offset) * damp(step, 0.2);
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) this.offset = this.offsetTarget;
    const moved = Math.abs(this.offset - prevOffset);
    if (moved) this.advance(moved);
    const dashStride = step > 0 ? Math.min(1, moved / step / 180) : 0;

    this.pet += (this.petTarget - this.pet) * damp(step, 0.15);

    if (now > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = now;
      this.nextBlink = now + 2.2 + 3.8 * Math.random();
      if (Math.random() < 0.18) this.nextBlink = now + 0.32;
    }
    const blinkT = (now - this.blinkAt) / 0.15;
    m.blink = blinkT >= 0 && blinkT <= 1 ? Math.sin(blinkT * Math.PI) : 0;

    const p: PoseState = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: now < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet),
    };
    const evaluated = evalPup(p, dashStride > m.stride ? { ...m, stride: dashStride } : m);
    const scaleX = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing;
    const rootT = `translate(${this.offset.toFixed(1)} 0) translate(${PUP_W / 2} 0) scale(${scaleX.toFixed(3)} 1) translate(${-PUP_W / 2} 0)`;

    for (const [part, attr, key] of RIG_ATTRS) {
      const el = this.els.get(part);
      if (!el) continue;
      const val = key === 'root' ? rootT : String(evaluated[key as keyof typeof evaluated]);
      const cacheKey = `${part}:${attr}`;
      if (this.written.get(cacheKey) !== val) {
        el.setAttribute(attr, val);
        this.written.set(cacheKey, val);
      }
    }
  }
}

export interface TrickContext {
  d: PupRig;
  rest: PoseState;
  facing: number;
  say: (msg: string, dur?: number) => void;
  hearts: () => void;
}

type TrickStep = [number, (t: number) => void];
type TrickName = 'woof' | 'spin' | 'beg' | 'bow' | 'hop' | 'love' | 'tilt' | 'sneeze' | 'zoomies' | 'peekaboo';

const flipDir = (f: number) => (f === 1 ? -1 : 1);
const BASE_TRICKS: TrickName[] = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze'];
let trickDeck: TrickName[] = [];

export function nextTrick(last: TrickName | null, combo: number): TrickName {
  if (combo >= 4) return 'zoomies';
  if (!trickDeck.length) {
    trickDeck = BASE_TRICKS.filter((t) => t !== last).sort(() => Math.random() - 0.5);
  }
  return trickDeck.pop()!;
}

export const TRICKS: Record<TrickName, (ctx: TrickContext, now: number) => TrickStep[]> = {
  woof: ({ d, say }, t) => [
    [t, (n) => { d.woof(n); say('woof!'); }],
    [t + 0.42, (n) => { d.woof(n); say('woof woof!'); }],
  ],
  spin: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('stand'); d.hop(0.5); }],
    [t + 0.14, () => d.face(flipDir(facing))],
    [t + 0.38, () => d.face(facing)],
    [t + 0.62, () => d.face(flipDir(facing))],
    [t + 0.86, () => { d.face(facing); say('wheee!'); }],
    [t + 1.3, () => d.setPose(rest)],
  ],
  beg: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('beg'); d.wag(1); say('treat, please?', 1.7); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  bow: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('bow'); d.wag(1); say('play with me!'); }],
    [t + 0.55, () => d.hop(0.45)],
    [t + 1.7, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  hop: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('hop'); d.hop(1.1); say('boing!'); }],
    [t + 0.36, () => d.setPose(rest)],
    [t + 0.62, () => { d.setPose('hop'); d.hop(0.8); }],
    [t + 0.98, () => d.setPose(rest)],
  ],
  love: ({ d, rest, say, hearts }, t) => [
    [t, () => { d.setPose({ ...rest, happy: 1, tongue: 1 }); d.wag(1); hearts(); say('I like you!', 1.5); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  tilt: ({ d, say }, t) => [
    [t, () => { d.cock(-14); say('hm?'); }],
    [t + 0.8, () => d.cock(12)],
    [t + 1.6, () => d.cock(0)],
  ],
  sneeze: ({ d, say }, t) => [
    [t, () => d.cock(-8)],
    [t + 0.32, (n) => { d.cock(10); d.jolt(1.4); d.hop(0.35); d.yawn(n, 0.22); say('achoo!'); }],
    [t + 0.8, () => d.cock(0)],
  ],
  zoomies: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('walk'); d.wag(1); say('zoomies!', 2); }],
    [t + 0.04, () => { d.face(flipDir(facing)); d.dash(-95); }],
    [t + 0.55, () => { d.face(facing); d.dash(110); }],
    [t + 1.15, () => { d.face(flipDir(facing)); d.dash(0); }],
    [t + 1.7, () => { d.face(facing); d.setPose(rest); d.wag(0.7); }],
  ],
  peekaboo: ({ d, rest, say }, t) => [
    [t, () => d.setPose({ ...rest, headY: 120 })],
    [t + 0.6, () => { d.setPose(rest); d.jolt(1.2); say('boo!', 1.1); }],
  ],
};

export function spawnHearts(host: HTMLElement, x: number, y: number) {
  for (let i = 0; i < 4; i++) {
    const el = document.createElement('span');
    el.className = 'pup-heart';
    el.textContent = '♥';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    host.append(el);
    const dx = (Math.random() - 0.5) * 90;
    const dy = -70 - 60 * Math.random();
    el.animate(
      [
        { transform: 'translate(-50%, 0) scale(0.4)', opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(calc(-50% + ${dx.toFixed(0)}px), ${dy.toFixed(0)}px) scale(1.1)`, opacity: 0 },
      ],
      {
        duration: 1150 + 110 * i,
        delay: 80 * i,
        easing: 'cubic-bezier(.2,.7,.3,1)',
        fill: 'backwards',
      },
    ).finished.then(
      () => el.remove(),
      () => el.remove(),
    );
  }
}

const PEEK_TRICKS: TrickName[] = ['peekaboo', 'woof', 'tilt', 'sneeze'];
const SNUG_TRICKS: TrickName[] = ['tilt', 'love', 'sneeze', 'woof'];

export function PupBuddy({
  pose = 'sit',
  facing = 'right',
  act,
  label,
  className = '',
  style,
  asStop = false,
}: {
  pose?: PoseName;
  facing?: 'left' | 'right';
  act?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
  asStop?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const host = wrapRef.current;
    const bubble = bubbleRef.current;
    const svg = host?.querySelector('svg');
    if (!host || !bubble || !svg) return;

    const facingSign = facing === 'left' ? -1 : 1;
    const rig = new PupRig(svg, pose, facingSign);
    rig.wag(0.6);

    let queue: TrickStep[] = [];
    let lastTick = performance.now() / 1000;
    let lastIdle = lastTick;
    let bubbleUntil = 0;
    let gaze: { x: number; y: number; t: number } | null = null;
    let lastTrick: TrickName | null = null;
    let combo = 0;
    let lastClick = 0;
    let active = false;
    let playingUntil = 0;
    let rafId = 0;

    const ctx: TrickContext = {
      d: rig,
      rest: POSES[pose],
      facing: facingSign,
      say: (msg, dur = 1.4) => {
        bubble.textContent = msg;
        bubble.dataset.show = 'true';
        bubbleUntil = performance.now() / 1000 + dur;
      },
      hearts: () =>
        spawnHearts(host, host.clientWidth * (facingSign > 0 ? 0.7 : 0.3), 0.25 * host.clientHeight),
    };

    const tick = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTick);
      lastTick = now;
      while (queue.length && queue[0][0] <= now) {
        queue.shift()![1](now);
      }
      const nowPlaying = now < playingUntil;
      if (active !== nowPlaying) {
        active = nowPlaying;
        host.toggleAttribute('data-playing', active);
      }
      rig.lookAt(gaze && now - gaze.t < 3 ? gaze : null);
      if (act === 'tilt' && !queue.length) {
        rig.cock(Math.sin(0.9 * now) > 0.35 ? 13 : Math.sin(0.9 * now) < -0.35 ? -10 : 0);
      }
      if (!queue.length && now - lastIdle > 9) {
        lastIdle = now;
        queue =
          Math.random() < 0.5
            ? TRICKS.tilt(ctx, now)
            : [
                [now, () => rig.wag(1)],
                [now + 2.2, () => rig.wag(0.6)],
              ];
      }
      if (bubble.dataset.show === 'true' && now > bubbleUntil) {
        bubble.dataset.show = 'false';
      }
      rig.tick(dt, now);
      rafId = requestAnimationFrame(tick);
    };

    let running = false;
    const setRunning = (on: boolean) => {
      if (asStop && document.documentElement.dataset.pup) on = false;
      if (on !== running) {
        running = on;
        if (on) {
          lastTick = performance.now() / 1000;
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
        }
      }
    };

    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    io.observe(host);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        gaze = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 };
      }
    };
    const onClick = () => {
      const now = performance.now() / 1000;
      combo = now - lastClick < 0.7 ? combo + 1 : 1;
      lastClick = now;
      const pool = pose === 'peek' ? PEEK_TRICKS : pose === 'snug' ? SNUG_TRICKS : null;
      const candidates = pool?.filter((t) => t !== lastTrick) ?? [];
      const chosen = pool ? candidates[Math.floor(Math.random() * candidates.length)] : nextTrick(lastTrick, combo);
      lastTrick = chosen;
      rig.reset();
      queue = TRICKS[chosen](ctx, now);
      playingUntil = queue[queue.length - 1][0] + 0.4;
      lastIdle = now;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        rig.petting(true);
        rig.wag(1);
      }
    };
    const onLeave = () => {
      rig.petting(false);
      rig.wag(0.6);
    };

    addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('click', onClick);
    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      setRunning(false);
      host.removeAttribute('data-playing');
      io.disconnect();
      removeEventListener('pointermove', onMove);
      host.removeEventListener('click', onClick);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, pose, facing, act, asStop]);

  return (
    <div
      ref={wrapRef}
      className={`pup-buddy ${className}`}
      style={style}
      data-live={reduced ? undefined : ''}
      data-facing={facing}
    >
      <PupSvg key={String(reduced)} pose={pose} facing={facing} label={label} />
      <span ref={bubbleRef} aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  );
}

export function PupStop({
  pose = 'sit',
  facing = 'right',
  act,
  behind = false,
  lane = false,
  className = '',
  style,
  label,
}: {
  pose?: PoseName;
  facing?: 'left' | 'right';
  act?: string;
  behind?: boolean;
  lane?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  return (
    <div
      data-pup-stop="true"
      data-pose={pose}
      data-facing={facing}
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
      style={style}
    >
      <PupBuddy pose={pose} facing={facing} label={label} asStop />
    </div>
  );
}

export function cuePup(detail: { look?: Element; secs?: number; say?: string }) {
  dispatchEvent(new CustomEvent('pup:cue', { detail }));
}

// PupJourney scroll-interpolated companion across Home landmarks
const ANCHOR = { x: 150, y: 228 };
const DEFAULT_BOX: [number, number, number, number] = [48, 30, 288, 236];
const POSE_BOXES: Partial<Record<string, [number, number, number, number]>> = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
};
const boxOf = (pose: string) => POSE_BOXES[pose] ?? DEFAULT_BOX;
const SINK_PEEK = ANCHOR.y - 159;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (v: number) => v * v * (3 - 2 * v);
const ramp = (a: number, b: number, v: number) => (b === a ? Number(v >= b) : smoothstep(clamp01((v - a) / (b - a))));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smin = (a: number, b: number, k: number) => {
  const s = (a - b) / k;
  return s > 20 ? a : b + k * Math.log1p(Math.exp(s));
};
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
const blendBox = (a: number[], b: number[], t: number): [number, number, number, number] => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
  mix(a[3], b[3], t),
];
const bezier = (
  p0: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  p1: { x: number; y: number },
  t: number,
) => {
  const u = 1 - t;
  const u3 = u * u * u;
  const u2t = 3 * u * u * t;
  const ut2 = 3 * u * t * t;
  const t3 = t * t * t;
  return {
    x: u3 * p0.x + u2t * c1.x + ut2 * c2.x + t3 * p1.x,
    y: u3 * p0.y + u2t * c1.y + ut2 * c2.y + t3 * p1.y,
  };
};

interface TrackInfo {
  kind: 'page' | 'pin' | 'screen';
  top: number;
  from?: number;
  to?: number;
}
interface StopLayout {
  x: number;
  track: TrackInfo;
  s: number;
  behind: boolean;
  sink: number;
  box: [number, number, number, number];
}
interface StopMeta {
  scene: HTMLElement | null;
  pose: PoseName;
  facing: number;
  act: string;
  looks: HTMLElement[];
  track: HTMLElement | null;
}

const DESKTOP_BAND: [number, number] = [0.42, 0.78];
const LANE_BAND: [number, number] = [0.6, 0.86];
const AIR_TRICKS = ['jump', 'woof', 'love', 'sneeze'] as const;

function clampSafe(
  x: number,
  y: number,
  s: number,
  box: [number, number, number, number],
  safe: { left: number; top: number; right: number; bottom: number },
  k = 8,
) {
  const padL = (ANCHOR.x - box[0]) * s;
  const padR = (box[2] - ANCHOR.x) * s;
  const padT = (ANCHOR.y - box[1]) * s;
  const padB = (box[3] - ANCHOR.y) * s;
  const cx =
    safe.right - safe.left > padL + padR
      ? smax(smin(x, safe.left + padL, k), safe.right - padR, k)
      : (safe.left + safe.right) / 2 - (padR - padL) / 2;
  const cy =
    safe.bottom - safe.top > padT + padB
      ? smax(smin(y, safe.top + padT, k), safe.bottom - padB, k)
      : safe.bottom - padB;
  return { x: cx, y: cy };
}

function measureStops(probe: HTMLElement | null) {
  const lane = matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches;
  const docW = document.documentElement.clientWidth;
  const viewH = probe?.getBoundingClientRect().height || innerHeight;
  const headerH = document.getElementById('site-header')?.offsetHeight ?? 76;
  const bar = document.querySelector('[data-whatsapp-bar]');
  const safe = {
    left: 10,
    top: headerH + 10,
    right: docW - 10,
    bottom: viewH - 10 - (bar?.getClientRects().length ? bar.getBoundingClientRect().height : 0),
  };
  const mainEl = document.getElementById('main');
  const stops: StopLayout[] = [];
  const meta: StopMeta[] = [];
  const holds: [number, number][] = [];

  const getTrack = (el: HTMLElement, rect: DOMRect): TrackInfo => {
    let stickyEl: HTMLElement | null = null;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).position === 'sticky') {
        stickyEl = p;
        break;
      }
    }
    if (!stickyEl) return { kind: 'page', top: rect.top + scrollY };
    const topPx = parseFloat(getComputedStyle(stickyEl).top) || 0;
    const offset = rect.top - stickyEl.getBoundingClientRect().top;
    const prevPos = stickyEl.style.position;
    stickyEl.style.position = 'relative';
    const r = stickyEl.getBoundingClientRect();
    const par = stickyEl.parentElement!;
    const parBot = par.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(par).paddingBottom) || 0);
    stickyEl.style.position = prevPos;
    const from = r.top + scrollY - topPx;
    const to = parBot + scrollY - r.height - topPx;
    return to <= from ? { kind: 'page', top: r.top + scrollY + offset } : { kind: 'pin', top: topPx + offset, from, to };
  };

  const addStop = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const pose = (el.dataset.pose || 'sit') as PoseName;
    const act = el.dataset.act ?? '';
    const baseS = rect.width / 300;
    const s = act === 'basket' || lane ? baseS : 1.12 * baseS;
    const piv = pose === 'peek' ? { x: ANCHOR.x, y: 159 } : ANCHOR;
    const track = getTrack(el, rect);
    if (track.kind !== 'screen') track.top += piv.y * (baseS - s);

    const stop: StopLayout = {
      x: rect.left + piv.x * (baseS - s),
      track,
      s,
      behind: el.dataset.behind === 'true',
      sink: 0,
      box: boxOf(pose),
    };
    const scene = el.closest('[data-pup-scene]') as HTMLElement | null;
    stops.push(stop);
    meta.push({
      scene,
      pose,
      facing: el.dataset.facing === 'left' ? -1 : 1,
      act,
      looks: scene ? ([...scene.querySelectorAll('[data-pup-look]')] as HTMLElement[]) : [],
      track: act === 'treadmill' ? (scene?.querySelector('[data-treadmill]') as HTMLElement | null) ?? null : null,
    });

    const band = lane ? LANE_BAND : DESKTOP_BAND;
    let hold: [number, number];
    if (stop.track.kind === 'pin') {
      hold = [stop.track.from!, stop.track.to!];
    } else {
      const top = stop.track.top;
      const boxTop = top + stop.box[1] * stop.s;
      const boxBot = top + stop.box[3] * stop.s;
      const mid = (boxTop + boxBot) / 2;
      const sh = safe.bottom - safe.top;
      let lo = Math.max(mid - (safe.top + band[1] * sh), boxBot - safe.bottom);
      let hi = Math.min(mid - (safe.top + band[0] * sh), boxTop - safe.top);
      if (lo > hi) lo = hi = mid - (safe.top + sh / 2);
      hold = [lo, hi];
    }
    if (!lane && scene && stop.track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
      const sh = safe.bottom - safe.top;
      const sceneTop = scene.getBoundingClientRect().top + scrollY - safe.top + 0.08 * sh;
      const botFloor = stop.track.top + stop.box[3] * stop.s - safe.bottom;
      if (hold[1] > sceneTop) {
        const hi2 = Math.max(sceneTop, botFloor + 0.12 * sh);
        hold = [Math.max(botFloor, hi2 - Math.max(hold[1] - hold[0], 0.2 * sh)), hi2];
      }
    }
    holds.push(hold);
  };

  const domStops = ([...document.querySelectorAll('[data-pup-stop]')] as HTMLElement[]).filter(
    (el) => el.getClientRects().length,
  );
  if (lane) {
    const laneStops = domStops.filter((el) => el.dataset.lane === 'true');
    const first = laneStops[0];
    const last = laneStops.length > 1 ? laneStops[laneStops.length - 1] : undefined;
    if (first) addStop(first);
    const firstScene = meta[0]?.scene ?? null;
    const scenes = ([...document.querySelectorAll('#main [data-pup-scene]')] as HTMLElement[]).filter(
      (el) => el !== firstScene && el.getClientRects().length,
    );
    const laneS = Math.min(0.62, Math.max(0.5, docW / 650));
    const peekBox = boxOf('peek');
    scenes.forEach((sc, idx) => {
      const leftSide = idx % 2 === 0;
      const px = leftSide ? safe.left + 2 - peekBox[0] * laneS : safe.right - 2 - peekBox[2] * laneS;
      stops.push({
        x: px,
        track: { kind: 'screen', top: 0 },
        s: laneS,
        behind: false,
        sink: SINK_PEEK,
        box: peekBox,
      });
      meta.push({
        scene: sc,
        pose: 'peek',
        facing: leftSide ? 1 : -1,
        act: 'lane',
        looks: [],
        track: null,
      });
      const r = sc.getBoundingClientRect();
      const lo = r.top + scrollY - 0.42 * viewH;
      const hi = r.bottom + scrollY - 0.58 * viewH;
      holds.push(lo <= hi ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2]);
    });
    if (last) addStop(last);
  } else {
    domStops.forEach(addStop);
  }

  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const gaps = stops.slice(1).map((next, idx) => {
    const prev = stops[idx];
    const bandSpan = (DESKTOP_BAND[1] - DESKTOP_BAND[0]) * viewH;
    const minGap = (lane ? 0.32 : 0.5) * viewH;
    const dx = Math.abs(next.x + ANCHOR.x * next.s - (prev.x + ANCHOR.x * prev.s));
    return Math.min(1.4 * viewH, Math.max(minGap, 1.15 * Math.hypot(dx, bandSpan)));
  });

  const resolvedHolds: [number, number][] = holds.map((h) =>
    h[0] <= h[1] ? [h[0], h[1]] : [(h[0] + h[1]) / 2, (h[0] + h[1]) / 2],
  );
  if (resolvedHolds.length) {
    resolvedHolds[0][0] = -Infinity;
    const tail = resolvedHolds[resolvedHolds.length - 1];
    tail[1] = Infinity;
    tail[0] = Math.min(tail[0], maxScroll - 1);
    for (let i = 0; i < resolvedHolds.length - 1; i++) {
      const a = resolvedHolds[i];
      const b = resolvedHolds[i + 1];
      if (b[0] < a[1]) {
        const mid = (a[1] + b[0]) / 2;
        a[1] = Math.max(a[0], mid);
        b[0] = Math.min(b[1], mid);
        if (b[0] < a[1]) b[0] = a[1];
      }
      let need = (gaps[i] ?? 0) - (b[0] - a[1]);
      if (need > 0) {
        const trimA = Math.min(need / 2, a[1] - a[0]);
        const trimB = Math.min(need / 2, b[1] - b[0]);
        a[1] -= trimA;
        b[0] += trimB;
        need -= trimA + trimB;
        const extraB = Math.min(need, b[1] - b[0]);
        b[0] += extraB;
        need -= extraB;
        if (need > 0) a[1] -= Math.min(need, a[1] - a[0]);
      }
    }
    for (const h of resolvedHolds) {
      if (h[1] < h[0]) h[1] = h[0];
    }
  }

  return {
    lane,
    stops,
    meta,
    holds: resolvedHolds,
    blend: 0.12 * viewH,
    mainTop: mainEl ? mainEl.getBoundingClientRect().top + scrollY : 0,
  };
}

let activeJourneyCleanup: (() => void) | null = null;

export function PupJourney() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const actorRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);
  const bubbleAtRef = useRef<HTMLSpanElement | null>(null);
  const printsRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeJourneyCleanup?.();
    const layer = layerRef.current;
    const actor = actorRef.current;
    const body = bodyRef.current;
    const bubble = bubbleRef.current;
    const bubbleAt = bubbleAtRef.current;
    const prints = printsRef.current;
    const probe = probeRef.current;
    const svg = body?.querySelector('svg');
    if (!layer || !actor || !body || !bubble || !bubbleAt || !prints || !probe || !svg) return;

    const rootEl = document.documentElement;
    let layout: ReturnType<typeof measureStops> | null = null;
    let rig: PupRig | null = null;
    let running = false;
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const printEls = [...prints.children] as SVGSVGElement[];
    let printIdx = 0;
    let bubbleUntil = 0;

    const say = (msg: string, dur = 1.4) => {
      bubble.textContent = msg;
      bubble.dataset.show = 'true';
      bubbleUntil = performance.now() / 1000 + dur;
    };

    let mouseGaze: { x: number; y: number; t: number } | null = null;
    let cueLook: { el: Element; until: number } | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        mouseGaze = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 };
      }
    };
    const onCue = (e: Event) => {
      const detail = (e as CustomEvent<{ look?: Element; secs?: number; say?: string }>).detail;
      const curScene = holdStop >= 0 ? layout?.meta[holdStop]?.scene : null;
      if (!curScene || (detail.look && !curScene.contains(detail.look))) return;
      const now = performance.now() / 1000;
      if (detail.look) cueLook = { el: detail.look, until: now + (detail.secs ?? 1.6) };
      if (detail.say) say(detail.say, 1.4);
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.matches('a, button, input, textarea, select, summary')) {
        cueLook = { el: target, until: performance.now() / 1000 + 1.4 };
      }
    };

    let lastTime = performance.now() / 1000;
    let lastScroll = scrollY;
    let prevPos: { x: number; y: number } | null = null;
    let curState: { x: number; y: number; s: number; k: number } | null = null;
    const smoothOff = { x: 0, y: 0, s: 0 };
    let stillTime = 0;
    let holdStop = -1;
    let stopEntered = 0;
    let lastIdle = 0;
    let queue: TrickStep[] = [];
    let lastLookT = 0;
    let lookIdx = -1;
    let lastTrackLeft: number | null = null;
    let trackIdle = 0;
    let lastPrintStop = -1;
    let lastStepCount = 0;
    let nextBasketAction = 0;
    let lastScrollAt = performance.now() / 1000;
    let scrollDir = 1;
    let wasScreen = false;
    let smoothScreen: { x: number; y: number } | null = null;
    let smoothScreenY = 0;
    let walkedAcc = 0;
    let anchorOffset = 0;

    const getBarTop = () => {
      const bar = document.querySelector('[data-whatsapp-bar]');
      const rect = bar?.getClientRects().length ? bar.getBoundingClientRect() : null;
      return rect && rect.height ? rect.top : innerHeight - 6;
    };

    const headerEl = document.getElementById('site-header');

    const findHoldSegment = (holds: [number, number][], y: number) => {
      if (!holds.length || y <= holds[0][1]) return { k: 0, t: 0 };
      for (let i = 0; i < holds.length - 1; i++) {
        const end = holds[i][1];
        const nextStart = holds[i + 1][0];
        if (y < nextStart) return { k: i, t: clamp01((y - end) / Math.max(1, nextStart - end)) };
        if (y <= holds[i + 1][1]) return { k: i + 1, t: 0 };
      }
      return { k: holds.length - 1, t: 0 };
    };

    const trackScreenAnchor = (stop: StopLayout, sy: number) => {
      const tr = stop.track;
      const y =
        tr.kind === 'page'
          ? tr.top - sy
          : tr.kind === 'screen'
            ? tr.top
            : sy < tr.from!
              ? tr.top - (sy - tr.from!)
              : sy > tr.to!
                ? tr.top - (sy - tr.to!)
                : tr.top;
      return { x: stop.x + ANCHOR.x * stop.s, y: y + ANCHOR.y * stop.s };
    };

    const evalJourney = (lay: NonNullable<typeof layout>, sy: number) => {
      if (lay.lane) {
        const barTop = getBarTop();
        for (const st of lay.stops) {
          if (st.track.kind === 'screen') st.track.top = barTop - 159 * st.s;
        }
      }
      const docW = rootEl.clientWidth;
      const topSafe = (headerEl?.offsetHeight ?? 76) + 10;
      const safe = lay.lane
        ? { left: 10, top: topSafe, right: docW - 10, bottom: getBarTop() + 40 }
        : {
            left: 10,
            top: topSafe,
            right: docW - 10,
            bottom: Math.min(
              innerHeight,
              (() => {
                const b = document.querySelector('[data-whatsapp-bar]');
                return b?.getClientRects().length ? b.getBoundingClientRect().top : innerHeight;
              })(),
            ) - 10,
          };

      const seg = findHoldSegment(lay.holds, sy);
      if (seg.t <= 0 || seg.k >= lay.stops.length - 1) {
        const st = lay.stops[seg.k];
        const pt = trackScreenAnchor(st, sy);
        const cl = clampSafe(pt.x, pt.y, st.s, st.box, safe);
        return {
          x: cl.x,
          y: cl.y,
          s: st.s,
          front: !st.behind,
          airborne: false,
          k: seg.k,
          t: 0,
          walked: 0,
        };
      }

      const stA = lay.stops[seg.k];
      const stB = lay.stops[seg.k + 1];
      const tStart = lay.holds[seg.k][1];
      const tEnd = lay.holds[seg.k + 1][0];
      const span = Math.max(1, tEnd - tStart);
      const frac = clamp01((sy - tStart) / span);
      const a0 = trackScreenAnchor(stA, tStart);
      const b0 = trackScreenAnchor(stB, tEnd);

      const p0 = { x: a0.x, y: a0.y - stA.sink * stA.s };
      const p1 = { x: b0.x, y: b0.y - stB.sink * stB.s };
      const dx = p1.x - p0.x;
      const safeW = safe.right - safe.left;
      const reach = Math.max(0.45 * Math.abs(dx), 0);
      const dir = dx >= 0 ? 1 : -1;
      let c1 = { x: p0.x + dir * reach, y: p0.y };
      let c2 = { x: p1.x - dir * reach, y: p1.y };
      const minW = 0.14 * safeW;
      if (Math.abs(dx) < minW) {
        const push = ((p0.x + p1.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) * (minW - Math.abs(dx)) * 0.9;
        c1 = { x: c1.x + push, y: mix(p0.y, p1.y, 0.2) };
        c2 = { x: c2.x + push, y: mix(p0.y, p1.y, 0.8) };
      }
      const boxClamp = (pt: { x: number; y: number }) => ({
        x: Math.min(safe.right, Math.max(safe.left, pt.x)),
        y: Math.min(safe.bottom, Math.max(safe.top, pt.y)),
      });
      const cc1 = boxClamp(c1);
      const cc2 = boxClamp(c2);

      const quint = frac * frac * frac * (frac * (6 * frac - 15) + 10);
      const pos = bezier(p0, cc1, cc2, p1, quint);
      const s = mix(stA.s, stB.s, smoothstep(clamp01(frac / 0.65)));
      const blendFrac = Math.min(0.3, Math.max(0.06, lay.blend / span));
      const fA = 1 - ramp(0, blendFrac, frac);
      const fB = ramp(1 - blendFrac, 1, frac);
      let y = pos.y + fA * (trackScreenAnchor(stA, sy).y - a0.y) + fB * (trackScreenAnchor(stB, sy).y - b0.y);
      y += stA.sink * stA.s * (1 - ramp(0, 0.22, frac)) + stB.sink * stB.s * ramp(0.78, 1, frac);

      let airborne = false;
      if (stA.behind && frac < 0.36) {
        y -= Math.sin((frac / 0.36) * Math.PI) * Math.min(64 * stA.s, 72);
        airborne = frac < 0.32;
      }
      if (stB.behind && frac > 0.68) {
        y -= Math.sin(((frac - 0.68) / 0.32) * Math.PI) * Math.min(56 * stB.s, 60);
        airborne = true;
      }
      if (stA.sink && frac < 0.2) airborne = true;
      const front = !(stA.behind && frac < 0.12) && !(stB.behind && frac > 0.92);

      const curBox =
        frac < 0.5
          ? blendBox(stA.box, DEFAULT_BOX, ramp(0, stA.sink ? 0.22 : stA.behind ? 0.36 : 0.06, frac))
          : blendBox(DEFAULT_BOX, stB.box, ramp(stB.sink ? 0.78 : stB.behind ? 0.68 : 0.94, 1, frac));
      const cl = clampSafe(pos.x, y, s, curBox, safe);

      let walked = 0;
      let prevB = p0;
      const steps = Math.max(1, Math.ceil(32 * clamp01(quint)));
      for (let i = 1; i <= steps; i++) {
        const np = bezier(p0, cc1, cc2, p1, (i / steps) * clamp01(quint));
        walked += Math.hypot(np.x - prevB.x, np.y - prevB.y);
        prevB = np;
      }

      return {
        x: cl.x,
        y: cl.y,
        s,
        front,
        airborne,
        k: seg.k,
        t: frac,
        walked,
      };
    };

    const setData = (el: HTMLElement, key: string, val: string) => {
      if (el.dataset[key] !== val) el.dataset[key] = val;
    };

    const makeCtx = (m: StopMeta): TrickContext => ({
      d: rig!,
      rest: POSES[m.pose],
      facing: m.facing,
      say: (msg, dur) => say(msg, dur),
      hearts: () => {
        if (!curState) return;
        const hx = curState.x - ANCHOR.x * curState.s + (rig!.facingDir > 0 ? 212 : PUP_W - 212) * curState.s;
        const hy = curState.y - (ANCHOR.y - 40) * curState.s - anchorOffset;
        spawnHearts(layer, hx, hy);
      },
    });

    const frame = () => {
      if (!layout || !rig) return;
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;
      const sy = scrollY;
      const dsy = sy - lastScroll;
      lastScroll = sy;
      if (Math.abs(dsy) > 0.5) {
        lastScrollAt = now;
        scrollDir = dsy > 0 ? 1 : -1;
      }

      while (queue.length && queue[0][0] <= now) {
        queue.shift()![1](now);
      }

      let targetSy = sy;
      if (now - lastScrollAt > 0.25) {
        const seg = findHoldSegment(layout.holds, sy);
        if (seg.t > 0 && seg.k < layout.stops.length - 1) {
          const stA = layout.stops[seg.k];
          const stB = layout.stops[seg.k + 1];
          const midA = stA.sink ? 0.22 : stA.behind ? 0.36 : 0;
          const midB = stB.sink ? 0.78 : stB.behind ? 0.68 : 1;
          let snapFrac = seg.t;
          if (seg.t < midA) snapFrac = seg.t < midA / 2 ? 0 : midA;
          else if (seg.t > midB) snapFrac = seg.t > (1 + midB) / 2 ? 1 : midB;
          if (snapFrac !== seg.t) {
            targetSy = layout.holds[seg.k][1] + snapFrac * (layout.holds[seg.k + 1][0] - layout.holds[seg.k][1]);
          }
        }
      }

      const ev = evalJourney(layout, targetSy);
      const onScreen =
        layout.lane &&
        (() => {
          const sA = layout.stops[ev.k];
          const sB = ev.t > 0 ? layout.stops[ev.k + 1] : sA;
          return sA.track.kind === 'screen' || sB?.track.kind === 'screen';
        })();

      const dampOff = Math.exp(-dt / 0.28);
      smoothOff.x *= dampOff;
      smoothOff.y *= dampOff;
      smoothOff.s *= dampOff;
      if (Math.abs(smoothOff.x) < 0.05 && Math.abs(smoothOff.y) < 0.05) {
        smoothOff.x = smoothOff.y = 0;
      }

      if (onScreen !== wasScreen && prevPos && !onScreen) {
        smoothOff.x = prevPos.x - ev.x;
        smoothOff.y = prevPos.y - ev.y;
      }
      wasScreen = Boolean(onScreen);

      const s = ev.s + smoothOff.s;
      let px = ev.x + smoothOff.x;
      let py = ev.y + smoothOff.y;
      const barY = layout.lane ? getBarTop() : 0;
      let settled = true;
      if (onScreen) {
        if (!smoothScreen) {
          smoothScreen = prevPos ? { x: prevPos.x, y: prevPos.y - smoothScreenY } : { x: px, y: py - barY };
        }
        const gain = 1 - Math.exp(-dt / 0.14);
        smoothScreen.x += (px - smoothScreen.x) * gain;
        smoothScreen.y += (py - barY - smoothScreen.y) * gain;
        settled = Math.hypot(px - smoothScreen.x, py - barY - smoothScreen.y) < 1.5;
        px = smoothScreen.x;
        py = barY + smoothScreen.y;
      } else if (smoothScreen) {
        smoothOff.x = (prevPos?.x ?? px) - ev.x;
        smoothOff.y = (prevPos?.y ?? py) - ev.y;
        px = ev.x + smoothOff.x;
        py = ev.y + smoothOff.y;
        smoothScreen = null;
      }
      smoothScreenY = barY;
      curState = { ...ev, x: px, y: py, s };
      setData(layer, 'anchor', onScreen ? 'bottom' : 'top');
      anchorOffset = onScreen ? layer.getBoundingClientRect().top : 0;

      const atStop = ev.t === 0 && settled;
      const stopIdx = ev.k;
      if (atStop) {
        if (holdStop !== stopIdx) {
          const m = layout.meta[stopIdx];
          queue = [];
          cueLook = null;
          holdStop = stopIdx;
          stopEntered = now;
          lastIdle = now;
          lastTrackLeft = null;
          rig.reset();
          rig.setPose(m.pose);
          rig.face(m.facing, 0.14);
          rig.stride(0);
          rig.wag(m.act === 'basket' ? 0.3 : 0.7);
          rig.jolt(0.4);
          nextBasketAction = now + 2.4;
        }
        const m = layout.meta[stopIdx];
        if (m.track && !queue.length) {
          const left = m.track.getBoundingClientRect().left;
          const delta = lastTrackLeft === null ? 0 : left - lastTrackLeft;
          lastTrackLeft = left;
          rig.walkedTo(-left / s);
          if (Math.abs(delta) > 0.15) {
            trackIdle = 0;
            rig.setPose('walk');
            rig.stride(1);
            rig.face(delta < 0 ? 1 : -1, 0.16);
          } else if ((trackIdle += dt) > 0.25) {
            rig.setPose('stand');
            rig.stride(0);
          }
        }
        if (m.act === 'tilt' && !queue.length && now - stopEntered > 1.2) {
          rig.cock(Math.sin(0.9 * now) > 0.35 ? 13 : Math.sin(0.9 * now) < -0.35 ? -10 : 0);
        }
        if (m.act === 'basket' && !queue.length && now > nextBasketAction) {
          nextBasketAction = now + 4.5 + 3 * Math.random();
          if (Math.random() < 0.7) rig.jolt(0.55);
          else rig.yawn(now, 0.7);
        }
        const busyLook = Boolean((cueLook && cueLook.until > now) || (mouseGaze && now - mouseGaze.t < 2.5));
        if (m.looks.length && !busyLook && now - stopEntered > 0.8 && now - lastLookT > 1.7) {
          lastLookT = now;
          lookIdx = (lookIdx + 1) % (m.looks.length + 1);
          if (lookIdx < m.looks.length) {
            cueLook = { el: m.looks[lookIdx], until: now + 1.4 };
          }
        }
        if (Math.abs(dsy) > 0.5) lastIdle = now;
        if (!queue.length && !m.track && m.act !== 'basket' && now - lastIdle > 9) {
          lastIdle = now;
          queue =
            Math.random() < 0.55
              ? TRICKS.tilt(makeCtx(m), now)
              : [
                  [now, () => rig!.wag(1)],
                  [now + 2.4, () => rig!.wag(0.7)],
                ];
        }
      } else {
        if (holdStop !== -1) {
          holdStop = -1;
          queue = [];
          rig?.reset();
        }
        const dist = prevPos ? Math.hypot(px - prevPos.x, py - prevPos.y) : 0;
        stillTime = dist > 0.25 ? 0 : stillTime + dt;
        let air = ev.airborne;
        if (layout.lane && ev.t > 0) {
          const sA = layout.stops[stopIdx];
          const sB = layout.stops[stopIdx + 1];
          if (sA.sink && ev.t < 0.22) air = scrollDir > 0;
          else if (sB?.sink && ev.t > 0.78) air = scrollDir < 0;
        }
        if (air) {
          rig.setPose('hop');
          rig.stride(0);
        } else if (stillTime > 0.3) {
          rig.setPose('stand');
          rig.stride(0);
          if (stillTime > 2.6 && stillTime - dt <= 2.6) say('coming?', now);
        } else {
          rig.setPose('walk');
          rig.stride(1);
        }
        rig.walkedTo((onScreen ? (walkedAcc += dist) : ev.walked) / Math.max(0.05, s));
        if (prevPos) {
          const dx = px - prevPos.x;
          if (Math.abs(dx) > 0.6 && Math.abs(dx) > 0.35 * Math.abs(py - prevPos.y)) {
            rig.face(dx > 0 ? 1 : -1, 0.16);
          }
        }
        if (!layout.lane) {
          const stepIdx = Math.floor(ev.walked / (34 * s));
          if (lastPrintStop === stopIdx && stepIdx !== lastStepCount && !ev.airborne && prevPos) {
            const odd = stepIdx & 1;
            const lx = odd ? 186 : 110;
            const baseLeft = px - ANCHOR.x * s;
            const baseTop = py - ANCHOR.y * s;
            const printX = baseLeft + (rig.facingDir > 0 ? lx : PUP_W - lx) * s;
            const printY = baseTop + 226 * s + sy - layout.mainTop + (odd ? -4 : 4) * s;
            const angle = Math.atan2(py - prevPos.y + dsy, px - prevPos.x) + Math.PI / 2;
            const sz = 14 * Math.max(0.75, 1.5 * s);
            const pEl = printEls[printIdx++ % printEls.length];
            pEl.style.transform = `translate(${(printX - sz / 2).toFixed(1)}px, ${(printY - sz / 2).toFixed(1)}px) rotate(${angle.toFixed(3)}rad)`;
            pEl.style.width = pEl.style.height = `${sz.toFixed(1)}px`;
            pEl.animate(
              [
                { opacity: 0 },
                { opacity: 0.45, offset: 0.08 },
                { opacity: 0.45, offset: 0.5 },
                { opacity: 0 },
              ],
              { duration: 2600, easing: 'ease-out' },
            );
          }
          lastPrintStop = stopIdx;
          lastStepCount = stepIdx;
        }
      }

      prevPos = { x: px, y: py };
      layout.meta.forEach((m, idx) => {
        if (m.scene) {
          setData(m.scene, 'here', String(atStop && idx === stopIdx));
          setData(m.scene, 'visited', String(idx <= stopIdx || (idx === stopIdx + 1 && ev.t > 0.92)));
        }
      });

      if (cueLook && cueLook.until > now) {
        const r = cueLook.el.getBoundingClientRect();
        rig.lookAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      } else if (mouseGaze && now - mouseGaze.t < 2.5) {
        rig.lookAt(mouseGaze);
      } else {
        rig.lookAt(null);
      }

      actor.style.transform = `translate3d(${(px - ANCHOR.x * s).toFixed(2)}px, ${(py - ANCHOR.y * s - anchorOffset).toFixed(2)}px, 0)`;
      body.style.transform = `scale(${s.toFixed(4)})`;
      setData(layer, 'front', String(ev.front));
      setData(actor, 'holding', String(atStop));
      if (bubble.dataset.show === 'true') {
        if (now > bubbleUntil) bubble.dataset.show = 'false';
        const bx = (rig.facingDir > 0 ? 214 : PUP_W - 214) * s;
        bubbleAt.style.transform = `translate(${bx.toFixed(1)}px, ${(30 * s).toFixed(1)}px)`;
      }

      rig.tick(dt, now);
      rafId = requestAnimationFrame(frame);
    };

    let clickCombo = 0;
    let lastClickT = 0;
    let lastJourneyTrick: string | null = null;
    const pick = <T extends string>(arr: readonly T[], exclude: string | null): T => {
      const candidates = arr.filter((x) => x !== exclude);
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const onActorClick = () => {
      if (!rig || !layout) return;
      const now = performance.now() / 1000;
      clickCombo = now - lastClickT < 0.7 ? clickCombo + 1 : 1;
      lastClickT = now;
      lastIdle = now;

      if (holdStop < 0) {
        const m = layout.meta[Math.max(0, curState?.k ?? 0)];
        const trick = pick(AIR_TRICKS, lastJourneyTrick);
        lastJourneyTrick = trick;
        const c = makeCtx(m);
        if (trick === 'jump') {
          queue = [
            [now, () => { rig!.hop(1.35); c.say(pick(['wheee!', 'boing!', 'yip!'], null)); }],
            [now + 0.5, () => rig!.hop(0.7)],
          ];
        } else if (trick === 'woof') {
          queue = [
            [now, (n) => { rig!.woof(n); c.say('woof!'); }],
            [now + 0.4, (n) => rig!.woof(n)],
          ];
        } else if (trick === 'love') {
          queue = [
            [now, () => { rig!.wag(1); rig!.hop(0.5); c.hearts(); c.say('I like you!'); }],
          ];
        } else {
          queue = [
            [now, (n) => { rig!.jolt(1.4); rig!.hop(0.4); rig!.yawn(n, 0.22); c.say('achoo!'); }],
          ];
        }
        return;
      }

      const m = layout.meta[holdStop];
      let chosen: TrickName;
      if (m.track) chosen = pick(['woof', 'hop', 'love'], lastJourneyTrick);
      else if (m.act === 'basket') chosen = pick(['tilt', 'love', 'sneeze', 'woof'], lastJourneyTrick);
      else if (m.pose === 'peek') chosen = pick(['peekaboo', 'woof', 'tilt', 'sneeze'], lastJourneyTrick);
      else {
        chosen = nextTrick(lastJourneyTrick as TrickName | null, clickCombo);
        if (chosen === 'zoomies') chosen = 'spin';
      }
      if (chosen === 'peekaboo' && queue.length) return;
      lastJourneyTrick = chosen;
      rig.reset();
      queue = TRICKS[chosen](makeCtx(m), now);
    };

    const onActorEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && rig && holdStop >= 0) {
        rig.petting(true);
        rig.wag(1);
      }
    };
    const onActorLeave = () => {
      if (rig) {
        rig.petting(false);
        if (holdStop >= 0) rig.wag(layout?.meta[holdStop]?.act === 'basket' ? 0.3 : 0.7);
      }
    };

    const startJourney = () => {
      if (running || prefersReducedMotion()) return;
      const measured = measureStops(probe);
      if (measured.stops.length < 2) return;
      layout = measured;
      running = true;
      rootEl.dataset.pup = measured.lane ? 'lane' : 'live';
      layer.hidden = false;
      const firstMeta = measured.meta[0];
      rig = new PupRig(svg, firstMeta.pose, firstMeta.facing);
      lastScroll = scrollY;
      prevPos = null;
      lastScrollAt = lastTime = performance.now() / 1000;
      wasScreen = false;
      smoothScreen = null;

      const initEval = evalJourney(measured, scrollY);
      if (initEval.k === 0 && initEval.t === 0 && firstMeta.act === 'peekaboo') {
        holdStop = 0;
        stopEntered = lastTime;
        const hiddenPeek: PoseState = { ...POSES.peek, headY: 120 };
        const friends = firstMeta.scene?.querySelectorAll('[data-pup-friend]') ?? [];
        const firstF = friends[0];
        const lastF = friends[friends.length - 1];
        queue = [
          [lastTime + 0.1, () => rig!.setPose(hiddenPeek)],
          [lastTime + 0.7, (n) => { rig!.setPose('peek'); rig!.jolt(1.2); say('peekaboo!', n + 0.9); }],
          [lastTime + 1.5, (n) => { if (firstF) cueLook = { el: firstF, until: n + 0.8 }; }],
          [lastTime + 2.3, (n) => { if (lastF) cueLook = { el: lastF, until: n + 0.8 }; }],
          [lastTime + 3.1, () => { cueLook = null; rig!.wag(1); }],
        ];
      } else {
        holdStop = -1;
      }

      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pup:cue', onCue);
      addEventListener('focusin', onFocusIn);
      actor.addEventListener('click', onActorClick);
      actor.addEventListener('pointerenter', onActorEnter);
      actor.addEventListener('pointerleave', onActorLeave);
      rafId = requestAnimationFrame(frame);
    };

    const stopJourney = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
      delete rootEl.dataset.pup;
      layer.hidden = true;
      delete layer.dataset.anchor;
      anchorOffset = 0;
      layout?.meta.forEach((m) => {
        if (m.scene) {
          delete m.scene.dataset.here;
          delete m.scene.dataset.visited;
        }
      });
      layout = null;
      rig = null;
      holdStop = -1;
      removeEventListener('pointermove', onMove);
      removeEventListener('pup:cue', onCue);
      removeEventListener('focusin', onFocusIn);
      actor.removeEventListener('click', onActorClick);
      actor.removeEventListener('pointerenter', onActorEnter);
      actor.removeEventListener('pointerleave', onActorLeave);
    };

    const remeasure = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!running || !layout) return;
        const measured = measureStops(probe);
        if (measured.stops.length < 2) return stopJourney();
        const prev = curState;
        const laneChanged = measured.lane !== layout.lane;
        layout = measured;
        rootEl.dataset.pup = measured.lane ? 'lane' : 'live';
        if (laneChanged) holdStop = -1;
        if (prev) {
          const ev = evalJourney(measured, scrollY);
          smoothOff.x = prev.x - ev.x;
          smoothOff.y = prev.y - ev.y;
          smoothOff.s = prev.s - ev.s;
        }
      }, 120);
    };

    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    addEventListener('resize', remeasure);
    addEventListener('load', remeasure);
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => (prefersReducedMotion() ? stopJourney() : startJourney());
    mq.addEventListener('change', onMq);

    startJourney();
    document.fonts?.ready.then(remeasure);

    const cleanup = () => {
      stopJourney();
      clearTimeout(resizeTimer);
      ro.disconnect();
      removeEventListener('resize', remeasure);
      removeEventListener('load', remeasure);
      mq.removeEventListener('change', onMq);
      if (activeJourneyCleanup === cleanup) activeJourneyCleanup = null;
    };
    activeJourneyCleanup = cleanup;
    return cleanup;
  }, []);

  return (
    <>
      <div ref={probeRef} aria-hidden="true" className="pup-probe" />
      <div ref={printsRef} aria-hidden="true" className="pup-prints">
        {Array.from({ length: 24 }, (_, idx) => (
          <svg key={idx} viewBox="0 0 64 64">
            <path d={PAW_PATH} />
          </svg>
        ))}
      </div>
      <div ref={layerRef} aria-hidden="true" className="pup-layer" hidden data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body">
            <PupSvg pose="peek" />
          </div>
          <span ref={bubbleAtRef} className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false" />
          </span>
        </div>
      </div>
    </>
  );
}
