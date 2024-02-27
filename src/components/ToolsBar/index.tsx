import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, PixelRatio, Dimensions } from 'react-native';
import IoIcons from 'react-native-vector-icons/Ionicons';
import DropShadow from 'react-native-drop-shadow';
import { DefaultModal } from '../../Pages/Home/styles';
import GradientBackground from '../GradientBackground';
import ColorPicker from '../ColorPicker';
import { useThemeContext } from '../../context/themeContext';
import { vec } from '@shopify/react-native-skia';
import { useToolBarContext } from '../../context/ToolBarContext';


const ToolBar = () => {
    const { states: { colors, color2, openColorPicker, color1 }, setStatesFuncs: { setOpenColorPicker }, funcs: { handleColorSelected } } = useThemeContext()
    const { states: { extendedCards }, stateFuncs: { setExtendedCards } } = useToolBarContext()

    return (
        <>
            <DefaultModal
                open={openColorPicker}
                setOpen={setOpenColorPicker}
            >
                <GradientBackground
                    gradient={{
                        colors: colors,
                        end: vec(Dimensions.get('window').width, Dimensions.get('window').height * 0.5),
                        start: vec(0, 0),
                    }}
                    width={Dimensions.get('window').width * 0.9}
                    height={Dimensions.get('window').height * 0.5}
                    ContainerStyle={{ borderRadius: 20, borderWidth: PixelRatio.getPixelSizeForLayoutSize(0.5), borderColor: '#ffffff' }}
                    style={{ alignItems: 'center', justifyContent: 'center', }}
                >
                    <ColorPicker
                        handleColorSelected={handleColorSelected}
                        Color1={color1}
                        Color2={color2}
                        width={Dimensions.get('window').width * 0.8}
                    />
                </GradientBackground>
            </DefaultModal>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: PixelRatio.roundToNearestPixel(14),
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => setOpenColorPicker(true)}>
                    <IoIcons
                        name='color-palette'
                        size={30}
                        color='#ffffff6f'
                    />
                </TouchableOpacity>
                <View style={{
                    flexDirection: 'row',
                    gap: PixelRatio.roundToNearestPixel(10),
                    alignItems: 'center',
                    marginRight: PixelRatio.roundToNearestPixel(10),
                }}>

                    <TouchableOpacity
                        onPress={() => {
                            setExtendedCards(false);
                        }}
                    >
                        <DropShadow

                            style={{
                                shadowColor: "#ffffff",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: extendedCards ? 0 : 0.94,
                                shadowRadius: 5,

                            }}>

                            <IoIcons
                                name='grid'
                                size={30}
                                color={extendedCards ? '#ffffff2f' : 'white'}
                            />
                        </DropShadow>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setExtendedCards(true);
                        }}
                    >
                        <DropShadow
                            style={{
                                shadowColor: "#ffffff",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: extendedCards ? 0.94 : 0,
                                shadowRadius: 5,
                            }}>

                            <IoIcons
                                name='list'
                                size={40}
                                color={extendedCards ? 'white' : '#ffffff2f'}
                            />
                        </DropShadow>

                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default ToolBar;