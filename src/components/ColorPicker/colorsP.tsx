import React from 'react';
import {PixelRatio, StyleSheet, View} from 'react-native';
import {
  Canvas,
  RadialGradient,
  Rect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';
import SaturationSlider from './saturationSlider';
import ColorSelector from './ColorSelector';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  ballSize,
  outerRadius,
  outersize,
  useThemeContext,
} from '../../context/themeContext';
import ColorBallColor from './ColorsBallColorView';

const radiaColors = [
  'rgba(0,0,0,0)',
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.2)',
  'rgba(255,255,255,1)',
];
const radiaColorsP = [
  'rgba(0,0,0,1)',
  'rgba(0,0,0,0.8)',
  'rgba(0,0,0,0.2)',
  'rgba(0,0,0,0)',
];

export const ColorWheelStyles = StyleSheet.create({
  root: {
    gap: PixelRatio.roundToNearestPixel(20),
  },
  colorWheel: {
    borderRadius: 200,
    overflow: 'hidden',
    width: outersize,
    height: outersize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBallColor: {
    width: ballSize,
    height: ballSize,
    borderRadius: 100,
    borderWidth: 1,
  },
});

export interface ColorBallI {
  ballColor: SharedValue<string>;
  index: number;
  name: string;
  positionX: SharedValue<number>;
  positionY: SharedValue<number>;
  block: SharedValue<boolean>;
  start: SharedValue<boolean>;
  borderColor: SharedValue<string>;
  lastX: SharedValue<number>;
  lastY: SharedValue<number>;
  selectedScale: SharedValue<number>;
}
export interface ColorBallIV2 {
  ballColor: string;
  index: number;
  name: string;
  positionX: number;
  positionY: number;
  block: boolean;
  start: boolean;
  borderColor: string;
  lastX: number;
  lastY: number;
  selectedScale: number;
}
const ColorWheel = () => {
  const {
    states: {colorWhellColors},
  } = useThemeContext();
  return (
    <GestureHandlerRootView style={ColorWheelStyles.root}>
      <SaturationSlider />
      <ColorBallColor />

      <View style={ColorWheelStyles.colorWheel}>
        <Canvas style={{width: outersize, height: outersize}}>
          <Rect x={0} y={0} width={outersize} height={outersize}>
            <SweepGradient
              c={vec(outerRadius, outerRadius)}
              colors={colorWhellColors}
            />
          </Rect>

          <Rect x={0} y={0} width={outersize} height={outersize}>
            <RadialGradient
              c={vec(outerRadius, outerRadius)}
              r={outersize / 1.95}
              colors={radiaColors}
            />
          </Rect>

          <Rect x={0} y={0} width={outersize} height={outersize}>
            <RadialGradient
              c={vec(outerRadius, outerRadius)}
              r={outersize / 3.4}
              colors={radiaColorsP}
            />
          </Rect>
        </Canvas>
        <ColorSelector />
      </View>
    </GestureHandlerRootView>
  );
};

export default ColorWheel;
