import Gradient from "../../components/Gradient"
import { vec } from "@shopify/react-native-skia"
import { useEffect, useState } from "react";
import Reanimated, { SharedValue } from "react-native-reanimated"
import { PixelRatio, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Colors, formatMoney } from "../../utils";
import { useAppContext } from "../../context/appContext";
import CurrencyInput from "react-native-currency-input";
import { Dimensions } from 'react-native'

interface ImageGradientProps {
    img: any;
    windowHeight: number;
    windowWidth: number;
    colors: SharedValue<string[]>;
    children?: any;
}


export const ImageGradient = (props: ImageGradientProps) => {
    const { img, windowHeight, windowWidth, colors } = props;

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
            {img && <Reanimated.Image
                source={img}
                style={{
                    height: windowHeight,
                    alignSelf: 'center',
                    position: 'absolute',
                }} />}
            <Gradient
                rect={
                    {
                        x: 0,
                        y: 0,
                        width: windowWidth,
                        height: windowHeight,
                    }
                }
                gradient={
                    {
                        colors: colors,
                        start: vec(0, windowHeight / 4),
                        end: vec(0, windowHeight),
                    }
                }
                CanvasHeight={windowHeight}
                CanvasWidth={windowWidth}
                CanvasStyle={{
                    backgroundColor: '#000000a3',
                    width: windowWidth,
                    height: windowHeight,
                    position: 'absolute',
                }} />

            {props.children}
        </>
    )
}


export const Month = ({ month }: { month: string }) => {

    return (
        <View style={{
            marginBottom: PixelRatio.roundToNearestPixel(-12),
        }}>
            <Text style={{
                color: 'white',
                fontSize: PixelRatio.roundToNearestPixel(48),
                fontFamily: 'Mukta-Light',
            }} >
                {month}
            </Text>

        </View>
    )
}
export const BillName = ({ billName, id }: { billName: string, id: number }) => {
    const [customName, setCustomName] = useState<string>(billName)
    const { funcs } = useAppContext()

    useEffect(() => {
        if (customName) {
            funcs.editBill(id, customName)
        }
    }, [customName])
    return (
        <View style={{
            marginTop: PixelRatio.roundToNearestPixel(-12),
            marginBottom: PixelRatio.roundToNearestPixel(-18),
            height: PixelRatio.roundToNearestPixel(66),
        }}>
            <TextInput
                placeholder="Nome"
                placeholderTextColor={Colors.white(0.26)}
                onChange={(e) => setCustomName(e.nativeEvent.text)}
                value={customName}
                style={{
                    color: 'white',
                    fontSize: PixelRatio.roundToNearestPixel(32),
                    fontFamily: 'Mukta-Bold',
                    left: -Dimensions.get('window').width * 0.01,
                }} />

        </View>
    )
}

export const BillMoney = ({ value, maxBill, id }: { value: number, maxBill: number, id: number }) => {

    return (
        <View style={{
            marginTop: PixelRatio.roundToNearestPixel(-12),
            marginBottom: PixelRatio.roundToNearestPixel(-18),
            height: PixelRatio.roundToNearestPixel(66),
            flexDirection: 'row',
            gap: PixelRatio.roundToNearestPixel(16),
        }}>
            <Text
                style={{
                    color: 'white',
                    fontSize: PixelRatio.roundToNearestPixel(32),
                    fontFamily: 'Mukta-ExtraLight',
                }}
            >
                {formatMoney(value)}
            </Text>
            <Text
                style={{
                    color: 'white',
                    fontSize: PixelRatio.roundToNearestPixel(32),
                    fontFamily: 'Mukta-ExtraLight',
                }}
            >
                -
            </Text>
            <Text
                style={{
                    color: Colors.white(0.4),
                    fontSize: PixelRatio.roundToNearestPixel(32),
                    fontFamily: 'Mukta-ExtraLight',
                }}
            >
                {formatMoney(maxBill)}
            </Text>
        </View>
    )
}
