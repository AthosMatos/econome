import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
import {Colors} from '../../../../utils';

export const AddBudgetStyles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  InnerBorder: {
    borderColor: Colors.softBackground(1),
    borderWidth: 1,
    borderStyle: 'dashed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.88,
    height: PixelRatio.roundToNearestPixel(200),
  },
  MonthText: {
    fontSize: 24,
  },
});
