import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Extrapolation, interpolate, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Reanimated from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { View } from 'react-native';
import { useColorPickerContext } from "../context";
import { SliderStyle } from "./style";
import FeatherIcons from 'react-native-vector-icons/Feather'
import FaIcons from 'react-native-vector-icons/FontAwesome5'
import { PixelRatio } from "react-native";
import { getBestTextColorWorklet } from "../../utils";

const AnimatedFeathterIcons = Reanimated.createAnimatedComponent(FeatherIcons)
const AnimatedFaIcons = Reanimated.createAnimatedComponent(FaIcons)


const BrightnessSlider = () => {
    const { reverseBrightnessBall1,
        reverseBrightnessBall2,
        ContrastTextColor1,
        ContrastTextColor2,
        lightness1,
        lightness2,
        OpacityCircle1,
        OpacityCircle2,
        circlePathRadius,
        lastPressedBall,
        filledWidthBrightness1,
        filledWidthBrightness2,
        filledWidthSaturation1,
        filledWidthSaturation2,
        ballColorHSL1,
        ballColorHSL2,
        hue1,
        hue2,
        saturation1,
        saturation2,
        handleColorSelected,
        animatedTextBrightness,
        animatedTextSaturation,
        saturationCircle1,
        saturationCircle2
    } = useColorPickerContext();

    const porcentageSaturation1 = useSharedValue('0%');
    const porcentageSaturation2 = useSharedValue('0%');

    const reverseBrightnesSaturation = useSharedValue(0);
    const reverseBrightness = useSharedValue(0);

    const pressedColorBrightness = useSharedValue('rgb(181, 141, 241)');
    const pressedColorSaturation = useSharedValue('rgb(181, 141, 241)');

    const onPanUpdateWorklet = () => {
        'worklet'
        if (lastPressedBall.value === '1') {
            const colorhsl = `hsl(${hue1.value * 360}, ${saturation1.value}%, ${lightness1.value}%)`
            ballColorHSL1.value = colorhsl
            animatedTextBrightness.value = `${parseInt(lightness1.value.toString())}%`
            animatedTextSaturation.value = `${parseInt(saturation1.value.toString())}%`
            reverseBrightness.value = interpolate(lightness1.value, [0, 60], [80, 0])
            reverseBrightnesSaturation.value = interpolate(saturation1.value, [0, 60], [80, 0])

            handleColorSelected(colorhsl, null);
        }
        else {
            const colorhsl = `hsl(${hue2.value * 360}, ${saturation2.value}%, ${lightness2.value}%)`
            ballColorHSL2.value = colorhsl
            animatedTextBrightness.value = `${parseInt(lightness2.value.toString())}%`
            animatedTextSaturation.value = `${parseInt(saturation2.value.toString())}%`
            reverseBrightness.value = interpolate(lightness2.value, [0, 60], [80, 0])
            reverseBrightnesSaturation.value = interpolate(saturation2.value, [0, 60], [80, 0])

            handleColorSelected(null, colorhsl);
        }
    }

    const panbrightness = Gesture.Pan().onBegin(() => {
        pressedColorBrightness.value = withTiming('rgb(255, 224, 75)');
    }).onEnd(() => {
        pressedColorBrightness.value = withTiming('rgb(181, 141, 241)');
    }).onChange((event) => {
        const x = event.x; // Assuming it's translationX you're interested in.

        if (x >= 0 && x <= (circlePathRadius * 1.6)) {
            const start = 0;
            const end = circlePathRadius * 1.6;
            const brightness = Math.floor((x - start) / (end - start) * 100);
            const opacity = (Math.abs(50 - brightness) * 2) / 100;

            // Determine which ball is being interacted with and update shared values accordingly.
            const isBall1 = lastPressedBall.value === '1';
            const filledWidthBrightness = isBall1 ? filledWidthBrightness1 : filledWidthBrightness2;
            const lightness = isBall1 ? lightness1 : lightness2;
            const reverseBrightnessBall = isBall1 ? reverseBrightnessBall1 : reverseBrightnessBall2;
            const OpacityCircle = isBall1 ? OpacityCircle1 : OpacityCircle2;
            const ContrastTextColor = isBall1 ? ContrastTextColor1 : ContrastTextColor2;

            filledWidthBrightness.value = x; // Use withTiming for smooth updates.
            lightness.value = brightness;
            reverseBrightnessBall.value = interpolate(brightness, [0, 60], [80, 0], Extrapolation.CLAMP);
            OpacityCircle.value = opacity;

            const hueValue = isBall1 ? hue1.value : hue2.value;
            const saturationValue = isBall1 ? saturation1.value : saturation2.value;
            ContrastTextColor.value = withTiming(
                getBestTextColorWorklet(hueValue, saturationValue, lightness.value),
            );

            onPanUpdateWorklet();
        }
    })

    const pansaturation = Gesture.Pan()
        .onBegin(() => {
            pressedColorSaturation.value = withTiming('rgb(255, 224, 75)');
        })
        .onEnd(() => {
            pressedColorSaturation.value = withTiming('rgb(181, 141, 241)');
        })
        .onChange((event) => {
            const x = event.x;

            // Define the boundaries for the gesture based on the circlePathRadius
            const start = 0;
            const end = circlePathRadius * 1.6;

            // Ensure x is within the expected range
            if (x >= start && x <= end) {
                // Calculate the saturation based on the x position
                const saturation = Math.floor((x - start) / (end - start) * 100);

                // Interpolate the saturation value for the circle's visual feedback
                const saturationCircle = interpolate(saturation, [0, 100], [1, 0]);

                // Determine which ball is being pressed and update the corresponding shared values
                const isBall1 = lastPressedBall.value === '1';
                const filledWidthSaturation = isBall1 ? filledWidthSaturation1 : filledWidthSaturation2;
                const saturationValue = isBall1 ? saturation1 : saturation2;
                const percentageSaturation = isBall1 ? porcentageSaturation1 : porcentageSaturation2;
                const saturationCircleValue = isBall1 ? saturationCircle1 : saturationCircle2;
                const ContrastTextColor = isBall1 ? ContrastTextColor1 : ContrastTextColor2;

                filledWidthSaturation.value = x;
                saturationValue.value = saturation;
                percentageSaturation.value = `${saturation}%`;
                saturationCircleValue.value = saturationCircle;

                const lightness = isBall1 ? lightness1 : lightness2;
                const hueValue = isBall1 ? hue1.value : hue2.value;
                ContrastTextColor.value = withTiming(
                    getBestTextColorWorklet(hueValue, saturationValue.value, lightness.value),
                );

                onPanUpdateWorklet();
            }
        });

    const animatedStylesBrightness = useAnimatedStyle(() => ({
        backgroundColor: pressedColorBrightness.value,
        position: 'absolute',
        height: 20,
        width: lastPressedBall.value === '1' ? filledWidthBrightness1.value : filledWidthBrightness2.value,
        left: 0
    }));

    const birghtnesstViewStyle = useAnimatedStyle(() => ({
        backgroundColor: `rgba(0, 0, 0, ${reverseBrightness.value / 100})`,
    }));

    const birghtnesstViewStyle2 = useAnimatedStyle(() => ({
        backgroundColor: `rgba(0, 0, 0, ${reverseBrightnesSaturation.value / 100})`,
    }));

    const animatedStylesSaturation = useAnimatedStyle(() => ({
        backgroundColor: pressedColorSaturation.value,
        position: 'absolute',
        height: 20,
        width: lastPressedBall.value === '1' ? filledWidthSaturation1.value : filledWidthSaturation2.value,
        left: 0
    }));


    const animatedTextStyles = useAnimatedStyle(() => ({
        color: ContrastTextColor1.value
    }));



    return (
        <View style={SliderStyle.container} >
            <ReText
                text={lastPressedBall}
                style={[{
                    color: 'white',
                    fontSize: 50,
                    fontFamily: 'Mukta-ExtraBold',
                    position: 'absolute',
                    top: -circlePathRadius * 0.5,
                },
                    animatedTextStyles
                ]} />

            <View style={{
                flexDirection: 'row',
                gap: PixelRatio.roundToNearestPixel(14),
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <AnimatedFeathterIcons
                        style={animatedTextStyles}

                        name='sun'
                        size={PixelRatio.roundToNearestPixel(18)}
                        color='white' />
                    <ReText style={[{
                        color: 'white',
                        fontSize: PixelRatio.roundToNearestPixel(20),
                        fontFamily: 'Mukta-ExtraBold',
                    }, animatedTextStyles]} text={animatedTextBrightness} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                    <AnimatedFaIcons
                        style={animatedTextStyles}
                        name='tint'
                        size={PixelRatio.roundToNearestPixel(18)}
                        color='white' />
                    <ReText style={[{
                        color: 'white',
                        fontSize: PixelRatio.roundToNearestPixel(20),
                        fontFamily: 'Mukta-ExtraBold',
                    }, animatedTextStyles]} text={animatedTextSaturation} />
                </View>
            </View>


            <View style={SliderStyle.slidersContainer}>
                <GestureDetector gesture={panbrightness}>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        height: 20,
                        width: circlePathRadius * 1.6,
                        borderRadius: 500,
                        overflow: 'hidden',
                    }}>
                        <Reanimated.View style={[animatedStylesBrightness, { borderTopLeftRadius: 500, borderBottomLeftRadius: 500 }]} />
                        <Reanimated.View style={[{ width: circlePathRadius * 1.6, flex: 1 }, birghtnesstViewStyle]} />
                    </View>
                </GestureDetector>
                <GestureDetector gesture={pansaturation}>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        height: 20,
                        width: circlePathRadius * 1.6,
                        borderRadius: 500,
                        overflow: 'hidden',
                    }}>
                        <Reanimated.View style={[animatedStylesSaturation, { borderTopLeftRadius: 500, borderBottomLeftRadius: 500 }]} />
                        <Reanimated.View style={[{ width: circlePathRadius * 1.6, flex: 1 }, birghtnesstViewStyle2]} />
                    </View>
                </GestureDetector>
            </View>

        </View>
    );
}

export default BrightnessSlider;