import {Dimensions, PixelRatio} from 'react-native';
import {Colors} from '../../../utils';
import {StyleSheet} from 'react-native';

export const MonthlyBudgetStyles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  InnerBorder: {
    borderWidth: PixelRatio.roundToNearestPixel(3),
    borderRadius: PixelRatio.roundToNearestPixel(18),
    width: Dimensions.get('window').width * 0.88,
    height: PixelRatio.roundToNearestPixel(200),
    backgroundColor: 'rgba(12, 12, 12, 0.36)',
  },
  MainPayText: {
    fontFamily: 'Mukta-ExtraLight',
    color: '#FFF',
    fontSize: 60,
  },
  MainInfoContainer: {
    flexDirection: 'row',
    marginBottom: PixelRatio.roundToNearestPixel(-22),
    gap: PixelRatio.roundToNearestPixel(6),
  },
  MainInfoAninWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: PixelRatio.roundToNearestPixel(200),
  },
  SecondaryPayText: {
    marginTop: PixelRatio.roundToNearestPixel(-30),
    marginBottom: PixelRatio.roundToNearestPixel(-8),
    fontFamily: 'Mukta-Regular',
    color: Colors.softRed,
    fontSize: 18,
  },
  MonthText: {
    fontFamily: 'Mukta-ExtraLight',
    color: '#FFF',
    fontSize: 30,
  },
  yearText: {
    fontFamily: 'Mukta-Bold',
    color: '#FFF',
    fontSize: 24,
    marginTop: PixelRatio.roundToNearestPixel(6),
  },
  delete: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.88,
    height: PixelRatio.roundToNearestPixel(100),
  },
});
