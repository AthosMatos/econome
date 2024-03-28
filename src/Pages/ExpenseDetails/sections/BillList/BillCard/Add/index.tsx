import {Text, TouchableOpacity} from 'react-native';
import {useDBContext} from '../../../../../../database/DBContext';
import {useExpenseDetails} from '../../../../context';
import {BillDBI} from '../../../../../../database/Data/BillDB';
import {BSON} from 'realm';
import {BillCardStyles} from '../styles';

export const AddBillCard = () => {
  const {
    funcs: {
      add: {addBill},
    },
  } = useDBContext();

  const {expenseID, setThisExpenseBills, thisExpenseBills} =
    useExpenseDetails();

  return (
    <TouchableOpacity
      onPress={() => {
        const bill: BillDBI = {
          id: new BSON.ObjectId(),
          expenseID: expenseID,
          name: 'Nova Conta',
          value: 0,
        };
        setThisExpenseBills([...thisExpenseBills, bill]);
        addBill(bill);
      }}
      style={BillCardStyles.AddExpenseCardContainer}>
      <Text style={BillCardStyles.AddText}>Adicionar despesa</Text>
    </TouchableOpacity>
  );
};
