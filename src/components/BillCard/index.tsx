import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, PixelRatio } from 'react-native';
import Reanimated, { CurvedTransition, Easing, FadeIn, FadeOut, JumpingTransition, LinearTransition, SequencedTransition, combineTransition, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BillCardStyles, loadBarStyle, loadContainerStyle } from './styles';
import { TouchableOpacity } from 'react-native'
import FAicons from 'react-native-vector-icons/FontAwesome5';
import { Colors, GravidadeColors, formatMoney, generateExpenseColor } from '../../utils';
import Gradient from '../Gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../context/appContext';

const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


interface BillCardProps {
    extended: boolean;
    id: number;
    onPress?: () => void;
    maxBill?: number;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const cardHeight = windowHeight * 0.1
const splitValue = 7
const extendedWidth = windowWidth * 0.9;
const normalWidth = windowWidth * 0.28;

export const BillCard = (props: BillCardProps) => {
    const { extended, onPress, id, maxBill } = props

    const cardWidth = useSharedValue(normalWidth)

    const [loadBarWidth, setLoadBarWidth] = useState(0)

    const loaded = useSharedValue(0);

    const [billName, setBillName] = useState('')

    const startColor = useSharedValue(GravidadeColors.lowStart)
    const endColor = useSharedValue(GravidadeColors.lowEnd)

    const borderColor = useSharedValue('#000')

    const colors = useDerivedValue(() => {
        return [startColor.value, endColor.value]
    })

    const { funcs } = useAppContext()
    const [img, setImg] = useState<any>(null)
    const [billValue, setBillValue] = useState(0)

    useFocusEffect(useCallback(() => {
        const bill = funcs.getBill(id)
        if (bill) {
            setImg(bill.img)
            setBillValue(bill.value)
            if (extended) {
                cardWidth.value = extendedWidth
                setBillName(bill.name)
            }
            else {
                cardWidth.value = normalWidth
                setBillName(bill.name.length > splitValue ? bill.name.slice(0, splitValue) + '...' : bill.name)
            }
        }
    }, []))


    useEffect(() => {
        if (extended) {
            cardWidth.value = extendedWidth
        }
        else {
            cardWidth.value = normalWidth
        }
    }, [extended])

    useEffect(() => {
        const gravidade = (billValue / (maxBill ?? 1))
        loaded.value = withSpring(loadBarWidth * gravidade,
            {
                damping: 50,
                stiffness: 16,
            })
        const sColor = interpolateColor(
            gravidade,
            [0, 0.5, 1],
            [GravidadeColors.lowStart, GravidadeColors.mediumStart, GravidadeColors.highStart]
        )
        const eColor = interpolateColor(
            gravidade,
            [0, 0.5, 1],
            [GravidadeColors.lowEnd, GravidadeColors.mediumEnd, GravidadeColors.highEnd]
        )
        const bColor = interpolateColor(
            gravidade,
            [0, 0.5, 1],
            [GravidadeColors.lowEnd, GravidadeColors.mediumEnd, GravidadeColors.highEnd]
        )

        startColor.value = withTiming(sColor);
        endColor.value = withTiming(eColor);
        borderColor.value = withTiming(bColor)

    }, [loadBarWidth, billValue])

    const transitionIn = CurvedTransition.duration(300)
    const transitionOut = SequencedTransition.duration(400)

    const opacityTrash = useSharedValue(0)

    useEffect(() => {
        opacityTrash.value = withTiming(extended ? 1 : 0)
    }, [extended])

    const fadeTransition = useAnimatedStyle(() => {
        return {
            opacity: opacityTrash.value
        }
    })



    const ContainerAnimated = useAnimatedStyle(() => {
        return {
            width: cardWidth.value,
            borderColor: borderColor.value
        }
    })
    const ImageAnimated = useAnimatedStyle(() => {
        return {
            width: cardWidth.value,
        }
    })
    const [Delete, setDelete] = useState(false)
    return (
        Delete ?
            <AnimatedTouchableOpacity
                onLongPress={() => setDelete(false)}
                layout={extended ? transitionIn : transitionOut}
                onPress={() => {
                    funcs.deleteBill(id)
                    setDelete(false)
                }}
                style={[{
                    borderRadius: PixelRatio.roundToNearestPixel(8),
                    borderWidth: 2,
                    backgroundColor: 'rgba(12, 12, 12, 0.56)',
                    overflow: 'hidden',
                    height: cardHeight,
                    alignItems: 'center',
                    justifyContent: 'center'
                }, ContainerAnimated]}>
                {img && <Reanimated.Image
                    layout={extended ? transitionIn : transitionOut}
                    source={img}
                    style={[{
                        height: cardHeight,
                        position: 'absolute',
                        opacity: 0.46,
                        transform: [{ rotate: '10deg' }, { scale: 1.6 }]
                    }, ImageAnimated]}
                    resizeMode={'cover'}
                />}

                <FAicons
                    style={{
                    }} name='trash'
                    size={PixelRatio.roundToNearestPixel(32)}
                    color={Colors.white(0.3)}
                />
            </AnimatedTouchableOpacity>
            :
            <AnimatedTouchableOpacity
                onLongPress={() => setDelete(true)}
                layout={extended ? transitionIn : transitionOut}
                onPress={() => {
                    onPress && onPress()
                }}
                style={[{
                    borderRadius: PixelRatio.roundToNearestPixel(8),
                    borderWidth: 2,
                    padding: PixelRatio.roundToNearestPixel(8),
                    backgroundColor: 'rgba(12, 12, 12, 0.56)',
                    overflow: 'hidden',
                    height: cardHeight,
                }, ContainerAnimated]}>
                {img && <Reanimated.Image
                    layout={extended ? transitionIn : transitionOut}
                    source={img}
                    style={[{
                        height: cardHeight,
                        position: 'absolute',
                        opacity: 0.46,
                        transform: [{ rotate: '10deg' }, { scale: 1.6 }]
                    }, ImageAnimated]}
                    resizeMode={'cover'}
                />}

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                }}>
                    <View>
                        <Text style={BillCardStyles.BillNameText}>
                            {billName}
                        </Text>

                        <Text style={BillCardStyles.BillCardAmount}>{formatMoney(billValue)}</Text>
                    </View>

                    <Reanimated.View
                        style={
                            fadeTransition
                        }>
                        <FAicons
                            style={{
                                alignSelf: 'center',
                                marginRight: PixelRatio.roundToNearestPixel(16)
                            }}
                            name='trash'
                            size={20}
                            color='#ffffff6f' />
                    </Reanimated.View>
                </View>

                <View
                    onLayout={(event) => {
                        setLoadBarWidth(event.nativeEvent.layout.width)
                    }}
                    style={BillCardStyles.CenterLoad}>
                    <Gradient
                        gradient={{
                            colors: colors,
                            start: { x: 0, y: 0 },
                            end: { x: loadBarWidth, y: 0 },
                        }}
                        CanvasWidth={loadBarWidth}
                        CanvasHeight={PixelRatio.roundToNearestPixel(20)}
                        rect={{
                            x: 0,
                            y: 0,
                            width: loaded,
                            height: PixelRatio.roundToNearestPixel(20),
                        }}
                    />
                </View>
            </AnimatedTouchableOpacity>


    );
}

export const AddBillCard = ({ extended, onPress }: { extended: boolean, onPress: () => void }) => {

    const [cardWidth, setCardWidth] = useState(normalWidth)

    useEffect(() => {
        if (extended) {
            setCardWidth(extendedWidth)

        }
        else {
            setCardWidth(normalWidth)

        }
    }, [extended])

    const transitionIn = CurvedTransition.duration(300)
    const transitionOut = SequencedTransition.duration(400)



    return (
        <AnimatedTouchableOpacity

            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#dfdfdf42',
                borderRadius: PixelRatio.roundToNearestPixel(8),
                borderWidth: 2,
                padding: PixelRatio.roundToNearestPixel(8),
                backgroundColor: 'rgba(12, 12, 12, 0.56)',
                overflow: 'hidden',
                width: cardWidth,
                height: cardHeight,
            }}
            layout={extended ? transitionIn : transitionOut}
            onPress={() => {
                onPress()
            }}
        >
            <FAicons name='plus' size={40} color='#dfdfdf42' />

        </AnimatedTouchableOpacity>


    );
}
