import {PixelRatio, ScrollView} from 'react-native';
import React from 'react';
import {BillCard} from './BillCard';
import {useExpenseDetails} from '../../context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AddBillCard} from './BillCard/Add';

const BillList = () => {
  const gap = PixelRatio.roundToNearestPixel(15);

  const {expenseID, thisExpenseBills} = useExpenseDetails();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GestureHandlerRootView
        style={{
          alignItems: 'center',
          marginTop: gap * 2,
          gap: gap,
        }}>
        {thisExpenseBills.map(item => (
          <BillCard key={item.id.toString()} Bill={item} />
        ))}
        <AddBillCard />
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default BillList;
