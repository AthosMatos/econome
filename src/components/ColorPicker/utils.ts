export function GenColorCircleColors(circlePathRadius: number, width: number) {
  const centerX = width / 2;
  const centerY = centerX;

  const segments = 360; // Increase for smoother gradients
  const pArray = [];

  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI;
    const endAngle = ((i + 1) / segments) * 2 * Math.PI;
    const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

    const startX = centerX + circlePathRadius * Math.cos(startAngle);
    const startY = centerY + circlePathRadius * Math.sin(startAngle);
    const endX = centerX + circlePathRadius * Math.cos(endAngle);
    const endY = centerY + circlePathRadius * Math.sin(endAngle);

    const color = i / segments;

    const d = [
      `M ${startX},${startY}`,
      `A ${circlePathRadius},${circlePathRadius} 0 ${largeArc} 1 ${endX},${endY}`,
    ].join(' ');

    const colorHSL = `hsl(${color * 360}, 100%, 50%)`;

    pArray.push({
      d: d,
      color: colorHSL,
    });
  }
  return pArray;
}

type RGB = [number, number, number];

function hslToRgb(h: number, s: number, l: number): RGB {
  'worklet';
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function getRelativeLuminance(rgb: RGB): number {
  'worklet';
  const a: number[] = rgb.map((v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Properly mark the function as a worklet
export const getBestTextColorWorklet = (
  hue: number,
  saturation: number,
  lightness: number,
) => {
  'worklet';

  // Function logic remains largely the same
  const rgb: RGB = hslToRgb(hue / 360, saturation / 100, lightness / 100);
  const luminance: number = getRelativeLuminance(rgb);
  const luminanceWhite: number = getRelativeLuminance([255, 255, 255]);
  const luminanceBlack: number = getRelativeLuminance([0, 0, 0]);

  const contrastWithWhite: number =
    (luminanceWhite + 0.05) / (luminance + 0.05);
  const contrastWithBlack: number =
    (luminance + 0.05) / (luminanceBlack + 0.05);

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black';
};

// Properly mark the function as a worklet
export const getBestTextColorWorklet2 = (hsl: string) => {
  'worklet';

  const hslArray = hsl.split(',');
  const hue = Number(hslArray[0].replace('hsl(', ''));
  const saturation = Number(hslArray[1].replace('%', ''));
  const lightness = Number(hslArray[2].replace('%', ''));

  // Function logic remains largely the same
  const rgb: RGB = hslToRgb(hue / 360, saturation / 100, lightness / 100);
  const luminance: number = getRelativeLuminance(rgb);
  const luminanceWhite: number = getRelativeLuminance([255, 255, 255]);
  const luminanceBlack: number = getRelativeLuminance([0, 0, 0]);

  const contrastWithWhite: number =
    (luminanceWhite + 0.05) / (luminance + 0.05);
  const contrastWithBlack: number =
    (luminance + 0.05) / (luminanceBlack + 0.05);

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black';
};
