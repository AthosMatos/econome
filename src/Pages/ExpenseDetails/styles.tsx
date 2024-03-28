import Gradient from '../../components/Gradient';
import {vec} from '@shopify/react-native-skia';
import {useEffect, useState} from 'react';
import Reanimated, {SharedValue} from 'react-native-reanimated';
import {PixelRatio, StatusBar, Text, TextInput, View} from 'react-native';
import {Colors, formatMoney} from '../../utils';
import {Dimensions} from 'react-native';
import {useDBContext} from '../../database/DBContext';
import CurrencyInput from 'react-native-currency-input';
import {useExpenseDetails} from './context';

interface ImageGradientProps {
  children?: any;
}

export const ImageGradient = (props: ImageGradientProps) => {
  const {windowHeight, windowWidth, colors, expense} = useExpenseDetails();

  /*    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
       useEffect(() => {
           const w = Image.resolveAssetSource(img).width
           const h = Image.resolveAssetSource(img).height
   
           //adatpt so that the image has the same height as the screen
           const newHeight = windowHeight
           const newWidth = (w * newHeight) / h
   
           setImageSize({ width: newWidth, height: newHeight });
       }, [img]); */

  return (
    <>
      {expense.img && (
        <Reanimated.Image
          source={{
            uri: expense.img,
          }}
          style={{
            height: windowHeight + (StatusBar.currentHeight ?? 0),
            width: windowWidth,
            alignSelf: 'center',
            position: 'absolute',
          }}
        />
      )}
      <Gradient
        rect={{
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowHeight + (StatusBar.currentHeight ?? 0),
        }}
        gradient={{
          colors: colors,
          start: vec(0, windowHeight / 4),
          end: vec(0, windowHeight + (StatusBar.currentHeight ?? 0)),
        }}
        CanvasHeight={windowHeight + (StatusBar.currentHeight ?? 0)}
        CanvasWidth={windowWidth}
        CanvasStyle={{
          backgroundColor: '#000000a3',
          width: windowWidth,
          height: windowHeight + (StatusBar.currentHeight ?? 0),
          position: 'absolute',
        }}
      />

      {props.children}
    </>
  );
};

interface MonthProps {
  month: string;
}
export const Month = ({month}: MonthProps) => {
  return (
    <View
      style={{
        marginBottom: PixelRatio.roundToNearestPixel(-12),
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: PixelRatio.roundToNearestPixel(48),
          fontFamily: 'Mukta-Light',
        }}>
        {month}
      </Text>
    </View>
  );
};

export const ExpenseName = () => {
  const {expense} = useExpenseDetails();
  const [name, setName] = useState(expense.name);
  const {
    funcs: {
      update: {updateExpense},
    },
  } = useDBContext();

  useEffect(() => {
    if (name != expense.name) {
      updateExpense(expense.id, {name});
    }
  }, [name]);

  return (
    <View
      style={{
        marginTop: PixelRatio.roundToNearestPixel(-12),
        marginBottom: PixelRatio.roundToNearestPixel(-18),
        height: PixelRatio.roundToNearestPixel(66),
      }}>
      <TextInput
        placeholder="Nome"
        placeholderTextColor={Colors.white(0.26)}
        onChange={e => {
          setName(e.nativeEvent.text);
        }}
        value={name}
        style={{
          color: 'white',
          fontSize: PixelRatio.roundToNearestPixel(32),
          fontFamily: 'Mukta-Bold',
          left: -Dimensions.get('window').width * 0.01,
        }}
      />
    </View>
  );
};

export const ExpenseMoney = () => {
  const {expense, setExpense} = useExpenseDetails();
  const {
    funcs: {
      update: {updateExpense},
    },
  } = useDBContext();
  const [maxV, setMaxValue] = useState(expense.maxValue);

  useEffect(() => {
    if (maxV != expense.maxValue) {
      updateExpense(expense.id, {maxValue: maxV});
      const newExpense = {...expense, maxValue: maxV};
      setExpense(newExpense);
    }
  }, [maxV]);

  return (
    <View
      style={{
        marginTop: PixelRatio.roundToNearestPixel(-6),
        marginBottom: PixelRatio.roundToNearestPixel(-18),
        flexDirection: 'row',
        gap: PixelRatio.roundToNearestPixel(8),
        overflow: 'hidden',
        height: PixelRatio.roundToNearestPixel(40),
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: PixelRatio.roundToNearestPixel(24),
          fontFamily: 'Mukta-ExtraLight',
        }}>
        {formatMoney(expense.value)}
      </Text>
      <Text
        style={{
          color: 'white',
          fontSize: PixelRatio.roundToNearestPixel(24),
          fontFamily: 'Mukta-ExtraLight',
        }}>
        -
      </Text>

      <CurrencyInput
        placeholder="maxValue"
        value={maxV ?? 0}
        onChangeValue={value => {
          value && setMaxValue(value);
        }}
        prefix="R$"
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        style={{
          color: Colors.white(0.4),
          fontSize: PixelRatio.roundToNearestPixel(24),
          marginBottom: PixelRatio.roundToNearestPixel(-10),
          fontFamily: 'Mukta-ExtraLight',
        }}
      />
    </View>
  );
};
