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

export function blendHex(colorA: string, colorB: string, t: number) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const r = a.r + (b.r - a.r) * t;
  const g = a.g + (b.g - a.g) * t;
  const B = a.b + (b.b - a.b) * t;
  return rgbToHex(r, g, B);
}

export function buildScaledData(items: any[], valueKey: string, baseColor: string) {
  const LIGHT = '#FFFFFF';

  const MIN_INTENSITY = 0.5;
  const MAX_INTENSITY = 1;

  if (!items || items.length === 0) return [];

  const values = items.map((it) => Math.abs(Number(it[valueKey]) || 0));
  const max = Math.max(...values, 0);

  return items.map((it) => {
    const raw = Math.abs(Number(it[valueKey]) || 0);
    let t = max === 0 ? 0 : raw / max;

    t = MIN_INTENSITY + t * (MAX_INTENSITY - MIN_INTENSITY);
    t = Math.pow(t, 1.1);
    const fill = blendHex(LIGHT, baseColor, t);

    return {
      name: it.month,
      value: Number(it[valueKey]) || 0,
      fill,
    };
  });
}
