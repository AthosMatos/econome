import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {ColorBallI} from './colorsP';
import {ballSize} from '../../context/themeContext';

interface ColorBallProps {
  data: ColorBallI;
}

const ColorBall = (props: ColorBallProps) => {
  const {ballColor, positionX, positionY, borderColor, selectedScale} =
    props.data;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: ballColor.value,
      transform: [
        {
          translateX: positionX.value,
        },
        {
          translateY: positionY.value,
        },
        {
          scale: selectedScale.value,
        },
      ],
      borderColor: borderColor.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: ballSize,
          height: ballSize,
          borderRadius: 100,
          elevation: 12,
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          borderWidth: 1,
        },
        animatedStyle,
      ]}
    />
  );
};

export default ColorBall;
