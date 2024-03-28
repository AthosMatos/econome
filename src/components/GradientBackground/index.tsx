import React from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Canvas, LinearGradient, Rect, vec} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

interface GradientBackgroundProps {
  children: React.ReactNode;
  CanvasStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  ContainerStyle?: StyleProp<ViewStyle>;
  width: number;
  height: number;
  gradient: {
    start: {x: number; y: number};
    end: {x: number; y: number};
    colors: SharedValue<string[]>;
  };
}

const GradientBackground = (props: GradientBackgroundProps) => {
  const {
    children,
    CanvasStyle,
    style,
    width,
    height,
    gradient,
    ContainerStyle,
  } = props;

  return (
    <View
      style={[
        {
          width: width,
          height: height,
          overflow: 'hidden',
        },
        ContainerStyle,
      ]}>
      {/* Skia Canvas for Gradient Background */}
      <Canvas
        style={[
          styles.canvas,
          CanvasStyle,
          {
            height: height,
          },
        ]}>
        <Rect
          x={gradient.start.x}
          y={gradient.start.y}
          width={width}
          height={height}
        />
        <LinearGradient
          start={gradient.start}
          end={gradient.end}
          colors={gradient.colors}
        />
      </Canvas>

      {/* Content Overlay */}
      <View
        style={[
          {
            width: width,
            height: height,
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    width: width,
  },
});

export default GradientBackground;
