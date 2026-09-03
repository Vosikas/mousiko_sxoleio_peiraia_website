import type { ReactNode } from "react";

/**
 * Stage artwork for the intro. Everything is drawn as rim-lit silhouettes,
 * the way instruments actually read under concert lighting: dark bodies,
 * bright edges, haze between the camera and the band.
 */

/* Shared gradients — rendered once, referenced by every instrument. */
export function StageDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <defs>
        <linearGradient id="bodyShade" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#173350" />
          <stop offset="1" stopColor="#050c16" />
        </linearGradient>
        <linearGradient id="rimTeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bdfaf3" />
          <stop offset="0.45" stopColor="#35b7ae" />
          <stop offset="1" stopColor="#0e938c" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rimAmber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9bd" />
          <stop offset="0.45" stopColor="#f4b942" />
          <stop offset="1" stopColor="#f4b942" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="keyFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f3e9" />
          <stop offset="1" stopColor="#8fa8bd" />
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#35b7ae" stopOpacity="0.35" />
          <stop offset="1" stopColor="#35b7ae" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const svgProps = {
  viewBox: "0 0 400 400",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-auto",
} as const;

export function Drums() {
  return (
    <svg {...svgProps}>
      <line x1="70" y1="396" x2="70" y2="134" stroke="#0d1c2e" strokeWidth="4" />
      <line x1="336" y1="396" x2="336" y2="160" stroke="#0d1c2e" strokeWidth="4" />
      <g className="cymbal" style={{ transformOrigin: "70px 134px" }}>
        <g transform="translate(70 134) rotate(-14)">
          <ellipse rx="66" ry="10" fill="#101f33" />
          <path d="M-66 0 A66 10 0 0 1 26 -9" fill="none" stroke="url(#rimAmber)" strokeWidth="3.6" strokeLinecap="round" />
        </g>
      </g>
      <g className="cymbal cymbal-late" style={{ transformOrigin: "336px 160px" }}>
        <g transform="translate(336 160) rotate(12)">
          <ellipse rx="54" ry="9" fill="#101f33" />
          <path d="M-54 0 A54 9 0 0 1 16 -8" fill="none" stroke="url(#rimAmber)" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(238 190) rotate(-12)">
        <path d="M-44 0 L-38 44 A38 15 0 0 0 38 44 L44 0 Z" fill="url(#bodyShade)" />
        <ellipse rx="44" ry="16" fill="#0c1a2b" stroke="url(#rimTeal)" strokeWidth="3" />
      </g>
      <g className="kick" style={{ transformOrigin: "196px 308px" }}>
        <ellipse cx="196" cy="308" rx="104" ry="94" fill="url(#bodyShade)" />
        <ellipse cx="196" cy="308" rx="104" ry="94" fill="none" stroke="url(#rimTeal)" strokeWidth="4.5" />
        <ellipse cx="196" cy="308" rx="84" ry="76" fill="none" stroke="#1d3c5c" strokeWidth="2" />
        <path d="M108 256 A104 94 0 0 1 212 214" fill="none" stroke="#c6fcf5" strokeWidth="3.2" opacity="0.8" strokeLinecap="round" />
      </g>
      <g transform="translate(84 268) rotate(8)">
        <path d="M-54 0 L-48 36 A48 19 0 0 0 48 36 L54 0 Z" fill="url(#bodyShade)" />
        <ellipse rx="54" ry="20" fill="#0e1e31" stroke="url(#rimAmber)" strokeWidth="3.4" />
        <ellipse rx="54" ry="20" fill="none" stroke="#fff0cf" strokeWidth="1.3" opacity="0.55" />
      </g>
      <g className="sticks" stroke="#f7f3e9" strokeWidth="6" strokeLinecap="round" opacity="0.92" style={{ transformOrigin: "100px 254px" }}>
        <line x1="20" y1="214" x2="96" y2="256" />
        <line x1="168" y1="200" x2="102" y2="252" />
      </g>
    </svg>
  );
}

export function Bass() {
  return (
    <svg {...svgProps}>
      <g transform="translate(228 206) rotate(-18)">
        <g fill="url(#bodyShade)">
          <ellipse cx="40" cy="20" rx="66" ry="58" />
          <ellipse cx="-40" cy="-10" rx="50" ry="46" />
          <path d="M-56 -50 L-126 -40 L-112 -16 L-50 -28 Z" />
          <path d="M-44 36 L-104 30 L-98 8 L-38 12 Z" />
        </g>
        <path d="M-126 -40 L-56 -50 A50 46 0 0 1 -2 -54" fill="none" stroke="url(#rimAmber)" strokeWidth="4" strokeLinecap="round" />
        <path d="M102 42 A66 58 0 0 1 16 76" fill="none" stroke="url(#rimAmber)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M-112 -30 L-236 -42 L-236 -28 L-112 -16 Z" fill="#12283f" />
        <path d="M-112 -30 L-236 -42" stroke="url(#rimTeal)" strokeWidth="2.2" fill="none" />
        <path d="M-236 -48 L-286 -54 Q-298 -56 -298 -44 L-298 -30 Q-298 -19 -286 -21 L-236 -24 Z" fill="#0c1a2b" stroke="#22415f" strokeWidth="1.6" />
        <g fill="#ffd98a" opacity="0.9">
          <circle cx="-252" cy="-62" r="4.4" />
          <circle cx="-276" cy="-66" r="4.4" />
          <circle cx="-252" cy="-12" r="4.4" />
          <circle cx="-276" cy="-8" r="4.4" />
        </g>
        <rect x="0" y="-10" width="16" height="54" rx="4" fill="#081422" stroke="#2b5273" strokeWidth="1.4" transform="rotate(6 8 17)" />
        <rect x="60" y="6" width="19" height="46" rx="3" fill="#0a1726" stroke="#3d6d8f" strokeWidth="1.4" transform="rotate(6 70 29)" />
        <g className="strings" stroke="#ffe6ac" strokeWidth="2.1" opacity="0.78">
          <line x1="66" y1="12" x2="-282" y2="-56" />
          <line x1="69" y1="25" x2="-282" y2="-46" />
          <line x1="72" y1="38" x2="-282" y2="-36" />
          <line x1="75" y1="48" x2="-282" y2="-26" />
        </g>
      </g>
    </svg>
  );
}

export function Guitar() {
  return (
    <svg {...svgProps}>
      <g transform="translate(216 204) rotate(-20)">
        <g fill="url(#bodyShade)">
          <ellipse cx="46" cy="18" rx="72" ry="64" />
          <ellipse cx="-38" cy="-10" rx="56" ry="50" />
          <path d="M-52 -58 L-118 -46 L-104 -20 L-46 -34 Z" />
          <path d="M-46 40 L-112 34 L-104 8 L-40 14 Z" />
        </g>
        <path d="M-118 -46 L-52 -58 A56 50 0 0 1 6 -58" fill="none" stroke="url(#rimTeal)" strokeWidth="4" strokeLinecap="round" />
        <path d="M112 42 A72 64 0 0 1 22 80" fill="none" stroke="url(#rimTeal)" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 -60 A72 64 0 0 1 116 12" fill="none" stroke="#8ce8df" strokeWidth="2.2" opacity="0.5" strokeLinecap="round" />
        <path d="M-104 -34 L-198 -44 L-198 -30 L-104 -20 Z" fill="#12283f" />
        <path d="M-104 -34 L-198 -44" stroke="url(#rimAmber)" strokeWidth="2.2" fill="none" />
        <g stroke="#20405f" strokeWidth="1.2" opacity="0.8">
          <line x1="-126" y1="-36" x2="-126" y2="-22" />
          <line x1="-146" y1="-38" x2="-146" y2="-24" />
          <line x1="-166" y1="-40" x2="-166" y2="-26" />
          <line x1="-184" y1="-42" x2="-184" y2="-28" />
        </g>
        <path d="M-198 -48 L-240 -54 Q-250 -55 -250 -45 L-250 -33 Q-250 -24 -240 -25 L-198 -27 Z" fill="#0c1a2b" stroke="#20405f" strokeWidth="1.6" />
        <g fill="#7fe8e0" opacity="0.85">
          <circle cx="-212" cy="-58" r="3.2" />
          <circle cx="-226" cy="-60" r="3.2" />
          <circle cx="-240" cy="-62" r="3.2" />
          <circle cx="-212" cy="-16" r="3.2" />
          <circle cx="-226" cy="-14" r="3.2" />
          <circle cx="-240" cy="-12" r="3.2" />
        </g>
        <rect x="-14" y="-16" width="13" height="50" rx="4" fill="#081422" stroke="#2b5273" strokeWidth="1.4" transform="rotate(6 -7 9)" />
        <rect x="36" y="-6" width="13" height="54" rx="4" fill="#081422" stroke="#2b5273" strokeWidth="1.4" transform="rotate(6 42 21)" />
        <rect x="74" y="2" width="17" height="50" rx="3" fill="#0a1726" stroke="#3d6d8f" strokeWidth="1.4" transform="rotate(6 82 27)" />
        <g className="strings" stroke="#cfeee9" strokeWidth="1.1" opacity="0.8">
          <line x1="80" y1="6" x2="-236" y2="-50" />
          <line x1="82" y1="15" x2="-238" y2="-43" />
          <line x1="84" y1="24" x2="-238" y2="-36" />
          <line x1="86" y1="33" x2="-238" y2="-29" />
          <line x1="88" y1="42" x2="-238" y2="-22" />
          <line x1="90" y1="50" x2="-236" y2="-16" />
        </g>
        <circle cx="104" cy="56" r="6" fill="#0c1a2b" stroke="#3d6d8f" strokeWidth="1.4" />
        <circle cx="118" cy="38" r="6" fill="#0c1a2b" stroke="#3d6d8f" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

const WHITE_KEYS = 15;
const BLACK_PATTERN = [1, 1, 0, 1, 1, 1, 0];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Piano() {
  const [tx0, tx1, ty] = [78, 322, 236];
  const [bx0, bx1, by] = [24, 376, 322];

  return (
    <svg {...svgProps}>
      {/* music desk */}
      <path d="M104 132 L296 132 L318 202 L82 202 Z" fill="#081420" stroke="#1d3c5c" strokeWidth="1.6" />
      <path d="M104 134 L296 134" stroke="url(#rimTeal)" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
      <path d="M132 150 L268 150 M126 166 L274 166 M120 182 L280 182" stroke="#1d3c5c" strokeWidth="2" opacity="0.55" />
      {/* fallboard */}
      <path d="M18 214 L382 214 L392 240 L8 240 Z" fill="#0a1726" stroke="#1d3c5c" strokeWidth="1.6" />
      <path d="M22 216 L378 216" stroke="url(#rimTeal)" strokeWidth="3" strokeLinecap="round" />
      {/* white keys, in perspective */}
      {Array.from({ length: WHITE_KEYS }, (_, i) => {
        const tl = lerp(tx0, tx1, i / WHITE_KEYS);
        const tr = lerp(tx0, tx1, (i + 1) / WHITE_KEYS);
        const bl = lerp(bx0, bx1, i / WHITE_KEYS);
        const br = lerp(bx0, bx1, (i + 1) / WHITE_KEYS);
        return (
          <path
            key={`w${i}`}
            className={i % 4 === 1 ? "key-press" : undefined}
            style={i % 4 === 1 ? { animationDelay: `${(i % 8) * 0.117}s`, transformOrigin: `${(tl + tr) / 2}px ${ty}px` } : undefined}
            d={`M${tl.toFixed(1)} ${ty} L${tr.toFixed(1)} ${ty} L${br.toFixed(1)} ${by} L${bl.toFixed(1)} ${by} Z`}
            fill="url(#keyFace)"
            stroke="#0a1a2b"
            strokeWidth="1.6"
          />
        );
      })}
      {Array.from({ length: WHITE_KEYS - 1 }, (_, i) => {
        if (!BLACK_PATTERN[i % 7]) return null;
        const t = lerp(tx0, tx1, (i + 1) / WHITE_KEYS);
        const b = lerp(bx0, bx1, (i + 1) / WHITE_KEYS);
        const wt = ((tx1 - tx0) / WHITE_KEYS) * 0.32;
        const wb = ((bx1 - bx0) / WHITE_KEYS) * 0.32;
        const yb = ty + (by - ty) * 0.62;
        const xb = lerp(t, b, 0.62);
        return (
          <path
            key={`b${i}`}
            d={`M${(t - wt).toFixed(1)} ${ty} L${(t + wt).toFixed(1)} ${ty} L${(xb + wb * 0.62).toFixed(1)} ${yb.toFixed(1)} L${(xb - wb * 0.62).toFixed(1)} ${yb.toFixed(1)} Z`}
            fill="#050b14"
          />
        );
      })}
      {/* front board */}
      <path d="M24 322 L376 322 L384 356 Q200 372 16 356 Z" fill="#081420" stroke="#1d3c5c" strokeWidth="1.6" />
      <path d="M24 324 L376 324" stroke="#ffd98a" strokeWidth="1.6" opacity="0.4" />
    </svg>
  );
}

export function Singer() {
  return (
    <svg {...svgProps}>
      <ellipse cx="196" cy="150" rx="120" ry="120" fill="url(#halo)" />
      <g className="singer" style={{ transformOrigin: "200px 400px" }}>
        <path d="M120 400 Q124 292 176 268 L232 268 Q286 292 292 400 Z" fill="url(#bodyShade)" />
        <path d="M172 172 Q160 120 196 106 Q234 106 228 158 Q226 196 200 202 Q176 200 172 172 Z" fill="#08131f" />
        <path d="M168 150 Q166 104 200 100 Q238 100 236 140 Q228 126 208 124 Q182 124 172 148 Z" fill="#050d17" />
        <path d="M188 200 L212 200 L216 226 L184 226 Z" fill="#08131f" />
        <path d="M232 268 Q290 290 292 400" fill="none" stroke="url(#rimAmber)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M226 158 Q234 108 200 100" fill="none" stroke="url(#rimAmber)" strokeWidth="4" strokeLinecap="round" />
        <path d="M215 202 Q222 214 216 226" fill="none" stroke="#ffd98a" strokeWidth="2.4" opacity="0.7" />
        <path d="M252 302 Q288 268 262 226" fill="none" stroke="#08131f" strokeWidth="26" strokeLinecap="round" />
        <path d="M263 298 Q299 264 273 222" fill="none" stroke="url(#rimAmber)" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <g transform="translate(250 208) rotate(28)">
          <rect x="-7" y="0" width="14" height="44" rx="6" fill="#0b1726" stroke="#2b5273" strokeWidth="1.4" />
          <circle cx="0" cy="-6" r="13" fill="#122a41" stroke="url(#rimTeal)" strokeWidth="2.6" />
          <circle cx="-4" cy="-10" r="4" fill="#a9f3ec" opacity="0.7" />
        </g>
      </g>
      <line x1="112" y1="400" x2="112" y2="214" stroke="#0d1c2e" strokeWidth="5" />
      <line x1="112" y1="222" x2="150" y2="200" stroke="#0d1c2e" strokeWidth="4" />
    </svg>
  );
}

/** Player behind the instrument — reads as a body without ever being a face. */
export function PlayerBack({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={"h-full w-auto " + (flip ? "-scale-x-100" : "")}
      aria-hidden
    >
      <path d="M96 400 Q104 300 168 276 L236 276 Q300 300 308 400 Z" fill="#040a12" />
      <path d="M170 190 Q158 138 198 126 Q238 126 232 178 Q230 214 200 220 Q176 218 170 190 Z" fill="#040a12" />
      <path d="M232 178 Q240 128 200 124" fill="none" stroke="url(#rimTeal)" strokeWidth="3.4" strokeLinecap="round" opacity="0.7" />
      <path d="M236 276 Q302 300 308 400" fill="none" stroke="url(#rimTeal)" strokeWidth="3.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/** The whole band, seen from the back of the room. */
export function WideShot() {
  return (
    <div className="relative flex h-full w-full items-end justify-center gap-[2vw] px-[6vw] pb-[16vh] opacity-90">
      {[<Drums key="d" />, <Bass key="b" />, <Singer key="s" />, <Guitar key="g" />, <Piano key="p" />].map(
        (art, i) => (
          <div
            key={i}
            className="h-[26vh] max-h-[220px] shrink-0"
            style={{ opacity: i === 2 ? 1 : 0.72, transform: `translateY(${i === 2 ? -12 : 0}px)` }}
          >
            {art}
          </div>
        ),
      )}
    </div>
  );
}

export type StagePanel = {
  id: string;
  name: string;
  line: string;
  accent: "teal" | "amber";
  art: ReactNode;
  player?: "left" | "right" | null;
};

export const PANELS: StagePanel[] = [
  { id: "drums", name: "Ντραμς", line: "Κρατούν τον χρόνο για όλους", accent: "teal", art: <Drums />, player: "left" },
  { id: "bass", name: "Μπάσο", line: "Δένει τον ρυθμό με την αρμονία", accent: "amber", art: <Bass />, player: "right" },
  { id: "guitar", name: "Κιθάρα", line: "Το ρίφι μπαίνει τώρα", accent: "teal", art: <Guitar />, player: "right" },
  { id: "piano", name: "Πιάνο", line: "Ανοίγει τις συγχορδίες", accent: "amber", art: <Piano />, player: "left" },
  { id: "voice", name: "Φωνή", line: "Παίρνει τη μελωδία μπροστά", accent: "teal", art: <Singer />, player: null },
];
