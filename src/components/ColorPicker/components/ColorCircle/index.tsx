import { View, Image } from 'react-native';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ColorPickerStyles } from '../../styles';
import { useColorPickerContext } from '../context';

interface ColorCircleProps {
    strokeWidth: number;
    width: number;
}

const ColorCircle = (props: ColorCircleProps) => {
    const { strokeWidth, width } = props;
    const {
        lightness1,
        lightness2,
        saturationCircle1,
        saturationCircle2,
        OpacityCircle1,
        OpacityCircle2,
        lastPressedBall
    } = useColorPickerContext();

    const ColorCircleBrightnessAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor: `hsl(0, 0%, ${lastPressedBall.value === '1' ? lightness1.value : lightness2.value}%)`,
            opacity: lastPressedBall.value === '1' ? OpacityCircle1.value : OpacityCircle2.value,
        };
    });

    const ColorCircleSaturationAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor: `rgba(128, 128, 128,${lastPressedBall.value === '1' ? saturationCircle1.value : saturationCircle2.value})`
        };
    });

    return (
        <>
            <View style={ColorPickerStyles.pathCircle}>
                <Image source={require('../../../../assets/images/colorWheel.png')} style={{ width: width, height: width }} />
            </View>

            <Reanimated.View style={[ColorPickerStyles.pathCircle, {
                height: width,
                width: width,
                borderWidth: strokeWidth + 1,
                backgroundColor: 'transparent',

            }, ColorCircleBrightnessAnimStyle]} />
            <Reanimated.View style={[ColorPickerStyles.pathCircle, {
                height: width,
                width: width,
                borderWidth: strokeWidth + 1,
                backgroundColor: 'transparent',
            }, ColorCircleSaturationAnimStyle]} />
        </>


    )
}

export default ColorCircle;