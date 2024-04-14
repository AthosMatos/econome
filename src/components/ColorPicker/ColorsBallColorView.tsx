import Animated from 'react-native-reanimated';
import {ballSize, outersize, useThemeContext} from '../../context/themeContext';
import {PixelRatio, StyleSheet, TouchableOpacity, View} from 'react-native';

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

const ColorBallColor = () => {
  const {
    states: {colorBalls},
  } = useThemeContext();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: PixelRatio.roundToNearestPixel(10),
      }}>
      {colorBalls.map((ball, index) => (
        <Animated.View
          key={index}
          style={[
            ColorWheelStyles.colorBallColor,
            {
              backgroundColor: ball.ballColor,
              transform: [{scale: ball.selectedScale}],
              borderColor: ball.borderColor,
            },
          ]}
        />
      ))}
      {/* <TouchableOpacity
        onPress={() => {
        }}>
        <Animated.View
          style={[
            ColorWheelStyles.colorBallColor,
            {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderColor: 'rgba(255,255,255,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Faicons
            name="plus"
            size={PixelRatio.roundToNearestPixel(10)}
            color={'rgba(255,255,255,0.6)'}
          />
        </Animated.View>
      </TouchableOpacity> */}
    </View>
  );
};

export default ColorBallColor;
