import React, { useCallback, useEffect, useState, } from "react"
import { StatusBar as RNStatusBar, Text, InteractionManager, View, Dimensions } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, } from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"
import { useThemeContext } from "../../context/themeContext";
import { Wave } from 'react-native-animated-spinkit'
import Reanimated from "react-native-reanimated"
import GradientBackground from "../GradientBackground";
import { vec } from "@shopify/react-native-skia";

interface LazyLoadingPlaceHolderProps {
    StatusBarcolor?: string;
    StatusBarStyle?: 'light-content' | 'dark-content';
    children: any;
}

export const LazyLoadingPlaceHolder = ({ StatusBarcolor, StatusBarStyle, children }: LazyLoadingPlaceHolderProps) => {
    const [show, setshow] = useState(false)
    const { states: { colors }, } = useThemeContext()
    const opacityPlaceholder = useSharedValue(0)
    const opacityChil = useSharedValue(0)

    useFocusEffect(
        useCallback(() => {

            /* if(!StatusBarcolor)RNStatusBar.setBackgroundColor(TerciaryColor,true)
            else RNStatusBar.setBackgroundColor(StatusBarcolor,true)

            if(StatusBarStyle)RNStatusBar.setBarStyle(StatusBarStyle,true)
            else RNStatusBar.setBarStyle('dark-content',true) */

            opacityPlaceholder.value = withTiming(1, { duration: 1000 })

            setTimeout(() => {
                InteractionManager.runAfterInteractions(() => {
                    opacityChil.value = withTiming(1, { duration: 1000 })
                    setshow(true)
                })
            }, 1000);



        }, [])
    )


    const ChildremAnimStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0,0,0,${opacityChil.value})`,
        }
    })
    const PlaceHolderAnimStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0,0,0,${opacityPlaceholder.value})`,
        }
    })



    return (
        <>
            {
                !show ?

                    <View

                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            backgroundColor: colors.value[0]
                        }}
                    >

                        <Reanimated.View
                            style={PlaceHolderAnimStyles}>
                            <Wave size={100} color={'white'} />
                        </Reanimated.View>
                    </View>
                    :
                    <Reanimated.View
                        style={ChildremAnimStyles}>
                        {children}
                    </Reanimated.View>
            }
        </>
    )
}


