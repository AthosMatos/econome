import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, PixelRatio, Dimensions} from 'react-native';
import IoIcons from 'react-native-vector-icons/Ionicons';
import DropShadow from 'react-native-drop-shadow';
import {DefaultModal} from '../../Pages/Home/styles';
import GradientBackground from '../GradientBackground';
import {useThemeContext} from '../../context/themeContext';
import {vec} from '@shopify/react-native-skia';
import {useToolBarContext} from '../../context/ToolBarContext';
import ColorWheel from '../ColorPicker/colorsP';

import Animated from 'react-native-reanimated';

const AnimatedDropShadow = Animated.createAnimatedComponent(DropShadow);
const AnimatedIoIcons = Animated.createAnimatedComponent(IoIcons);

const ToolBar = () => {
  const {
    states: {openColorPicker, colors, bottomTextColor},
    setStatesFuncs: {setOpenColorPicker},
  } = useThemeContext();
  const {
    states: {extendedCards},
    stateFuncs: {setExtendedCards},
  } = useToolBarContext();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: PixelRatio.roundToNearestPixel(14),
        alignItems: 'center',
      }}>
      <DefaultModal open={openColorPicker} setOpen={setOpenColorPicker}>
        <GradientBackground
          gradient={{
            colors: colors,
            end: vec(
              Dimensions.get('window').width,
              Dimensions.get('window').height * 0.5,
            ),
            start: vec(0, 0),
          }}
          width={Dimensions.get('window').width * 0.9}
          height={Dimensions.get('window').height * 0.5}
          ContainerStyle={{
            borderRadius: 20,
            borderWidth: PixelRatio.getPixelSizeForLayoutSize(0.5),
            borderColor: '#ffffff',
          }}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <ColorWheel />
        </GradientBackground>
      </DefaultModal>
      <TouchableOpacity onPress={() => setOpenColorPicker(true)}>
        <AnimatedIoIcons
          name="color-palette"
          size={30}
          color={bottomTextColor}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          gap: PixelRatio.roundToNearestPixel(10),
          alignItems: 'center',
          marginRight: PixelRatio.roundToNearestPixel(10),
        }}>
        <TouchableOpacity
          onPress={() => {
            setExtendedCards(false);
          }}>
          <AnimatedDropShadow
            style={{
              shadowColor: bottomTextColor,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: extendedCards ? 0 : 0.94,
              shadowRadius: 5,
              opacity: extendedCards ? 0.2 : 1,
            }}>
            <AnimatedIoIcons name="grid" size={30} color={bottomTextColor} />
          </AnimatedDropShadow>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setExtendedCards(true);
          }}>
          <AnimatedDropShadow
            style={{
              shadowColor: bottomTextColor,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: extendedCards ? 0.94 : 0,
              shadowRadius: 5,
              opacity: extendedCards ? 1 : 0.2,
            }}>
            <AnimatedIoIcons name="list" size={40} color={bottomTextColor} />
          </AnimatedDropShadow>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToolBar;
