import React, {useCallback, useEffect, useState} from 'react';
import {View, PixelRatio, StyleSheet, ScrollView, Text} from 'react-native';
import {ExpenseCard} from './ExpenseCard';
import {AddExpenseCard} from './ExpenseCard/AddExpenseCard';
import {useDBContext} from '../../database/DBContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {normalWidth} from './ExpenseCard/styles';
import {useFocusEffect} from '@react-navigation/native';

const gap = PixelRatio.roundToNearestPixel(15);

const ExpensesStyles = StyleSheet.create({
  ExpensesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gap,
    width: normalWidth * 3 + gap * 2,
    paddingBottom: 120,
    alignSelf: 'center',
  },
});
const Expenses = () => {
  const {
    states: {expenses, currMonthID, loadingData},
    setStates: {setExpenses},
    funcs: {
      get: {getExpenses},
    },
  } = useDBContext();

  useFocusEffect(
    useCallback(() => {
      if (currMonthID) {
        console.log('currMonthID', currMonthID);
        const exps = getExpenses(currMonthID);
        setExpenses(exps);
      } else {
        setExpenses([]);
      }
    }, [currMonthID]),
  );

  /*  useEffect(() => {
    console.log('loadingData', loadingData);
  }, [loadingData]); */

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GestureHandlerRootView style={ExpensesStyles.ExpensesContainer}>
        {expenses.map(e => (
          <ExpenseCard
            key={e.id.toString()}
            expense={e}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        ))}
        {currMonthID && (
          <AddExpenseCard expenses={expenses} setExpenses={setExpenses} />
        )}
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default Expenses;
