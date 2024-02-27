import { interpolateColor } from "react-native-reanimated";

export const GravidadeColors = {
  lowStart: '#6bfc8b',
  lowEnd: '#00FF1A',
  mediumStart: '#ffd78d',
  mediumEnd: '#ffa600',
  highStart: '#ff906e',
  highEnd: '#ff0000',
};

export function generateExpenseColor(gravidade: number) {

  // Interpolate start and end colors
  const interpolated = interpolateColor(
    gravidade,
    [0, 1],
    [GravidadeColors.lowStart, GravidadeColors.highEnd]
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
  softBackground2: (opacity = 1) => `rgba(255, 255, 255, ${opacity}))`,
};
