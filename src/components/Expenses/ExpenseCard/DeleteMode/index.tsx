import {TouchableOpacity} from 'react-native';
import FAicons from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../../../utils';
import {PixelRatio} from 'react-native';
import {ExpenseDBI} from '../../../../database/Data/ExpenseDB';
import {useDBContext} from '../../../../database/DBContext';

interface DeleteModeProps {
  deleteMode: boolean;
  expense: ExpenseDBI;
  expenses: ExpenseDBI[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseDBI[]>>;
}

const DeleteMode = ({deleteMode, expense}: DeleteModeProps) => {
  const {
    funcs: {
      delete: {deleteExpenseCard},
    },
    setStates: {setExpenses, setMonthlyBudgets},
    states: {expenses, monthlyBudgets},
  } = useDBContext();

  return (
    deleteMode && (
      <TouchableOpacity
        onPress={() => {
          const ID = expense.id;
          const newExpenses = expenses.filter(e => e.id !== ID);
          const newMonthlyBudgets = monthlyBudgets.map(mb => {
            if (mb._id.toString() === expense.currMonthID.toString()) {
              mb.currentValue -= expense.value;
            }
            return mb;
          });
          setExpenses(newExpenses);
          setMonthlyBudgets(newMonthlyBudgets);

          deleteExpenseCard(ID);
        }}
        style={{
          position: 'absolute',
          right: PixelRatio.roundToNearestPixel(12),
        }}>
        <FAicons name="trash" size={34} color={Colors.white(0.7)} />
      </TouchableOpacity>
    )
  );
};

export default DeleteMode;
