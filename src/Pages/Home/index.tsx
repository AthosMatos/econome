import {
  StatusBar,
  StyleSheet,
  PixelRatio,
  Dimensions,
  View,
} from 'react-native';

import {vec} from '@shopify/react-native-skia';
import GradientBackground from '../../components/GradientBackground';
import ToolBar from '../../components/ToolsBar';
import {useThemeContext} from '../../context/themeContext';
import Budgets from '../../components/Budgets';
import Expenses from '../../components/Expenses';

const Home = () => {
  const {
    states: {colors, statusStyle},
  } = useThemeContext();

  return (
    <GradientBackground
      gradient={{
        colors: colors,
        end: vec(
          Dimensions.get('window').width,
          Dimensions.get('window').height + (StatusBar.currentHeight ?? 0),
        ),
        start: vec(0, 0),
      }}
      width={Dimensions.get('window').width}
      height={Dimensions.get('window').height + (StatusBar.currentHeight ?? 0)}
      style={{
        marginTop: StatusBar.currentHeight! * 3,
        gap: PixelRatio.roundToNearestPixel(26),
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle={statusStyle}
      />
      <Budgets />
      <ToolBar />
      <Expenses />
    </GradientBackground>
  );
};

export const HomeStyles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
  buttonsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: PixelRatio.roundToNearestPixel(14),
    gap: PixelRatio.roundToNearestPixel(14),
  },
});

export default Home;
