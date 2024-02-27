import React, { useEffect } from 'react';
import { ColorPickerStyles } from './styles';
import Ball from './components/ball';
import BrightnessSlider from './components/brightnessSlider';
import { ColorPickerProvider } from './components/context';
import ColorCircle from './components/ColorCircle';
import { SharedValue } from 'react-native-reanimated';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


interface ColorPickerProps {
  handleColorSelected: (ball1: string | null, ball2: string | null) => void;
  width: number;
  Color1: SharedValue<string>;
  Color2: SharedValue<string>;
}

const ColorPicker = (props: ColorPickerProps) => {
  const { handleColorSelected, width, Color1, Color2 } = props;

  const circlePathRadius = width * 0.5;
  const strokeWidth = 8;

  return (
    <GestureHandlerRootView>
      <ColorPickerProvider
        handleColorSelected={handleColorSelected}
        Color1={Color1}
        Color2={Color2}
        circlePathRadius={circlePathRadius}
      >

        <View style={[ColorPickerStyles.container, {
          width: width,
          height: width,
        }]}>
          <ColorCircle
            strokeWidth={strokeWidth}
            width={width} />

          <Ball ballNumber={1} />
          <Ball ballNumber={2} />

          <BrightnessSlider
          />

        </View>


      </ColorPickerProvider>
    </GestureHandlerRootView>


  );
}



export default ColorPicker;