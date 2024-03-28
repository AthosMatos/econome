import {useObject, useQuery, useRealm} from '@realm/react';
import {createContext, useContext, useEffect, useState} from 'react';
import {BSON} from 'realm';
import {ExpenseDB, ExpenseDBI} from '../../../database/Data/ExpenseDB';
import {useDBContext} from '../../../database/DBContext';
import {BillDB, BillDBI} from '../../../database/Data/BillDB';
import {getBackColors} from '../../../utils';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';

interface ExpenseDetailsContextType {
  expenseID: BSON.ObjectID;
  currMonthID: BSON.ObjectID;
  expense: ExpenseDBI;
  thisExpenseBills: BillDBI[];
  colors: any;
  windowWidth: number;
  windowHeight: number;
  setExpense: React.Dispatch<React.SetStateAction<ExpenseDBI>>;
  setThisExpenseBills: React.Dispatch<React.SetStateAction<BillDBI[]>>;
}

const ExpenseDetailsContext = createContext<
  ExpenseDetailsContextType | undefined
>(undefined);

interface ExpenseDetailsProviderProps {
  children: React.ReactNode;
  expenseID: BSON.ObjectID;
  currMonthID: BSON.ObjectID;
}

export const ExpenseDetailsProvider = ({
  children,
  expenseID,
  currMonthID,
}: ExpenseDetailsProviderProps) => {
  const {
    funcs: {
      get: {getExpense, getBills},
    },
  } = useDBContext();
  const [expense, setExpense] = useState(getExpense(expenseID)!);
  const [thisExpenseBills, setThisExpenseBills] = useState(getBills(expenseID));

  const color1 = useSharedValue('#000000');
  const color2 = useSharedValue('#000000');
  const color3 = useSharedValue('#000000');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const colors = useDerivedValue(() => {
    return [color1.value, color2.value, color3.value];
  });

  function applyOpacity(hex: string, opacity: number) {
    return hex + opacity.toString(16);
  }

  const timingConfig = {
    duration: 1000,
  };

  useEffect(() => {
    if (expense.img) {
      getBackColors(expense.img).then(res => {
        color1.value = withTiming('#000000be', timingConfig);
        color2.value = withTiming(applyOpacity(res.vibrant, 100), timingConfig);
        color3.value = withTiming('#0000008f', timingConfig);
      });
    }
  }, [expense.img]);

  return (
    <ExpenseDetailsContext.Provider
      value={{
        colors,
        windowWidth,
        windowHeight,
        expenseID,
        expense,
        thisExpenseBills,
        currMonthID,
        setExpense,
        setThisExpenseBills,
      }}>
      {children}
    </ExpenseDetailsContext.Provider>
  );
};

export const useExpenseDetails = () => {
  const context = useContext(ExpenseDetailsContext);
  if (context === undefined) {
    throw new Error(
      'useExpenseDetails must be used within a ExpenseDetailsProvider',
    );
  }
  return context;
};
