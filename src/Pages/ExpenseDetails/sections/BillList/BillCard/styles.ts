import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
import {Colors} from '../../../../../utils';

export const BillCardStyles = StyleSheet.create({
  ExpenseCardContainer: {
    backgroundColor: '#00000083',
    paddingHorizontal: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(12),
    //justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: Colors.softBackground2(0.7),
    borderWidth: PixelRatio.roundToNearestPixel(1),
    height: PixelRatio.roundToNearestPixel(50),
    width: Dimensions.get('window').width * 0.92,
  },
  AddExpenseCardContainer: {
    backgroundColor: '#00000089',
    paddingHorizontal: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(12),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: Colors.softBackground2(0.7),
    borderWidth: PixelRatio.roundToNearestPixel(1),
    height: PixelRatio.roundToNearestPixel(50),
  },
  text: {
    color: 'white',
    fontFamily: 'Mukta-ExtraLight',
    fontSize: PixelRatio.roundToNearestPixel(16),
    width: Dimensions.get('window').width * 0.24,
    //backgroundColor: Colors.softBackground(0.5),
  },
  AddText: {
    color: 'white',
    fontFamily: 'Mukta-Light',
    fontSize: PixelRatio.roundToNearestPixel(16),
    //backgroundColor: Colors.softBackground(0.5),
  },
});
