import {StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {Colors} from '../../../utils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const cardHeight = windowHeight * 0.1;
export const extendedWidth = windowWidth * 0.9;
export const normalWidth = windowWidth * 0.28;

export const ExpenseCardStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: PixelRatio.roundToNearestPixel(8),
    backgroundColor: Colors.TransparentGrey,
    height: cardHeight,
    overflow: 'hidden',
    borderWidth: 1,
  },
  Container: {
    height: cardHeight,
    justifyContent: 'center',
  },
  BillNameText: {
    color: 'white',
    fontSize: PixelRatio.roundToNearestPixel(16),
    fontFamily: 'Mukta-ExtraBold',
  },
  BillCardAmount: {
    color: 'white',
    fontSize: PixelRatio.roundToNearestPixel(16),
    fontFamily: 'Mukta-ExtraLight',
    lineHeight: PixelRatio.roundToNearestPixel(20),
  },
  CenterLoad: {
    borderRadius: PixelRatio.roundToNearestPixel(4),
    overflow: 'hidden',
    backgroundColor: Colors.white(0.3),
    height: PixelRatio.roundToNearestPixel(14),
    alignSelf: 'center',
  },
});
