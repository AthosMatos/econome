// A helper function to interpolate between two colors
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number,
) {
  if (factor < 0) factor = 0;
  if (factor > 1) factor = 1;

  const result = color1
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex, index) => {
      const color1Val = parseInt(hex, 16);
      const color2Match = color2.slice(1).match(/.{2}/g);

      const color2Val = parseInt(color2Match ? color2Match[index] : '00', 16);
      const interpolated = Math.round(
        color1Val + (color2Val - color1Val) * factor,
      )
        .toString(16)
        .padStart(2, '0');
      return interpolated;
    })
    .join('');

  return `#${result}`;
}

export function interpolateThreeColors(
  lowColor: string,
  mediumColor: string,
  highColor: string,
  factor: number,
) {
  // Ensure factor is within [0, 1]
  if (factor < 0) factor = 0;
  if (factor > 1) factor = 1;

  let startColor, endColor;
  let localFactor;

  if (factor <= 0.5) {
    // Interpolate between low and medium colors
    startColor = lowColor;
    endColor = mediumColor;
    localFactor = factor * 2; // Adjust factor for the 0 to 0.5 range
  } else {
    // Interpolate between medium and high colors
    startColor = mediumColor;
    endColor = highColor;
    localFactor = (factor - 0.5) * 2; // Adjust factor for the 0.5 to 1 range
  }

  return interpolate(startColor, endColor, localFactor);
}

function interpolate(colorA: string, colorB: string, factor: number) {
  const result = colorA
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex, index) => {
      const colorAVal = parseInt(hex, 16);
      const colorBMatch = colorB.slice(1).match(/.{2}/g);

      const colorBVal = parseInt(colorBMatch ? colorBMatch[index] : '00', 16);
      const interpolated = Math.round(
        colorAVal + (colorBVal - colorAVal) * factor,
      )
        .toString(16)
        .padStart(2, '0');
      return interpolated;
    })
    .join('');

  return `#${result}`;
}

export function generateExpenseGradient(gravidade: number) {
  const MinGravityColor = { start: '#D1FFDB', end: '#00FF1A' };
  const MediumGravityColor = { start: '#fff8d0', end: '#ffbb00' };
  const MaxGravityColor = { start: '#FFDBD0', end: '#ff0000' };

  // Interpolate start and end colors
  const interpolatedStart = interpolateThreeColors(
    MinGravityColor.start,
    MediumGravityColor.start,
    MaxGravityColor.start,
    gravidade,
  );
  const interpolatedEnd = interpolateThreeColors(
    MinGravityColor.end,
    MediumGravityColor.end,
    MaxGravityColor.end,
    gravidade,
  );

  return { start: interpolatedStart, end: interpolatedEnd };
}

export function generateExpenseColor(gravidade: number) {
  const MinGravityColor = '#C6FFA4';
  const MaxGravityColor = '#FFA4A4';

  // Interpolate start and end colors
  const interpolated = interpolateColor(
    MinGravityColor,
    MaxGravityColor,
    gravidade,
  );

  return interpolated;
}

export function formatMoney(value: number) {
  //remobe spaces
  return value
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace(/\s/g, '');
}

export const Colors = {
  softRed: '#FFA4A4',
  softGreen: '#C6FFA4',
  white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  softBackground: (opacity = 1) => `rgba(70, 70, 96, ${opacity}))`,
};
