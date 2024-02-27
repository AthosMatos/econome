import React from 'react';
import { Dimensions, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
    Canvas,
    LinearGradient,
    Rect,
} from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';

interface GradientProps {
    CanvasStyle?: StyleProp<ViewStyle>;
    CanvasWidth: SharedValue<number> | number;
    CanvasHeight: SharedValue<number> | number;
    gradient: {
        start: { x: number, y: number },
        end: { x: number, y: number },
        colors: SharedValue<string[]>
    }
    rect: {
        x: SharedValue<number> | number,
        y: SharedValue<number> | number,
        width: SharedValue<number> | number,
        height: SharedValue<number> | number,
    }
}

const AnimatedCanvas = Reanimated.createAnimatedComponent(Canvas)

const Gradient = (props: GradientProps) => {
    const { CanvasStyle, CanvasWidth, CanvasHeight, gradient, rect } = props;

    return (
        <AnimatedCanvas
            style={[{
                width: CanvasWidth,
                height: CanvasHeight,

            }, CanvasStyle]}>
            <Rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
            />
            <LinearGradient
                start={gradient.start}
                end={gradient.end}
                colors={gradient.colors}
            />
        </AnimatedCanvas>
    )
};


export default Gradient;