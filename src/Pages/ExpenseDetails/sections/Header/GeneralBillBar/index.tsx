import {PixelRatio, View, Dimensions} from 'react-native';
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import DropShadow from 'react-native-drop-shadow';
import {Colors, GravidadeColors} from '../../../../../utils';
import Gradient from '../../../../../components/Gradient';
import {useExpenseDetails} from '../../../context';

export const GeneralBillBar = () => {
  const windowWidth = Dimensions.get('window').width;
  const ContainerWidth = windowWidth - PixelRatio.roundToNearestPixel(32);

  const loaded = useSharedValue(0);

  const color1 = useSharedValue('#666666');
  const color2 = useSharedValue('#000000');

  const colors = useDerivedValue(() => {
    return [color1.value, color2.value];
  });

  const {expense} = useExpenseDetails();

  useEffect(() => {
    const loadPercentage = expense.value / expense.maxValue;
    loaded.value = withTiming(ContainerWidth * loadPercentage, {
      duration: 300,
    });
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
      duration: 400,
    });
    color2.value = withTiming(endColor, {
      duration: 400,
    });
  }, [expense]);

  return (
    <DropShadow
      style={{
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      }}>
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
          CanvasHeight={PixelRatio.roundToNearestPixel(26)}
          rect={{
            x: 0,
            y: 0,
            width: loaded,
            height: PixelRatio.roundToNearestPixel(26),
          }}
        />
      </View>
    </DropShadow>
  );
};
