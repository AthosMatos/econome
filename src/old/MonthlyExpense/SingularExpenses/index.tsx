import { Animated, Dimensions, PixelRatio, Text, TouchableOpacity, View } from "react-native";
import { AppDataI, BillsI } from "../../../Pages/Home";
import { Colors, generateExpenseGradient } from "../../../utils";
import { TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CurrencyInput from "react-native-currency-input";
import { MonthlyExpenseStyles } from "..";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/appContext";
import REAnimated, { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { Gesture, GestureDetector, Swipeable } from "react-native-gesture-handler";

const AnimatedLinearGradient = REAnimated.createAnimatedComponent(LinearGradient)

export const SingularExpenses = ({ Bill, maxBill, billData, LineW }: { Bill: number, maxBill: number, billData: BillsI, LineW: number }) => {
    const [customName, setCustomName] = useState<string>(billData.name)
    const [customValue, setCustomValue] = useState<number>(billData.value)
    const [deleteBill, setDeleteBill] = useState<boolean>(false)
    const gradientWidth = useSharedValue(0)
    const [gradient, setGradient] = useState(generateExpenseGradient(Bill ? (customValue / Bill) : 0))
    const { funcs } = useAppContext()

    useEffect(() => {
        if (Bill) {

            const porc = (customValue / Bill) > 1 ? 1 : (customValue / Bill) < 0 ? 0 : (customValue / Bill)

            gradientWidth.value = withSpring((LineW * 1.14) * porc, {
                damping: 50,
                //stiffness: 100,
            })
            setGradient(generateExpenseGradient(porc))
        }

    }, [Bill, customValue])


    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<string | number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<string | number>,
    ) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        /* opacity.addListener(({ value }) => {

            if (value == 1) {
                if (deleteBill == false) {
                    setDeleteBill(true)
                }

            }
        }) */
        return (

            <Animated.View style={{
                opacity,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: PixelRatio.roundToNearestPixel(14),
            }}>
                <TouchableOpacity onPress={() => {
                    setDeleteBill(true)
                }}>
                    <FaIcons name={'trash'} size={30} color={'red'} />
                </TouchableOpacity>
            </Animated.View>

        );
    };

    useEffect(() => {
        if (deleteBill) {
            funcs.deleteBill(billData.id)
        }
    }, [deleteBill])

    useEffect(() => {
        if (customName != billData.name || customValue != billData.value) {
            funcs.editBill(billData.id, customName, customValue)
        }
    }, [customName, customValue])

    const OnMove = Gesture.Pan().onUpdate((e) => {
        gradientWidth.value = e.x > 0 ? e.x : 0

    }).onEnd((e) => {
        //interpolate the value based on the width of the line
        const porc = e.x / (LineW * 1.14)
        let v = Bill * porc
        //console.log(v)
        if (v < 0) {
            v = 0
        }
        else if (v > maxBill) {
            v = maxBill
        }

        runOnJS(setCustomValue)(v)
    });

    return (
        <Swipeable
            activateAfterLongPress={1}
            renderRightActions={renderRightActions}>
            <View style={MonthlyExpenseStyles.Wrapper}>
                <TextInput
                    placeholder="Nome"
                    placeholderTextColor={Colors.white(0.26)}
                    onChange={(e) => setCustomName(e.nativeEvent.text)}
                    value={customName}
                    style={[MonthlyExpenseStyles.Text, {
                        width: Dimensions.get('window').width * 0.2,
                    }]} />

                <GestureDetector gesture={OnMove}>
                    <View style={MonthlyExpenseStyles.Line}>
                        <AnimatedLinearGradient
                            colors={[
                                gradient.start,
                                gradient.end
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[MonthlyExpenseStyles.LineGradient, {
                                width: gradientWidth,
                            }]}
                        />
                    </View>
                </GestureDetector>


                <CurrencyInput
                    placeholder="Valor"
                    value={customValue}
                    onChangeValue={(value) => {
                        setCustomValue(value ?? 0)
                    }}
                    prefix="R$"
                    delimiter="."
                    separator=","
                    precision={2}
                    minValue={0}
                    style={[MonthlyExpenseStyles.Text, {
                        width: Dimensions.get('window').width * 0.22,
                    }]}
                />

            </View>
        </Swipeable>

    )
}

interface AddSingleExpenseI {
    onPress: () => void;
}

export const AddSingleExpense = ({ onPress }: AddSingleExpenseI) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[MonthlyExpenseStyles.Wrapper, {
                backgroundColor: Colors.softBackground(0.45),
                height: PixelRatio.roundToNearestPixel(48),
                borderRadius: 8,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
            }]}>
            <Text
                style={[MonthlyExpenseStyles.Text, {
                    color: Colors.white(0.40),
                    backgroundColor: 'transparent',
                }]}>Adicionar cobrança
            </Text>
        </TouchableOpacity>
    )
}
