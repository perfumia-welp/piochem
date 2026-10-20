/*
 * Generates transparent web derivatives of the Piochem product photos.
 * Originals in /public/WhatsApp Unknown ... are never modified.
 *
 * The photos are shot against a busy classroom background, so simple
 * near-white thresholding is not usable. Every bottle is a row-convex,
 * roughly symmetric silhouette, so each product gets a hand-measured
 * outline profile which is then snapped to the strongest nearby edge,
 * smoothed, and turned into a feathered alpha mask.
 *
 * Usage: node scripts/cutout-products.cjs [--debug <dir>]
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "WhatsApp Unknown 2026-10-09 at 9.16.48 PM");
const OUT = path.join(__dirname, "..", "public", "images", "products", "showcase");
const dbgIdx = process.argv.indexOf("--debug");
const DEBUG = dbgIdx > -1 ? process.argv[dbgIdx + 1] : null;

// profile: [y, xLeft, xRight] keypoints measured on the source photo (960x1280)
// bands: [yFrom, yTo, mode] edge finder per height range ("left|right" for per-side modes):
//   "amber" amber glass (R-B chroma or dark rim), "amberc" chroma only,
//   "dark:<lum>" black HDPE, "notblue" white HDPE vs whiteboard,
//   caps and glass handles (luminance below threshold),
//   "grad" strongest colour edge (labels, white bottles, red caps),
//   "fixed" keep the measured outline,
//   "bridge" interpolate between the glass edges above and below (label rows:
//   the sides are straight there and label print confuses edge detection)
// regions: [x0, y0, x1, y1, mode] areas (bottle handles) whose alpha comes from
//   the per-pixel classifier, so the handle opening stays transparent
// straight: [yFrom, yTo] straight-sided body; each side is replaced by a robust
//   (Theil-Sen) line fit through the detected edges, which removes outliers
// shoulder: [yFrom, yTo] rows where the outline may only widen (monotone fit)
// bottom: [yCenter, sag] base ellipse
const PRODUCTS = [
  {
    id: "nitric-acid-70", file: "WhatsApp Image 2026-09-30 at 12.08.52 PM (1).jpeg", snap: 20,
    profile: [[145, 372, 528], [235, 365, 532], [245, 360, 537], [278, 362, 535], [288, 386, 516], [300, 387, 517], [340, 380, 520],
      [400, 372, 520], [420, 365, 555], [440, 352, 580], [460, 335, 600], [480, 315, 617], [500, 295, 630], [520, 280, 640],
      [540, 270, 647], [560, 262, 652], [580, 257, 655], [600, 255, 656], [640, 254, 657], [1080, 252, 658], [1120, 262, 648], [1150, 285, 625]],
    bands: [[145, 282, "dark:110"], [283, 615, "fixed"], [616, 892, "bridge"], [893, 1160, "amberc"]],
    regions: [[515, 300, 645, 420, "dark:110"]], shoulder: [290, 600], straight: [600, 1100], bottom: [1160, 22],
  },
  {
    id: "acetone", file: "WhatsApp Image 2026-09-30 at 12.08.53 PM (1).jpeg", snap: 20,
    profile: [[165, 385, 592], [290, 378, 598], [296, 360, 607], [338, 360, 607], [345, 385, 582], [360, 383, 588], [380, 363, 613],
      [400, 330, 637], [420, 310, 660], [440, 295, 677], [460, 288, 687], [480, 283, 692], [500, 281, 695], [900, 282, 692], [1100, 285, 690], [1130, 292, 684]],
    bands: [[165, 340, "dark:110"], [341, 505, "fixed"], [506, 515, "amber"], [516, 895, "bridge"], [896, 1150, "amberc"]], shoulder: [340, 505], straight: [505, 1110], bottom: [1150, 20],
  },
  {
    id: "methanol-gradient-grade", file: "WhatsApp Image 2026-09-30 at 12.08.53 PM (3).jpeg", snap: 20,
    profile: [[125, 405, 550], [200, 400, 555], [206, 390, 562], [250, 390, 562], [258, 410, 545], [300, 407, 540], [340, 400, 540],
      [380, 385, 545], [400, 370, 560], [420, 340, 585], [440, 310, 615], [460, 285, 640], [480, 267, 660], [500, 255, 675],
      [520, 247, 687], [540, 242, 697], [560, 241, 704], [600, 241, 707], [660, 240, 707],
      [1100, 235, 705], [1170, 250, 690], [1200, 270, 670]],
    bands: [[125, 256, "dark:110"], [257, 600, "fixed"], [601, 665, "amber"], [666, 945, "bridge"], [946, 1218, "amberc"]],
    regions: [[540, 275, 660, 420, "dark:110"]], shoulder: [258, 622], straight: [620, 1150], bottom: [1218, 30],
  },
  {
    id: "triethylamine", file: "WhatsApp Image 2026-09-30 at 12.08.55 PM (1).jpeg", snap: 20,
    profile: [[185, 378, 598], [305, 375, 600], [312, 350, 605], [355, 350, 605], [362, 382, 578], [400, 380, 580],
      [420, 368, 582], [440, 347, 608], [460, 330, 627], [480, 317, 640], [500, 310, 647], [520, 307, 650], [545, 306, 655], [930, 312, 660], [1000, 315, 656], [1020, 322, 650]],
    bands: [[185, 358, "dark:110"], [359, 545, "fixed"], [546, 930, "bridge"], [931, 1038, "amberc"]], shoulder: [362, 520], straight: [520, 1005], bottom: [1038, 18],
  },
  {
    id: "silver-nitrate-0-1n", file: "WhatsApp Image 2026-09-30 at 12.08.55 PM (4).jpeg", snap: 18,
    profile: [[110, 370, 585], [200, 362, 592], [255, 362, 595], [262, 378, 584], [300, 378, 582], [320, 372, 584],
      [340, 356, 602], [360, 340, 620], [380, 324, 638], [400, 306, 656], [420, 290, 672], [440, 278, 686], [460, 271, 694],
      [480, 268, 697], [500, 266, 698], [530, 268, 697], [940, 278, 703], [1000, 278, 705], [1140, 285, 698]],
    bands: [[110, 258, "grad"], [259, 530, "fixed"], [531, 945, "bridge"], [946, 1165, "dark:120"]], shoulder: [262, 500], straight: [500, 1140], bottom: [1165, 15],
  },
  {
    id: "tricalcium-citrate-tetrahydrate", file: "WhatsApp Image 2026-09-30 at 12.08.56 PM (3).jpeg", snap: 10,
    profile: [[245, 330, 630], [270, 315, 640], [420, 312, 642], [440, 300, 660], [470, 292, 668], [1080, 290, 670], [1100, 298, 664]],
    bands: [[245, 1115, "grad"]], shoulder: [430, 472], straight: [470, 1090], bottom: [1115, 15],
  },
  {
    id: "hydrochloric-acid-0-1n", file: "WhatsApp Image 2026-09-30 at 12.08.58 PM (2).jpeg", snap: 10,
    profile: [[190, 368, 570], [300, 362, 575], [332, 362, 575], [342, 376, 560], [360, 372, 566], [380, 358, 586],
      [400, 340, 602], [420, 322, 622], [440, 306, 640], [460, 292, 654], [480, 282, 666], [500, 276, 674], [520, 275, 676], [1080, 278, 678], [1110, 290, 670]],
    bands: [[190, 335, "grad"], [336, 520, "fixed"], [521, 560, "grad"], [561, 1125, "grad"]], shoulder: [335, 520], straight: [520, 1090], bottom: [1125, 15],
  },
  {
    id: "formaldehyde-solution", file: "WhatsApp Image 2026-09-30 at 12.08.59 PM (3).jpeg", snap: 20,
    profile: [[95, 410, 548], [185, 405, 552], [195, 418, 542], [215, 418, 542], [240, 370, 600], [270, 320, 645],
      [300, 290, 670], [340, 262, 692], [380, 247, 707], [420, 241, 715], [460, 240, 718], [1000, 240, 720], [1090, 245, 718]],
    bands: [[95, 192, "grad"], [193, 540, "dark:120"], [541, 650, "dark:50|dark:120"], [651, 925, "bridge"], [926, 1105, "dark:50|dark:120"]], shoulder: [215, 422], straight: [420, 1090], bottom: [1105, 10],
  },
];

function interp(profile, y) {
  for (let i = 0; i < profile.length - 1; i++) {
    const [y0, l0, r0] = profile[i], [y1, l1, r1] = profile[i + 1];
    if (y >= y0 && y <= y1) { const t = (y - y0) / (y1 - y0 || 1); return [l0 + (l1 - l0) * t, r0 + (r1 - r0) * t]; }
  }
  return null;
}
// pool-adjacent-violators: least-squares non-decreasing fit
function isotonic(v) {
  const blocks = [];
  for (const x of v) {
    blocks.push([x, 1]);
    while (blocks.length > 1 && blocks[blocks.length - 2][0] > blocks[blocks.length - 1][0]) {
      const [m2, n2] = blocks.pop(), [m1, n1] = blocks.pop();
      blocks.push([(m1 * n1 + m2 * n2) / (n1 + n2), n1 + n2]);
    }
  }
  return blocks.flatMap(([m, n]) => Array(n).fill(m));
}
function median(a) { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; }
function smooth(arr, win, fn) {
  return arr.map((_, i) => { const w = []; for (let k = -win; k <= win; k++) { const v = arr[i + k]; if (v != null) w.push(v); } return w.length ? fn(w) : arr[i]; });
}
const mean = (w) => w.reduce((a, b) => a + b, 0) / w.length;

async function run(p) {
  const img = sharp(path.join(SRC, p.file));
  const { data, info } = await img.clone().blur(1.4).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const px = (x, y, c) => data[(y * W + Math.max(0, Math.min(W - 1, x))) * C + c];
  const grad = (x, y) => { let g = 0; for (let c = 0; c < 3; c++) g += Math.abs(px(x + 2, y, c) - px(x - 2, y, c)); return g; };

  const isBottle = (mode, x, y) => {
    const r = px(x, y, 0), g = px(x, y, 1), b = px(x, y, 2);
    const [kind, t] = mode.split(":");
    const lum = (r + g + b) / 3;
    if (kind === "notblue") return b - r < 18; // white HDPE against the bluish whiteboard
    if (kind === "amberc") return r - b > 15 && lum < 150; // chroma only: next to dark wall panels
    if (kind === "amber") return (r - b > 15 && lum < 150) || lum < 75; // bright wood trim excluded
    if (kind === "dark") return lum < (Number(t) || 55);
    return false;
  };
  const y0 = p.profile[0][0], y1 = p.bottom[0];
  const L = [], R = [];
  for (let y = y0; y <= y1; y++) {
    const e = interp(p.profile, Math.min(y, p.profile[p.profile.length - 1][0]));
    const [bandL, bandR = bandL] = (p.bands.find(([a, b]) => y >= a && y <= b) || [0, 0, "grad"])[2].split("|");
    const gradSnap = (x0) => {
      let best = x0, bg = 0;
      for (let x = Math.round(x0 - p.snap); x <= x0 + p.snap; x++) {
        const g = grad(x, y) - Math.abs(x - x0) * 0.6; // mild preference for the measured outline
        if (g > bg) { bg = g; best = x; }
      }
      return bg > 28 ? best : x0;
    };
    // scan from outside the measured outline inwards; the first run of
    // bottle-coloured pixels is the silhouette (reflections inside are ignored)
    const scan = (x0, dir, band) => {
      for (let k = -p.snap; k <= 60; k++) {
        const x = Math.round(x0 + dir * k);
        if ([0, 1, 2].every((j) => isBottle(band, x + dir * j, y))) return x - dir * 0.5;
      }
      return gradSnap(x0);
    };
    const edge = (x0, dir, band) => (band === "fixed" ? x0 : band === "grad" ? gradSnap(x0) : scan(x0, dir, band));
    L.push(edge(e[0], 1, bandL)); R.push(edge(e[1], -1, bandR));
  }
  for (const [a, b, mode] of p.bands) {
    if (mode !== "bridge") continue;
    for (const arr of [L, R]) {
      const top = median(arr.slice(Math.max(0, a - y0 - 16), a - y0 - 4));
      const bot = median(arr.slice(b - y0 + 4, b - y0 + 16));
      for (let y = a; y <= b; y++) arr[y - y0] = top + ((bot - top) * (y - a)) / (b - a);
    }
  }
  if (p.straight) {
    const [a, b] = p.straight;
    const isBridge = (y) => p.bands.some(([u, v, m]) => m === "bridge" && y >= u && y <= v);
    for (const arr of [L, R]) {
      const pts = [];
      for (let y = a; y <= b; y += 3) if (!isBridge(y)) pts.push([y, arr[y - y0]]);
      const slopes = [];
      for (let i = 0; i < pts.length; i += 2) for (let j = i + 7; j < pts.length; j += 5) slopes.push((pts[j][1] - pts[i][1]) / (pts[j][0] - pts[i][0]));
      const m = median(slopes), c = median(pts.map(([y, x]) => x - m * y));
      for (let y = a; y <= b; y++) arr[y - y0] = m * y + c;
    }
  }
  if (p.shoulder) {
    // shoulders only widen going down: left edge non-increasing, right non-decreasing
    const [a, b] = p.shoulder.map((y) => y - y0);
    const l = isotonic(smooth(L.slice(a, b + 1), 4, median).map((x) => -x)).map((x) => -x);
    const r = isotonic(smooth(R.slice(a, b + 1), 4, median));
    l.forEach((x, i) => (L[a + i] = x)); r.forEach((x, i) => (R[a + i] = x));
  }
  const Ls = smooth(smooth(L, 10, median), 3, mean), Rs = smooth(smooth(R, 10, median), 3, mean);

  // alpha mask with sub-pixel coverage
  const alpha = Buffer.alloc(W * H);
  const cx = (p.profile[p.profile.length - 1][1] + p.profile[p.profile.length - 1][2]) / 2;
  const hw = (p.profile[p.profile.length - 1][2] - p.profile[p.profile.length - 1][1]) / 2 + 30;
  for (let y = y0; y <= y1 + 2 && y < H; y++) {
    const i = Math.min(y - y0, Ls.length - 1), l = Ls[i], r = Rs[i];
    for (let x = Math.floor(l) - 1; x <= Math.ceil(r) + 1; x++) {
      let a = Math.min(1, Math.max(0, x - l + 0.5)) * Math.min(1, Math.max(0, r - x + 0.5));
      const yb = p.bottom[0] - p.bottom[1] * Math.pow((x - cx) / hw, 2);
      a *= Math.min(1, Math.max(0, yb - y + 0.5));
      if (y === y0) a *= 0.6;
      if (x >= 0 && x < W) alpha[y * W + x] = Math.round(a * 255);
    }
  }
  for (const [x0, ry0, x1, ry1, mode] of p.regions || []) {
    const rw = x1 - x0 + 1, rh = ry1 - ry0 + 1, reg = Buffer.alloc(rw * rh);
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) reg[y * rw + x] = isBottle(mode, x0 + x, ry0 + y) ? 255 : 0;
    // median filter removes reflection speckles while keeping the handle opening
    const clean = await sharp(reg, { raw: { width: rw, height: rh, channels: 1 } }).median(9).extractChannel(0).raw().toBuffer();
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
      const i = (ry0 + y) * W + x0 + x;
      alpha[i] = Math.max(alpha[i], clean[y * rw + x]);
    }
  }
  const mask = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(0.7).extractChannel(0).raw().toBuffer();

  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x] > 8) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const pad = 6, box = { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad) };
  box.width = Math.min(W, maxX + pad + 1) - box.left; box.height = Math.min(H, maxY + pad + 1) - box.top;

  const rgb = await sharp(path.join(SRC, p.file)).removeAlpha().raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { rgba[i * 4] = rgb[i * 3]; rgba[i * 4 + 1] = rgb[i * 3 + 1]; rgba[i * 4 + 2] = rgb[i * 3 + 2]; rgba[i * 4 + 3] = mask[i]; }
  const cut = sharp(await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(box).png().toBuffer());
  fs.mkdirSync(OUT, { recursive: true });
  // full size (~1000px tall, the source resolution), 720px and 560px for smaller renders
  for (const [suffix, h] of [["", null], ["-720", 720], ["-560", 560]]) {
    const img = h ? cut.clone().resize({ height: h }) : cut.clone();
    await img.clone().webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(path.join(OUT, `${p.id}${suffix}.webp`));
    await img.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(OUT, `${p.id}${suffix}.avif`));
  }

  if (DEBUG) {
    fs.mkdirSync(DEBUG, { recursive: true });
    const cutBuf = await cut.clone().png().toBuffer();
    await sharp({ create: { width: box.width, height: box.height, channels: 3, background: "#f6f3ee" } })
      .composite([{ input: cutBuf }]).jpeg({ quality: 92 }).toFile(path.join(DEBUG, `${p.id}.jpg`));
  }
  console.log(p.id, `${box.width}x${box.height}`, "from", p.file);
}

(async () => { for (const p of PRODUCTS) await run(p); })();
