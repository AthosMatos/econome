import React, {useState, useEffect} from 'react';
import {
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Colors} from '../../../../../utils';
import CurrencyInput from 'react-native-currency-input';
import {MovableExpense} from '../../../../../components/MovableExpense';
import {BillDBI} from '../../../../../database/Data/BillDB';
import {useDBContext} from '../../../../../database/DBContext';
import {useExpenseDetails} from '../../../context';
import Animated from 'react-native-reanimated';
import FaIcons from 'react-native-vector-icons/FontAwesome5';
import {BillCardStyles} from './styles';

interface BillCardProps {
  Bill: BillDBI;
}

export const BillCard = ({Bill}: BillCardProps) => {
  const {
    funcs: {
      update: {updateBill},
      delete: {deleteBill},
    },
  } = useDBContext();
  const {expense, setThisExpenseBills, thisExpenseBills, setExpense} =
    useExpenseDetails();

  const [billName, setBillName] = useState<string>(Bill.name);
  const [billValue, setBillValue] = useState<number | null>(Bill.value);

  useEffect(() => {
    if (Bill.name != billName) {
      updateBill(Bill.id, {name: billName});
      const newBills = thisExpenseBills.map(b => {
        if (b.id == Bill.id) {
          return {...b, name: billName};
        }
        return b;
      });
      setThisExpenseBills(newBills);
    }
    if (Bill.value != billValue && billValue) {
      updateBill(Bill.id, {value: billValue});
      const newBills = thisExpenseBills.map(b => {
        if (b.id == Bill.id) {
          return {...b, value: billValue};
        }
        return b;
      });
      setThisExpenseBills(newBills);
      const newExpenseValue = newBills.reduce((acc, b) => acc + b.value, 0);
      setExpense({...expense, value: newExpenseValue});
    }
  }, [billName, billValue]);

  const windowWidth = Dimensions.get('window').width * 0.4;
  const ContainerWidth = windowWidth - PixelRatio.roundToNearestPixel(32);

  return (
    <Animated.View style={BillCardStyles.ExpenseCardContainer}>
      <TextInput
        placeholder="Nome"
        placeholderTextColor={Colors.white(0.26)}
        onChange={e => {
          setBillName(e.nativeEvent.text);
        }}
        value={billName}
        style={BillCardStyles.text}
      />

      <MovableExpense
        ContainerWidth={ContainerWidth}
        Bill={billValue ?? 0}
        MaxBill={expense.maxValue}
      />
      <CurrencyInput
        placeholder="Valor"
        value={billValue}
        onChangeValue={value => setBillValue(value)}
        prefix="R$"
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        style={BillCardStyles.text}
      />

      <TouchableOpacity
        onPress={() => {
          const newBills = thisExpenseBills.filter(b => b.id != Bill.id);
          setThisExpenseBills(newBills);
          deleteBill(Bill.id);
        }}>
        <FaIcons name="trash" size={24} color={Colors.white(0.4)} />
      </TouchableOpacity>
    </Animated.View>
  );
};
