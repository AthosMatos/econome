import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { useCallback } from 'react';
import { getBackColors } from './BackColors';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../context/appContext';
import { useState } from 'react';

interface BillPageI {
  img: any;
}

export const useBillPage = (props: BillPageI) => {
  const { img } = props;
  const color1 = useSharedValue('#000000');
  const color2 = useSharedValue('#000000');
  const color3 = useSharedValue('#000000');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const { funcs } = useAppContext()

  const colors = useDerivedValue(() => {
    return [color1.value, color2.value, color3.value];
  });


  function applyOpacity(hex: string, opacity: number) {
    return hex + opacity.toString(16);
  }

  const timingConfig = {
    duration: 1000,
  };

  useFocusEffect(
    useCallback(() => {

      if (img) {

        getBackColors(img).then(res => {
          color1.value = withTiming('#000000be', timingConfig)
          color2.value = withTiming(applyOpacity(res.vibrant, 100), timingConfig)
          color3.value = withTiming('#0000008f', timingConfig)
        });
      }

      //return () => unsubscribe();
    }, [])
  );


  return {
    img,
    colors,
    windowWidth,
    windowHeight,

  };
};
