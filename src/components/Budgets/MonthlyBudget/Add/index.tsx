import {
  Dimensions,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, months} from '../../../../utils';
import {MonthlyBudgetDBI} from '../../../../database/Data/MonthlyBudgetDB';
import {BSON} from 'realm';
import {useDBContext} from '../../../../database/DBContext';
import {AddBudgetStyles} from './styles';
import {MonthlyBudgetStyles} from '../styles';
import Animated, {
  LinearTransition,
  SequencedTransition,
} from 'react-native-reanimated';

interface AddMonthlyBudgetProps {
  monthlyBudgets: MonthlyBudgetDBI[];
  setMonthlyBudgets: React.Dispatch<React.SetStateAction<MonthlyBudgetDBI[]>>;
}

export const AddMonthlyBudget = ({
  monthlyBudgets,
  setMonthlyBudgets,
}: AddMonthlyBudgetProps) => {
  const {
    funcs: {
      add: {addMonthlyBudget},
    },
    setStates: {setCurrMonthID},
  } = useDBContext();

  function getNextMonthAndYear() {
    //get the next month and year based on the last month from the monthlyBudgets
    if (monthlyBudgets.length === 0) {
      return {nextMonth: months[0], nextYear: new Date().getFullYear()};
    } else {
      const lastMonth = monthlyBudgets[monthlyBudgets.length - 1];
      const lastMonthIndex = months.indexOf(lastMonth.month);
      const nextMonthIndex = lastMonthIndex + 1;
      const nextYear = lastMonth.year + (nextMonthIndex === 0 ? 1 : 0);
      const nextMonth = months[nextMonthIndex % 12];
      return {nextMonth, nextYear};
    }
  }
  return (
    <Animated.View style={AddBudgetStyles.root}>
      <TouchableOpacity
        onPress={() => {
          const {nextMonth, nextYear} = getNextMonthAndYear();
          const newBudget: MonthlyBudgetDBI = {
            _id: new BSON.ObjectID(),
            currentValue: 0,
            maxValue: 1000,
            month: nextMonth,
            year: nextYear,
          };
          setMonthlyBudgets([...monthlyBudgets, newBudget]);
          setCurrMonthID(newBudget._id);
          addMonthlyBudget(newBudget);
        }}
        style={[MonthlyBudgetStyles.InnerBorder, AddBudgetStyles.InnerBorder]}>
        <Text
          style={[
            MonthlyBudgetStyles.MonthText,
            {
              color: 'rgba(255,255,255,0.5)',
            },
          ]}>
          Adicionar Mes
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
