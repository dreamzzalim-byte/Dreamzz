// KISWA — le signe K (tracé vectoriel) et ses champs de distance pour la scène 3D.
// Unités des tracés : celles du cadre `vb` (largeur, hauteur du K). Pour changer de tracé,
// remplacer `fut`, `bras`, `ligne` (axe de la ligne de coulée, du haut vers le bas) et `filet` (largeur de la ligne).

export const KMARK = {
  vb: [2284, 2166],
  filet: 63,
  fut: 'M731.5 2166L51.5 2166C38.3 2166 25.7 2162.6 15.8 2154C11.9 2150.6 8.4 2146.2 5.8 2141.4C2.1 2134.2 0 2126 0 2118L0 48.3C0 40.3 2 32.1 5.7 24.8C8.2 20 11.7 15.6 15.6 12.1C25.5 3.5 38 0 51.3 0L211.1 0C317 0 423.1 35.9 514.5 89.9C551.9 112 586.8 138 616.2 169.5C675.3 232.8 711.7 318.2 719 404.8C726.2 491.3 704.2 579.1 663.3 655.8C622.6 731.9 563.4 797 506.5 862C477.6 894.9 449.3 927.8 424.9 964.4C400.9 1000.5 380.8 1040.2 370.3 1081.9C359.6 1124.2 358.9 1168.6 366.9 1211.7C374.8 1254.2 391.2 1295.4 413.5 1332.4C497 1470.9 664 1549.5 738.7 1691.3C758.7 1729.1 772 1771.3 777.6 1814.2C779.4 1828.1 781 1842 781 1856L781 2117.7C781 2125.7 778.9 2133.9 775.2 2141.3C772.8 2146.2 769.3 2150.6 765.4 2154.1C756.1 2162.4 744.1 2166 731.5 2166Z',
  bras: 'M2236.5 2166L1446.6 2166C1414.7 2166 1383.3 2156.2 1354.6 2142.2C1326.6 2128.6 1300.3 2110.1 1278.7 2087.5L915.7 1707.9C898.2 1689.6 879.2 1672.8 860.3 1656C758.8 1565.9 643.7 1492.4 546.3 1395.8C513.1 1362.8 482 1327.2 459.8 1286.4C438.4 1247 425.3 1202.8 425 1158.6C424.7 1115.4 436.8 1072.2 456.7 1033.3C479.5 988.9 512.7 950 546 912.1C583.4 869.7 621.1 828.5 654.7 783.9C671.4 761.6 687.8 738.8 702.1 714.8C705.4 709.3 711.2 706 717.6 706C752 706 787.5 712.8 819.1 703.7C824.7 702.1 830.2 700.1 835.5 697.6C846.1 692.5 856.1 685.5 865.7 678.3C881.7 666.1 897.2 653.5 911.2 639.3L1470.6 71.1C1489.8 51.5 1511.2 34.4 1535.2 21.9C1559.2 9.4 1586.3 0 1613.6 0L2217.6 0C2224.3 0 2230.9 1.4 2237.2 3.6C2247.8 7.3 2257.4 14.7 2262.3 24.4C2267.4 34.7 2267.3 47.5 2262.8 58.4C2260.6 63.8 2257.7 69.1 2253.6 73.4L1584.4 773.5C1531.4 829 1471.7 878.1 1404.9 914.9C1358.4 940.4 1307.9 959.5 1256.6 974.1C1234.2 980.4 1211.7 986.6 1188.8 991L717.8 1081.5L1239.7 1169.1C1264 1173.2 1287.8 1179.6 1311.6 1186.3C1362.8 1200.8 1412.8 1220.6 1459.1 1246.7C1505.3 1272.8 1547.8 1305.1 1586.5 1341.4C1604 1357.9 1621 1374.9 1637.2 1392.8L2269.9 2089.6C2274.4 2094.5 2277.8 2100.3 2280.3 2106.4C2284.9 2117.3 2285.5 2130.1 2280.7 2140.5C2276 2150.9 2265.8 2158.8 2254.6 2162.6C2248.8 2164.6 2242.7 2166 2236.5 2166Z',
  ligne: 'M677.8 694.1L673.8 700.6L668.9 708.6L663.2 717.5L657.3 726.2L651.4 734.8L645.5 743.2L639.4 751.6L633.3 759.8L627.1 768L620.9 776.1L614.4 784.3L608 792.3L601.5 800.2L594.9 808.2L588.3 816L581.7 823.7L575.1 831.4L568.4 839.1L561.7 846.8L555.1 854.3L548.5 861.8L541.9 869.3L535.2 876.9L528.6 884.4L522.1 891.8L515.6 899.2L509.2 906.7L502.8 914.1L496.5 921.6L490.3 929L484.3 936.5L478.3 944L472.4 951.6L466.7 959.2L461.2 966.9L455.7 974.6L450.5 982.4L445.4 990.3L440.5 998.2L435.8 1006.2L431.3 1014.3L427 1022.5L422.9 1030.8L419.1 1039.1L415.5 1047.5L412.1 1056L409 1064.5L406.1 1073.1L403.5 1081.8L401.3 1090.5L399.2 1099.3L397.5 1108.1L396.1 1117L395 1125.9L394.1 1134.8L393.6 1143.7L393.4 1152.6L393.4 1161.5L393.7 1170.4L394.4 1179.3L395.3 1188.2L396.5 1197.2L398 1206.1L399.8 1214.9L401.8 1223.7L404.1 1232.4L406.7 1241.2L409.5 1249.8L412.6 1258.4L415.9 1266.9L419.4 1275.3L423.2 1283.7L427.2 1291.9L431.4 1300L435.9 1308.1L440.4 1315.9L445.2 1323.5L450 1330.9L455 1338.2L460.2 1345.5L465.6 1352.6L471.2 1359.7L476.8 1366.7L482.7 1373.6L488.7 1380.5L494.8 1387.4L501 1394.1L507.4 1400.8L513.9 1407.5L520.5 1414.1L527.2 1420.7L533.9 1427.3L540.8 1433.8L547.7 1440.3L554.7 1446.7L561.7 1453.1L568.8 1459.5L575.9 1465.9L583 1472.1L590.3 1478.5L597.5 1484.7L604.7 1491L612 1497.3L619.2 1503.5L626.6 1509.8L633.8 1516L641 1522.3L648.3 1528.5L655.5 1534.8L662.6 1541L669.8 1547.3L676.9 1553.6L683.6 1559.7'
};

// --- Lecture des tracés (M, L, C, Z en coordonnées absolues) -> segments de droite [x0, y0, x1, y1, …] ---
function flatten(d, steps = 14) {
  const out = [];
  const re = /([MLCZ])([^MLCZ]*)/g;
  let m, x = 0, y = 0, sx = 0, sy = 0;
  while ((m = re.exec(d))) {
    const v = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
    if (m[1] === 'M') { x = sx = v[0]; y = sy = v[1]; }
    else if (m[1] === 'L') { out.push(x, y, v[0], v[1]); x = v[0]; y = v[1]; }
    else if (m[1] === 'C') {
      let px = x, py = y;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, u = 1 - t;
        const qx = u * u * u * x + 3 * u * u * t * v[0] + 3 * u * t * t * v[2] + t * t * t * v[4];
        const qy = u * u * u * y + 3 * u * u * t * v[1] + 3 * u * t * t * v[3] + t * t * t * v[5];
        out.push(px, py, qx, qy); px = qx; py = qy;
      }
      x = v[4]; y = v[5];
    } else if (x !== sx || y !== sy) { out.push(x, y, sx, sy); x = sx; y = sy; }
  }
  return new Float64Array(out);
}

function segDist2(px, py, s, i) {
  const ax = s[i], ay = s[i + 1], dx = s[i + 2] - ax, dy = s[i + 3] - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = px - ax - t * dx, ey = py - ay - t * dy;
  return ex * ex + ey * ey;
}

// Segments rangés par cases de côté `cell` (en pixels) : cases[c] = indices des segments qui passent à proximité.
function bucket(seg, n, cell) {
  const nc = Math.ceil(n / cell), cases = Array.from({ length: nc * nc }, () => []);
  for (let i = 0; i < seg.length; i += 4) {
    const x0 = Math.floor((Math.min(seg[i], seg[i + 2]) - cell) / cell), x1 = Math.floor((Math.max(seg[i], seg[i + 2]) + cell) / cell);
    const y0 = Math.floor((Math.min(seg[i + 1], seg[i + 3]) - cell) / cell), y1 = Math.floor((Math.max(seg[i + 1], seg[i + 3]) + cell) / cell);
    for (let cy = Math.max(y0, 0); cy <= Math.min(y1, nc - 1); cy++)
      for (let cx = Math.max(x0, 0); cx <= Math.min(x1, nc - 1); cx++) cases[cy * nc + cx].push(i);
  }
  return { nc, cases };
}

// Distance signée exacte à un contour fermé (négative à l'intérieur), bornée à ±cell pixels. Une ligne par étape.
function* shapeField(seg, n, cell, out, k) {
  const { nc, cases } = bucket(seg, n, cell);
  const xs = [];
  for (let py = 0; py < n; py++) {
    const yc = py + 0.5;
    xs.length = 0;
    for (let i = 0; i < seg.length; i += 4) {
      const y0 = seg[i + 1], y1 = seg[i + 3];
      if ((y0 <= yc) !== (y1 <= yc)) xs.push(seg[i] + (yc - y0) * (seg[i + 2] - seg[i]) / (y1 - y0));
    }
    xs.sort((a, b) => a - b);
    let q = 0;
    const row = Math.floor(py / cell) * nc;
    for (let px = 0; px < n; px++) {
      const xc = px + 0.5;
      while (q < xs.length && xs[q] < xc) q++;
      const list = cases[row + Math.floor(px / cell)];
      let d2 = cell * cell;
      for (let j = 0; j < list.length; j++) { const v = segDist2(xc, yc, seg, list[j]); if (v < d2) d2 = v; }
      out[(py * n + px) * 4 + k] = (q & 1 ? -1 : 1) * Math.sqrt(d2);
    }
    yield;
  }
}

// Distance exacte au trait d'axe `seg` épaissi de `half` pixels. La corde la plus proche désigne la zone,
// puis la distance est calculée exactement sur les segments de cette zone et de ses deux voisines.
function* strokeField(seg, n, half, out, k) {
  const G = 8, ns = seg.length / 4, coarse = [];
  for (let g = 0; g * G < ns; g++) {
    const i = g * G * 4, j = Math.min(g * G + G - 1, ns - 1) * 4;
    coarse.push(seg[i], seg[i + 1], seg[j + 2], seg[j + 3]);
  }
  const ng = coarse.length / 4;
  for (let py = 0; py < n; py++) {
    for (let px = 0; px < n; px++) {
      const xc = px + 0.5, yc = py + 0.5;
      let best = 0, bd = 1e20;
      for (let g = 0; g < ng; g++) { const v = segDist2(xc, yc, coarse, g * 4); if (v < bd) { bd = v; best = g; } }
      const s0 = Math.max(best - 1, 0) * G, s1 = Math.min((best + 2) * G, ns);
      let d2 = 1e20;
      for (let s = s0; s < s1; s++) { const v = segDist2(xc, yc, seg, s * 4); if (v < d2) d2 = v; }
      out[(py * n + px) * 4 + k] = Math.sqrt(d2) - half;
    }
    yield;
  }
}

const f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
function toHalf(val) {
  f32[0] = val;
  const x = u32[0], s = (x >> 16) & 0x8000;
  let e = ((x >> 23) & 0xff) - 112, m = x & 0x7fffff;
  if (e <= 0) { if (e < -10) return s; m = (m | 0x800000) >> (1 - e); return s + ((m + 0x1000) >> 13); }
  if (e >= 31) return s | 0x7c00;
  return s | ((e << 10) + ((m + 0x1000) >> 13));            // l'arrondi peut passer à l'exposant suivant
}

function* fieldsJob(mark, n, span, res) {
  const [vw, vh] = mark.vb;
  const sc = n / (span * vw), ox = n / 2 - sc * vw / 2, oy = n / 2 - sc * vh / 2;
  const px = (seg) => { for (let i = 0; i < seg.length; i += 2) { seg[i] = seg[i] * sc + ox; seg[i + 1] = seg[i + 1] * sc + oy; } return seg; };
  const cell = Math.round(0.058 * n / span);                    // portée utile des ombres et du ménisque
  const halfPx = mark.filet * sc / 2;
  const dist = new Float32Array(n * n * 4);
  yield* shapeField(px(flatten(mark.fut)), n, cell, dist, 0);
  yield* shapeField(px(flatten(mark.bras)), n, cell, dist, 1);
  yield* strokeField(px(flatten(mark.ligne)), n, halfPx, dist, 2);
  const data = new Uint16Array(n * n * 4), k = span / n;        // pixels -> largeurs de K
  let reach = 0;                                                // distance de la ligne au point des bras le plus éloigné
  for (let i = 0; i < n * n; i++) {
    if (dist[i * 4 + 1] < 0) reach = Math.max(reach, dist[i * 4 + 2] + halfPx);
    data[i * 4] = toHalf(dist[i * 4] * k);
    data[i * 4 + 1] = toHalf(dist[i * 4 + 1] * k);
    data[i * 4 + 2] = toHalf(dist[i * 4 + 2] * k);
    data[i * 4 + 3] = 0x3c00;
  }
  // repères de la ligne (ordonnées du haut et du bas, en largeurs de K, origine au centre du K)
  const ys = (mark.ligne.match(/-?[\d.]+ -?[\d.]+/g) || []).map((p) => +p.split(' ')[1]);
  Object.assign(res, {
    data, n, span,
    half: mark.filet / vw / 2,
    reach: reach * k,
    lineTop: (Math.min(...ys) - vh / 2) / vw,
    lineBottom: (Math.max(...ys) - vh / 2) / vw
  });
}

// Champs de distance du K dans un carré de côté `span` (en largeurs de K), centré sur le K.
// Le calcul est découpé en tranches de `budget` ms pour ne jamais bloquer l'animation.
// Résout { data: Uint16Array (RGBA demi-flottants : fût, bras, ligne, 1), n, span, half, reach, lineTop, lineBottom }.
export function markFields(mark, { n = 640, span = 1.28, budget = 6 } = {}) {
  const res = {}, job = fieldsJob(mark, n, span, res);
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  return new Promise((resolve, reject) => {
    const step = () => {
      try {
        const t0 = now();
        while (now() - t0 < budget) { if (job.next().done) { resolve(res); return; } }
        setTimeout(step, 0);
      } catch (err) { reject(err); }
    };
    step();
  });
}
