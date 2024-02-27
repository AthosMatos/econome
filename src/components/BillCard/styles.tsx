import {
    StyleSheet,
    PixelRatio,
    StyleProp,
    ViewStyle
} from 'react-native'
import { AnimatedStyle, SharedValue, StyleProps } from 'react-native-reanimated'
import { Colors } from '../../utils'

export function loadContainerStyle(width: number): StyleProps {
    return {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: PixelRatio.roundToNearestPixel(60),
        marginTop: PixelRatio.roundToNearestPixel(2),
        width: width,
        overflow: 'hidden',
    }
}
export function loadBarStyle(loaded: number, height: number): StyleProps {
    return {
        position: 'absolute',
        height: height * 0.3,
        width: loaded,
        backgroundColor: 'red',
    }
}



export const BillCardStyles = StyleSheet.create({
    BillNameText: {
        color: 'white',
        fontSize: PixelRatio.roundToNearestPixel(16),
        fontFamily: 'Mukta-ExtraBold',
    },
    BillCardAmount: {
        color: 'white',
        fontSize: PixelRatio.roundToNearestPixel(16),
        fontFamily: 'Mukta-ExtraLight',
        lineHeight: PixelRatio.roundToNearestPixel(20),
    },
    CenterLoad:
    {
        borderRadius: PixelRatio.roundToNearestPixel(4),
        overflow: 'hidden',
        backgroundColor: Colors.white(0.3),
        height: PixelRatio.roundToNearestPixel(20),
        flex: 1,
    }
})