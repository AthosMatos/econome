import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {PixelRatio, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SpringConfig} from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';
import {useThemeContext} from '../../context/themeContext';

const fullWidth = PixelRatio.roundToNearestPixel(300);
const fullHeight = PixelRatio.roundToNearestPixel(30);
const widthMarginLeft = PixelRatio.roundToNearestPixel(4);
const height = PixelRatio.roundToNearestPixel(fullHeight - 8);

const SaturationSliderStyles = StyleSheet.create({
  root: {
    width: fullWidth,
    height: fullHeight,
    backgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: PixelRatio.roundToNearestPixel(fullHeight / 4),
    overflow: 'hidden',
  },
  slider: {
    backgroundColor: 'black',
    width: 0,
    marginLeft: widthMarginLeft,
    height: height,
    borderRadius: PixelRatio.roundToNearestPixel(fullHeight / 6),
  },
});

const SaturationSlider = () => {
  const color = useSharedValue('rgba(255, 0, 0, 1)');
  const width = useSharedValue(0);
  const {
    states: {saturation, colorBalls, realm},
    funcs: {saturateColors, upThemeToDB},
  } = useThemeContext();

  function widthFromSaturation(saturation: number) {
    'worklet';
    return interpolate(
      saturation,
      [0, 100],
      [widthMarginLeft, fullWidth - widthMarginLeft * 2],
    );
  }

  function colorFromWidth(width: number) {
    'worklet';
    return interpolateColor(
      width,
      [widthMarginLeft, fullWidth - widthMarginLeft * 2],
      ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)'],
    );
  }

  function saturationFromWidth(width: number) {
    'worklet';
    return interpolate(
      width,
      [widthMarginLeft, fullWidth - widthMarginLeft * 2],
      [0, 100],
    );
  }

  useFocusEffect(
    useCallback(() => {
      const w = widthFromSaturation(saturation.value);
      const springConfig: SpringConfig = {
        damping: 4,
        stiffness: 4,
        velocity: 10,
        mass: 1,
      };
      const timingConfig = {
        duration: 1000,
        easing: Easing.ease,
      };
      width.value = withTiming(w, timingConfig);
      color.value = withTiming(colorFromWidth(w), timingConfig);
      saturateColors(saturation.value);
      return () => {};
    }, []),
  );

  const panSlide = Gesture.Pan()
    .onChange(event => {
      const x = event.x;
      if (x < widthMarginLeft || x > fullWidth - widthMarginLeft * 2) {
        return;
      }
      width.value = x;
      const c = colorFromWidth(x);
      const sat = saturationFromWidth(x);

      saturateColors(sat);
      color.value = c;
    })
    .onEnd(() => {
      runOnJS(upThemeToDB)();
    });

  return (
    <GestureDetector gesture={panSlide}>
      <Animated.View
        style={[
          SaturationSliderStyles.root,
          {
            backgroundColor: color,
          },
        ]}>
        <Animated.View
          style={[
            SaturationSliderStyles.slider,
            {
              width: width,
            },
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default SaturationSlider;
