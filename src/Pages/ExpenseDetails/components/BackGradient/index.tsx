import {StatusBar} from 'react-native';
import Gradient from '../../../../components/Gradient';
import {useExpenseDetails} from '../../context';
import {vec} from '@shopify/react-native-skia';

interface BackGradientProps {
  width: number;
  height: number;
}

export const BackGradient = ({width, height}: BackGradientProps) => {
  const {colors} = useExpenseDetails();

  return (
    <Gradient
      rect={{
        x: 0,
        y: 0,
        width: width,
        height: height + (StatusBar.currentHeight ?? 0),
      }}
      gradient={{
        colors: colors,
        start: vec(0, width / 4),
        end: vec(0, height + (StatusBar.currentHeight ?? 0)),
      }}
      CanvasHeight={height + (StatusBar.currentHeight ?? 0)}
      CanvasWidth={width}
      CanvasStyle={{
        backgroundColor: '#000000a3',
        width: width,
        height: height + (StatusBar.currentHeight ?? 0),
        position: 'absolute',
      }}
    />
  );
};
