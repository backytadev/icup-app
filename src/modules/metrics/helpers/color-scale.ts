export function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean,
    16
  );
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  const hr = (n: number) => {
    const v = Math.max(0, Math.min(255, Math.round(n)));
    return v.toString(16).padStart(2, '0');
  };
  return `#${hr(r)}${hr(g)}${hr(b)}`.toUpperCase();
}

// Convert HEX → HSL
export function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) h = ((gg - bb) / delta) % 6;
    else if (max === gg) h = (bb - rr) / delta + 2;
    else h = (rr - gg) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

// Convert HSL → HEX
export function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return rgbToHex(Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255));
}

// Build scaled data with HSL variation
export function buildScaledData(items: any[], valueKey: string, baseColor: string) {
  if (!items || items.length === 0) return [];

  const base = hexToHsl(baseColor);

  const values = items.map((it) => Math.abs(Number(it[valueKey]) || 0));
  const max = Math.max(...values, 0);

  return items.map((it, index) => {
    const raw = Math.abs(Number(it[valueKey]) || 0);
    const ratio = max === 0 ? 0 : raw / max;

    const saturationBoost = 15;
    const lightnessRange = 35;
    const hueShift = 3;

    const s = Math.min(100, base.s * 100 + saturationBoost * ratio);
    const l = Math.min(85, base.l * 100 + lightnessRange * (1 - ratio));
    const h = (base.h + index * hueShift) % 360;

    const fill = hslToHex(h, s, l);

    return {
      name: it.month,
      currency: it.currency,
      value: Number(it[valueKey]) || 0,
      fill,
    };
  });
}
