import { StyleSheet, PixelRatio } from "react-native";

export const SliderStyle = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
    },
    slidersContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: PixelRatio.roundToNearestPixel(15),
    },
});