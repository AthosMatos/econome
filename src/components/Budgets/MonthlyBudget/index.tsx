import {
  Dimensions,
  PixelRatio,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import FaIcons from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Colors, GravidadeColors, formatMoney} from '../../../utils';
import {useDBContext} from '../../../database/DBContext';
import {MonthlyBudgetDBI} from '../../../database/Data/MonthlyBudgetDB';
import {MonthlyBudgetStyles} from './styles';

interface MonthlyBudgetProps {
  budget: MonthlyBudgetDBI;
  scrollToPage: (page: number) => void;
}

export const MonthlyBudget = ({budget, scrollToPage}: MonthlyBudgetProps) => {
  const {
    funcs: {
      update: {updateMonthlyBudget},
      delete: {deleteBudget},
    },
    states: {monthlyBudgets},
    setStates: {setCurrMonthID, setMonthlyBudgets},
  } = useDBContext();

  const [custommaxValue, setCustommaxValue] = useState<number>(budget.maxValue);

  const expenseColor = useSharedValue(GravidadeColors.lowEnd);
  const load = useSharedValue(0);

  const [deletecurrentValue, setDeletecurrentValue] = useState<boolean>(false);

  useEffect(() => {
    expenseColor.value = interpolateColor(
      budget.currentValue / custommaxValue,
      [0, 0.5, 1],
      [
        GravidadeColors.lowEnd,
        GravidadeColors.mediumEnd,
        GravidadeColors.highEnd,
      ],
    );

    load.value = withTiming(
      Dimensions.get('window').width *
        0.7 *
        (budget.currentValue / custommaxValue),
      {duration: 500},
    );
  }, [budget, custommaxValue, monthlyBudgets]);

  const translationY = useSharedValue(0);
  const lastY = useSharedValue(0);

  const pan = Gesture.Pan().onEnd(event => {
    const yDown = 80;
    if (event.translationY > 20) {
      lastY.value = yDown;
      translationY.value = withTiming(yDown, {
        duration: 200,
      });
      runOnJS(setDeletecurrentValue)(true);
    } else {
      lastY.value = 0;
      translationY.value = withTiming(0, {
        duration: 200,
      });

      runOnJS(setDeletecurrentValue)(false);
    }
  });

  const borderAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: expenseColor.value,
    };
  });

  const deleteTranslationStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translationY.value}],
      opacity: deletecurrentValue ? 0.5 : 1,
    };
  });

  return (
    <Animated.View style={[MonthlyBudgetStyles.InnerBorder, borderAnimStyle]}>
      {deletecurrentValue && (
        <Animated.View style={{position: 'absolute'}}>
          <TouchableOpacity
            onPress={() => {
              const newBudgets = monthlyBudgets.filter(
                b => b._id !== budget._id,
              );
              setMonthlyBudgets(newBudgets);
              setCurrMonthID(newBudgets[newBudgets.length - 1]?._id);
              if (newBudgets.length - 1 >= 0)
                scrollToPage(newBudgets.length - 1);

              deleteBudget(budget._id);
              //resetValues();
            }}
            style={MonthlyBudgetStyles.delete}>
            <FaIcons
              name="trash"
              size={PixelRatio.roundToNearestPixel(42)}
              color={Colors.white(0.7)}
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            deleteTranslationStyle,
            MonthlyBudgetStyles.MainInfoAninWrapper,
          ]}>
          <View style={MonthlyBudgetStyles.MainInfoContainer}>
            <Text style={MonthlyBudgetStyles.yearText}>{budget.year}</Text>
            <Text style={MonthlyBudgetStyles.MonthText}>{budget.month}</Text>
          </View>

          <Animated.Text
            style={[
              MonthlyBudgetStyles.MainPayText,
              {
                color: expenseColor,
              },
            ]}>
            {formatMoney(budget.currentValue)}
          </Animated.Text>

          <CurrencyInput
            placeholder="maxValue"
            value={custommaxValue}
            onChangeValue={value => {
              if (value) {
                setCustommaxValue(value);
                updateMonthlyBudget(budget._id, {maxValue: value});
              }
            }}
            prefix="R$"
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            style={MonthlyBudgetStyles.SecondaryPayText}
          />
          {/*  <TextInput
              placeholder="maxValue"
              value={custommaxValue}
              onChangeText={value => {
                const v = value ? value : undefined;
                setCustommaxValue(v);
                if (v) updateMonthlyBudget(budget._id, {maxValue: Number(v)});
              }}
              style={MonthlyBudgetStyles.SecondaryPayText}
              keyboardType="numeric"
            /> */}

          <View
            style={{
              width: Dimensions.get('window').width * 0.7,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: PixelRatio.roundToNearestPixel(14),
              overflow: 'hidden',
            }}>
            <Animated.View
              style={{
                width: load,
                height: PixelRatio.roundToNearestPixel(14),
                backgroundColor: expenseColor,
              }}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
