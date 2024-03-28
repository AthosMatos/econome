import {PixelRatio, View, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Colors, GravidadeColors} from '../../utils';
import {useEffect} from 'react';
import Gradient from '../Gradient';

interface MovableExpenseProps {
  MaxBill: number;
  Bill: number;
  ContainerWidth: number;
}

export const MovableExpense = (props: MovableExpenseProps) => {
  const {MaxBill, Bill, ContainerWidth} = props;

  const loaded = useSharedValue(0);

  const color1 = useSharedValue('#666666');
  const color2 = useSharedValue('#000000');

  const colors = useDerivedValue(() => {
    return [color2.value, color2.value];
  });

  /*  const onMove = Gesture.Pan().onUpdate(({ x }) => {
         if (x > ContainerWidth) {
             loaded.value = ContainerWidth
             return
         }
         loaded.value = x
         const gravidade = x / ContainerWidth
 
         // Interpolate the start and end colors based on the animated value
         const startColor = interpolateColor(
             gravidade,
             [0, 0.5, 1],
             [GravidadeColors.lowStart, GravidadeColors.mediumStart, GravidadeColors.highStart]
         );
 
         const endColor = interpolateColor(
             gravidade,
             [0, 0.5, 1],
             [GravidadeColors.lowEnd, GravidadeColors.mediumEnd, GravidadeColors.highEnd]
         );
 
         color1.value = withSpring(startColor,
             {
                 damping: 50,
                 stiffness: 106,
             })
         color2.value = withSpring(endColor,
             {
                 damping: 50,
                 stiffness: 106,
             })
     })
  */

  useEffect(() => {
    const loadPercentage = Bill / MaxBill < 1 ? Bill / MaxBill : 1;

    const startColor = interpolateColor(
      loadPercentage,
      [0, 0.5, 1],
      [
        GravidadeColors.lowStart,
        GravidadeColors.mediumStart,
        GravidadeColors.highStart,
      ],
    );

    const endColor = interpolateColor(
      loadPercentage,
      [0, 0.5, 1],
      [
        GravidadeColors.lowEnd,
        GravidadeColors.mediumEnd,
        GravidadeColors.highEnd,
      ],
    );

    color1.value = withTiming(startColor, {
      duration: 300,
      easing: Easing.ease,
    });
    color2.value = withTiming(endColor, {
      duration: 300,
      easing: Easing.ease,
    });

    loaded.value = withTiming(ContainerWidth * loadPercentage, {
      duration: 300,
      easing: Easing.ease,
    });
    /* 
    loaded.value = withSpring(ContainerWidth * loadPercentage, {
      damping: 50,
      stiffness: 16,
    });
     */
  }, [Bill, MaxBill]);

  {
    /* <GestureDetector gesture={onMove}> */
  }
  return (
    <View
      style={{
        borderRadius: PixelRatio.roundToNearestPixel(5),
        overflow: 'hidden',
      }}>
      <Gradient
        CanvasStyle={{
          backgroundColor: Colors.softBackground2(0.08),
        }}
        gradient={{
          colors: colors,
          start: {x: 0, y: 0},
          end: {x: ContainerWidth, y: 0},
        }}
        CanvasWidth={ContainerWidth}
        CanvasHeight={PixelRatio.roundToNearestPixel(24)}
        rect={{
          x: 0,
          y: 0,
          width: loaded,
          height: PixelRatio.roundToNearestPixel(24),
        }}
      />
    </View>
  );
};
