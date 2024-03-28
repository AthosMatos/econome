import {View} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {getBestTextColorWorklet} from '../../utils';
import ColorBall from './ColorBall';
import {outersize, radius, useThemeContext} from '../../context/themeContext';

const ColorSelector = () => {
  const selectionMargin = 50;
  const clickedBall = useSharedValue('');
  const {
    states: {colorBalls, realm},
    funcs: {updateBallColorFromMove, upThemeToDB},
    setStatesFuncs: {setStatusStyle},
  } = useThemeContext();

  function whichBallClicked(x: number, y: number) {
    'worklet';
    const ball = colorBalls.find(ball => {
      const x_dist = Math.abs(x - ball.positionX.value);
      const y_dist = Math.abs(y - ball.positionY.value);
      const dist = x_dist + y_dist;
      return dist <= selectionMargin;
    });
    return ball;
  }

  function getClickedBall() {
    'worklet';
    const ball = colorBalls.find(ball => ball.name === clickedBall.value);
    return ball;
  }

  const pan = Gesture.Pan()
    .onBegin(event => {
      const ball = whichBallClicked(event.x, event.y);
      if (!ball) return;
      ball.selectedScale.value = withTiming(1.4, {
        duration: 300,
        easing: Easing.ease,
      });
      clickedBall.value = ball.name;
    })
    .onChange(event => {
      const ball = getClickedBall();
      if (!ball) return;
      const {angle, centerX, centerY, distanceFromCenter, hsl} =
        updateBallColorFromMove(
          ball.index,
          ball.ballColor,
          {x: ball.lastX, y: ball.lastY},
          event,
        );
      ball.borderColor.value = getBestTextColorWorklet(hsl.h, hsl.s, hsl.l);

      if (distanceFromCenter <= radius) {
        ball.positionX.value = event.x;
        ball.positionY.value = event.y;

        ball.lastX.value = event.x;
        ball.lastY.value = event.y;
      } else {
        ball.positionX.value = centerX + radius * Math.cos(angle);
        ball.positionY.value = centerY + radius * Math.sin(angle);

        ball.lastX.value = centerX + radius * Math.cos(angle);
        ball.lastY.value = centerY + radius * Math.sin(angle);
      }
    })
    .onEnd(event => {
      const ball = getClickedBall();
      if (!ball) return;
      ball.selectedScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      });
      clickedBall.value = '';
      runOnJS(setStatusStyle)(
        ball.borderColor.value === 'white' ? 'light-content' : 'dark-content',
      );
      runOnJS(upThemeToDB)();
    });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{
          position: 'absolute',
          width: outersize,
          height: outersize,
        }}>
        {colorBalls.map((data, index) => (
          <ColorBall key={index} data={data} />
        ))}
      </View>
    </GestureDetector>
  );
};

export default ColorSelector;
