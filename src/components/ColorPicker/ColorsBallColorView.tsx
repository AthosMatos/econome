import Animated from 'react-native-reanimated';
import {useThemeContext} from '../../context/themeContext';
import {ColorWheelStyles} from './colorsP';
import {PixelRatio, TouchableOpacity, View} from 'react-native';

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
