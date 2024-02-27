import { createContext, useContext, useEffect, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface ColorPickerContextI {
    lastPressedBall: SharedValue<string>;

    hue1: SharedValue<number>;
    hue2: SharedValue<number>;

    saturation1: SharedValue<number>;
    saturation2: SharedValue<number>;

    saturationCircle1: SharedValue<number>;
    saturationCircle2: SharedValue<number>;

    lightness1: SharedValue<number>;
    lightness2: SharedValue<number>;

    ballColorHSL1: SharedValue<string>;
    ballColorHSL2: SharedValue<string>;

    OpacityCircle1: SharedValue<number>;
    OpacityCircle2: SharedValue<number>;

    ContrastTextColor1: SharedValue<string>;
    ContrastTextColor2: SharedValue<string>;

    reverseBrightnessBall1: SharedValue<number>;
    reverseBrightnessBall2: SharedValue<number>;

    filledWidthBrightness1: SharedValue<number>;
    filledWidthBrightness2: SharedValue<number>;

    filledWidthSaturation1: SharedValue<number>;
    filledWidthSaturation2: SharedValue<number>;

    animatedTextBrightness: SharedValue<string>;
    animatedTextSaturation: SharedValue<string>;

    circlePathRadius: number;

    handleColorSelected: (ball1: string | null, ball2: string | null) => void;
}

const ColorPickerContext = createContext<ColorPickerContextI>({} as any);

interface ColorPickerProviderProps {
    children: any;
    circlePathRadius: number;
    handleColorSelected: (ball1: string | null, ball2: string | null) => void;
    Color1: SharedValue<string>;
    Color2: SharedValue<string>;
}

export const ColorPickerProvider = (props: ColorPickerProviderProps) => {
    const { children, handleColorSelected, Color1, Color2, circlePathRadius } = props;

    const hue1 = useSharedValue(0);
    const hue2 = useSharedValue(0);

    const saturation1 = useSharedValue(0);
    const saturation2 = useSharedValue(0);

    const saturationCircle1 = useSharedValue(0);
    const saturationCircle2 = useSharedValue(0);

    const lightness1 = useSharedValue(50);
    const lightness2 = useSharedValue(50);

    const OpacityCircle1 = useSharedValue(0);
    const OpacityCircle2 = useSharedValue(0);

    const ContrastTextColor1 = useSharedValue('white')
    const ContrastTextColor2 = useSharedValue('white')

    const reverseBrightnessBall1 = useSharedValue(50);
    const reverseBrightnessBall2 = useSharedValue(50);

    const lastPressedBall = useSharedValue('1');

    const filledWidthBrightness1 = useSharedValue(50);
    const filledWidthBrightness2 = useSharedValue(50);

    const filledWidthSaturation1 = useSharedValue(50);
    const filledWidthSaturation2 = useSharedValue(50);

    const animatedTextBrightness = useSharedValue('0%');
    const animatedTextSaturation = useSharedValue('0%');


    return (
        <ColorPickerContext.Provider value={{
            lastPressedBall,
            hue1,
            hue2,
            saturation1,
            saturation2,
            ballColorHSL1: Color1,
            ballColorHSL2: Color2,
            lightness1,
            lightness2,
            OpacityCircle1,
            OpacityCircle2,
            saturationCircle1,
            saturationCircle2,
            ContrastTextColor1,
            ContrastTextColor2,
            reverseBrightnessBall1,
            reverseBrightnessBall2,
            filledWidthBrightness1,
            filledWidthBrightness2,
            filledWidthSaturation1,
            filledWidthSaturation2,
            circlePathRadius,

            animatedTextBrightness,
            animatedTextSaturation,

            handleColorSelected
        }}>
            {children}
        </ColorPickerContext.Provider>
    )
}

export const useColorPickerContext = () => {
    const context = useContext(ColorPickerContext);
    return context;
}