import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { ColorPickerStyles } from "../../styles";
import { useColorPickerContext } from "../context";
import { useEffect } from "react";
import { getBestTextColorWorklet } from "../../utils";

interface BallProps {
    ballNumber: number;
}

const Ball = (props: BallProps) => {
    const { ballNumber } = props;
    const {
        lightness1,
        lightness2,
        ContrastTextColor1,
        ContrastTextColor2,
        hue1,
        hue2,
        circlePathRadius,
        saturation1,
        saturation2,
        lastPressedBall,
        ballColorHSL1,
        ballColorHSL2,
        handleColorSelected,
        animatedTextBrightness,
        animatedTextSaturation,
        OpacityCircle1,
        OpacityCircle2,
        filledWidthBrightness1,
        filledWidthBrightness2,
        filledWidthSaturation1,
        filledWidthSaturation2,

    } = useColorPickerContext()

    const currX = useSharedValue(0);
    const currY = useSharedValue(0);
    const offsetX = useSharedValue(circlePathRadius * Math.cos(Math.atan2(0, 0)));
    const offsetY = useSharedValue(circlePathRadius * Math.sin(Math.atan2(0, 0)));

    const currColor = useSharedValue(0)
    const brightness = ballNumber === 1 ? lightness1 : lightness2;
    const contrastColor = ballNumber === 1 ? ContrastTextColor1 : ContrastTextColor2;
    const saturation = ballNumber === 1 ? saturation1 : saturation2;

    function initalizePositionsBasedOnColor() {
        const hslArray1 = ballColorHSL1.value.replace('hsl(', '').replace(')', '').split(',');
        //console.log(hslArray1);
        const cV = Number(hslArray1[0])
        const angle1 = cV / 360 * (2 * Math.PI);
        const h1 = angle1 / (2 * Math.PI)
        const brigess1 = Number(hslArray1[2].slice(0, -1))
        const sat1 = Number(hslArray1[1].slice(0, -1))
        const x1 = circlePathRadius * Math.cos(angle1);
        const y1 = circlePathRadius * Math.sin(angle1);
        const opacity1 = (Math.abs(50 - brigess1) * 2) / 100

        if (ballNumber === 1) {
            offsetX.value = x1
            offsetY.value = y1
            currX.value = x1
            currY.value = y1

        }

        hue1.value = angle1 / (2 * Math.PI)
        lightness1.value = brigess1
        filledWidthBrightness1.value = (circlePathRadius * 1.6) * (brigess1 / 100)
        OpacityCircle1.value = opacity1
        ContrastTextColor1.value = getBestTextColorWorklet(h1, sat1, brigess1)
        //console.log(brigess1)
        saturation1.value = sat1
        filledWidthSaturation1.value = (circlePathRadius * 1.6) * (sat1 / 100)

        const hslArray2 = ballColorHSL2.value.replace('hsl(', '').replace(')', '').split(',');

        const cV2 = Number(hslArray2[0])
        const angle2 = cV2 / 360 * (2 * Math.PI);
        const h2 = angle2 / (2 * Math.PI)
        const brigess2 = Number(hslArray2[2].slice(0, -1))
        const x2 = circlePathRadius * Math.cos(angle2);
        const y2 = circlePathRadius * Math.sin(angle2);
        const sat2 = Number(hslArray2[1].slice(0, -1))
        const opacity2 = (Math.abs(50 - brigess2) * 2) / 100

        if (ballNumber === 2) {
            offsetX.value = x2
            offsetY.value = y2
            currX.value = x2
            currY.value = y2
        }

        hue2.value = h2
        lightness2.value = brigess2
        filledWidthBrightness2.value = (circlePathRadius * 1.6) * (brigess2 / 100)
        OpacityCircle2.value = opacity2
        saturation2.value = sat2
        ContrastTextColor2.value = getBestTextColorWorklet(h2, sat2, brigess2)
        filledWidthSaturation2.value = (circlePathRadius * 1.6) * (sat2 / 100)

        if (ballNumber === 1) {
            animatedTextBrightness.value = `${parseInt(brigess1.toString())}%`
            currColor.value = angle1 / (2 * Math.PI)
            animatedTextSaturation.value = `${parseInt(sat1.toString())}%`
        }
        else {
            animatedTextBrightness.value = `${parseInt(brigess2.toString())}%`
            currColor.value = angle2 / (2 * Math.PI)
            animatedTextSaturation.value = `${parseInt(sat2.toString())}%`
        }
    }

    useEffect(() => {
        initalizePositionsBasedOnColor();
    }, [])


    const pan = Gesture.Pan().onTouchesDown((event) => {
        lastPressedBall.value = ballNumber.toString();
        if (ballNumber === 1) {
            animatedTextBrightness.value = `${parseInt(lightness1.value.toString())}%`
            animatedTextSaturation.value = `${parseInt(saturation1.value.toString())}%`
        }
        else {
            animatedTextBrightness.value = `${parseInt(lightness2.value.toString())}%`
            animatedTextSaturation.value = `${parseInt(saturation2.value.toString())}%`
        }
    })
        .onChange((event) => {
            const x = event.translationX + currX.value;
            const y = event.translationY + currY.value;
            const angle = Math.atan2(y, x);
            offsetX.value = circlePathRadius * Math.cos(angle);
            offsetY.value = circlePathRadius * Math.sin(angle);
            const color = angle / (2 * Math.PI);
            const colorhsl = `hsl(${color * 360}, ${saturation.value}%, ${brightness.value}%)`

            currColor.value = color;
            if (ballNumber === 1) {
                hue1.value = color
                ballColorHSL1.value = colorhsl
                ContrastTextColor1.value = getBestTextColorWorklet(color, saturation.value, brightness.value)
                handleColorSelected(colorhsl, null);
            }
            else {
                hue2.value = color
                ballColorHSL2.value = colorhsl
                ContrastTextColor2.value = getBestTextColorWorklet(color, saturation.value, brightness.value)
                handleColorSelected(null, colorhsl);
            }

        })
        .onFinalize(() => {
            currX.value = offsetX.value;
            currY.value = offsetY.value;

        });

    const SelectedColorAnimStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `hsl(${currColor.value * 360}, ${saturation.value}%, ${brightness.value}%)`,
            borderColor: `hsl(${currColor.value * 360}, ${saturation.value}%, ${lastPressedBall.value === ballNumber.toString() ? 100 : 40}%)`,
            transform: [
                { translateX: offsetX.value, },
                { translateY: offsetY.value },
                { scale: lastPressedBall.value === ballNumber.toString() ? withSpring(1.2) : 1 }
            ]
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            color: contrastColor.value,
        };
    });

    return (

        <GestureDetector gesture={pan}>
            <Reanimated.View style={[ColorPickerStyles.circle, SelectedColorAnimStyle]} >
                <Reanimated.Text style={[{
                    fontSize: 20,
                    fontFamily: 'Mukta-Bold',
                }, animatedTextStyle]}>{ballNumber}</Reanimated.Text>
            </Reanimated.View>
        </GestureDetector>

    )
}

export default Ball;
