import React, {useState, useCallback, memo} from 'react';
import {View, PixelRatio, TouchableOpacity} from 'react-native';
import {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ExpenseCardStyles, extendedWidth, normalWidth} from './styles';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import BackImg from './BackImg';
import ExpenseInfo from './ExpenseInfo';
import DeleteMode from './DeleteMode';
import {ExpenseDBI} from '../../database/Data/ExpenseDB';
import {useToolBarContext} from '../../context/ToolBarContext';
import {GravidadeColors} from '../../utils';
import {BillPageProps} from '../../Pages/ExpenseDetails';
import Gradient from '../Gradient';
import {useDBContext} from '../../database/DBContext';

interface ExpenseCardProps {
  expense: ExpenseDBI;
}
const ExpenseCard = memo(function ({expense}: ExpenseCardProps) {
  const [deleteMode, setDeleteMode] = useState(false);
  const {
    states: {extendedCards},
  } = useToolBarContext();
  const borderColor = useSharedValue(GravidadeColors.lowEnd);

  const {
    states: {expenses},
    setStates: {setExpenses},
  } = useDBContext();

  const loaded = useSharedValue(0);
  const lastY = useSharedValue(0);
  const TranslationY = useSharedValue(0);

  function resetValues() {
    lastY.value = withTiming(0, {duration: 200});
    TranslationY.value = withTiming(0, {duration: 200});
    setDeleteMode(false);
  }

  /*  const pan = Gesture.Pan().onEnd(event => {
    if (event.translationY < -30) {
      const x = -60;
      lastY.value = x;
      TranslationY.value = withTiming(x, {
        duration: 200,
      });
      runOnJS(setDeleteMode)(true);
    }
    if (event.translationY > 20) {
      const x = 0;
      lastY.value = x;
      TranslationY.value = withTiming(x, {
        duration: 200,
      });
      runOnJS(setDeleteMode)(false);
    }
  }); */

  const nav = useNavigation() as any;

  const color1 = useSharedValue(GravidadeColors.lowEnd);
  const color2 = useSharedValue(GravidadeColors.highEnd);

  const colors = useDerivedValue(() => {
    return [color1.value, color2.value];
  });

  useFocusEffect(
    useCallback(() => {
      loaded.value = withTiming(
        (normalWidth - PixelRatio.roundToNearestPixel(16)) *
          (expense.value / expense.maxValue),
        {
          duration: 400,
        },
      );
      borderColor.value = interpolateColor(
        expense.value / expense.maxValue,
        [0, 1],
        [GravidadeColors.lowEnd, GravidadeColors.highEnd],
      );
      color1.value = interpolateColor(
        expense.value / expense.maxValue,
        [0, 1],
        [GravidadeColors.lowStart, GravidadeColors.highStart],
      );
      color2.value = interpolateColor(
        expense.value / expense.maxValue,
        [0, 1],
        [GravidadeColors.lowEnd, GravidadeColors.highEnd],
      );
    }, [expense, extendedCards]),
  );

  const borderAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  return (
    <Animated.View style={[borderAnimStyle, ExpenseCardStyles.root]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (!deleteMode) {
            const ps: BillPageProps = {
              ExpenseID: expense.id,
              currMonthID: expense.currMonthID,
              img: expense.img,
            };
            nav.navigate('ExpenseDetailsPage', ps);
          } else {
            resetValues();
          }
        }}>
        <Animated.View
          style={[
            {
              transform: [{translateY: TranslationY}],
              opacity: deleteMode ? 0.5 : 1,
              width: normalWidth,
            },
            ExpenseCardStyles.Container,
          ]}>
          <BackImg expense={expense} />

          <ExpenseInfo expense={expense} />

          <View
            style={[
              ExpenseCardStyles.CenterLoad,
              {
                width: normalWidth - PixelRatio.roundToNearestPixel(16),
              },
            ]}>
            <Gradient
              gradient={{
                colors: colors,
                start: {x: 0, y: 0},
                end: {
                  x: normalWidth - PixelRatio.roundToNearestPixel(16),
                  y: 0,
                },
              }}
              CanvasWidth={normalWidth - PixelRatio.roundToNearestPixel(16)}
              CanvasHeight={PixelRatio.roundToNearestPixel(14)}
              rect={{
                x: 0,
                y: 0,
                width: loaded,
                height: PixelRatio.roundToNearestPixel(14),
              }}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
      <DeleteMode
        deleteMode={deleteMode}
        expense={expense}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </Animated.View>
  );
});

export default ExpenseCard;
