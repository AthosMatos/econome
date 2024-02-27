import { Dimensions, StyleSheet } from "react-native";

export const ColorPickerStyles = StyleSheet.create({
    container: {

        alignItems: 'center',
        justifyContent: 'center',
    },
    pathCircle: {
        position: 'absolute',
        height: (Dimensions.get('window').width * 0.8),
        width: (Dimensions.get('window').width * 0.8),
        borderRadius: Dimensions.get('window').width * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        position: 'absolute',
        height: 40,
        width: 40,
        backgroundColor: '#b58df1',
        borderRadius: 500,
        elevation: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});