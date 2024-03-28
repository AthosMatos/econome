import {Image} from 'react-native';
import {ExpenseDBI} from '../../../../database/Data/ExpenseDB';
import {cardHeight, extendedWidth, normalWidth} from '../styles';
import {useToolBarContext} from '../../../../context/ToolBarContext';

interface BackImgProps {
  expense: ExpenseDBI;
}

const BackImg = ({expense}: BackImgProps) => {
  const {
    states: {extendedCards},
  } = useToolBarContext();
  return (
    expense?.img && (
      <Image
        source={{uri: expense.img}}
        style={[
          {
            position: 'absolute',
            opacity: 0.36,
            transform: [{rotate: '10deg'}, {scale: 1.4}],
            width: (extendedCards ? extendedWidth : normalWidth) + 60,
            height: cardHeight,
          },
        ]}
        resizeMode={'cover'}
      />
    )
  );
};

export default BackImg;
