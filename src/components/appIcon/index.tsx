import { Image, PixelRatio, Dimensions, StyleSheet } from "react-native"

const Styles = StyleSheet.create({
    titleIcon: {
        marginTop: PixelRatio.roundToNearestPixel(44),
        marginBottom: PixelRatio.roundToNearestPixel(24),
        height: PixelRatio.roundToNearestPixel(48),
        width: Dimensions.get('window').width,

    },
})

export const AppIcon = () => {
    return (
        <Image
            resizeMode='contain'
            source={require('../../assets/images/AppTitle.png')}
            style={Styles.titleIcon} />
    )
}
