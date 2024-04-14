import {PixelRatio, Text, View} from 'react-native';
import {ExpenseCardStyles} from '../styles';
import {ExpenseDBI} from '../../../database/Data/ExpenseDB';
import {formatMoney} from '../../../utils';
interface ExpenseInfoProps {
  expense: ExpenseDBI;
}

const ExpenseInfo = ({expense}: ExpenseInfoProps) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        marginLeft: PixelRatio.roundToNearestPixel(8),
      }}>
      <Text style={ExpenseCardStyles.BillNameText}>
        {expense.name.length > 8
          ? `${expense.name.substring(0, 8)}...`
          : expense.name}
      </Text>
      <Text style={ExpenseCardStyles.BillCardAmount}>
        {formatMoney(expense.value)}
      </Text>
    </View>
  );
};

export default ExpenseInfo;
