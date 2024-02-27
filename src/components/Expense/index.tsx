import { Dimensions, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors, GravidadeColors, formatMoney } from "../../utils"
import { useAppContext } from "../../context/appContext"
import CurrencyInput from "react-native-currency-input";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { interpolateColor, runOnJS } from "react-native-reanimated";

const Styles = StyleSheet.create({
    BillWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
    },
    InnerBorder: {
        borderWidth: 1,
        borderRadius: PixelRatio.roundToNearestPixel(18),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.88,
        height: PixelRatio.roundToNearestPixel(200),
    },
    MainPayText: {
        fontFamily: 'Mukta-ExtraLight',
        color: '#FFF',
        fontSize: 60,
    },
    SecondaryPayText: {
        marginTop: PixelRatio.roundToNearestPixel(-20),
        fontFamily: 'Mukta-Regular',
        color: Colors.softRed,
        fontSize: 18,
    },
    MonthText: {
        fontFamily: 'Mukta-ExtraLight',
        color: '#FFF',
        fontSize: 30,
        marginBottom: PixelRatio.roundToNearestPixel(-18),
    },
});

interface ExpenseI {
    month: string;
    Bill: number;
    MaxBill: number;
}
export const Expense = (props: ExpenseI) => {
    const { Bill, MaxBill, month } = props
    const [customMaxBill, setCustomMaxBill] = useState<number>(MaxBill)
    const { funcs } = useAppContext()
    const expenseColor = interpolateColor(
        MaxBill > 0 ? Bill / MaxBill : 0,
        [0, 0.5, 1],
        [GravidadeColors.lowEnd, GravidadeColors.mediumEnd, GravidadeColors.highEnd]
    )

    const [deleteBill, setDeleteBill] = useState<boolean>(false)



    useEffect(() => {
        if (customMaxBill !== MaxBill) {
            funcs.editMonthBill(customMaxBill)
        }
    }, [customMaxBill])

    const OnLongPress = Gesture.LongPress().onStart(({ state }) => {
        runOnJS(setDeleteBill)(!deleteBill)
    })

    return (
        <GestureHandlerRootView style={Styles.BillWrapper}>
            <GestureDetector gesture={OnLongPress}>
                {
                    !deleteBill ?
                        <View style={[Styles.InnerBorder, {
                            borderColor: expenseColor,
                        }]}>
                            <Text style={Styles.MonthText}>
                                {month}
                            </Text>

                            <Text style={[Styles.MainPayText, {
                                color: expenseColor,
                            }]}>
                                {formatMoney(Bill)}
                            </Text>
                            <CurrencyInput
                                placeholder="MaxBill"
                                value={customMaxBill}
                                onChangeValue={(value) => {
                                    setCustomMaxBill(value ?? 0)
                                }}
                                prefix="R$"
                                delimiter="."
                                separator=","
                                precision={2}
                                minValue={0}
                                style={Styles.SecondaryPayText}
                            />
                        </View>
                        :
                        <View style={[Styles.InnerBorder, {
                            borderColor: Colors.softRed,
                        }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    funcs.deleteMonth()
                                    setDeleteBill(false)
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: Dimensions.get('window').width * 0.88,
                                    height: PixelRatio.roundToNearestPixel(200),
                                }}>
                                <FaIcons name="trash" size={60} color={Colors.softRed} />
                            </TouchableOpacity>
                        </View>
                }
            </GestureDetector>
        </GestureHandlerRootView>



    )
}

export const AddExpense = () => {
    const { states: ContextStates, funcs: ContextFuncs } = useAppContext()

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            //justifyContent: 'center',
            marginTop: PixelRatio.roundToNearestPixel(20),
            width: Dimensions.get('window').width,

        }}>
            <TouchableOpacity
                onPress={() => {
                    ContextFuncs.addEmptyNewMonth()
                }}
                style={[Styles.InnerBorder, {
                    borderColor: Colors.softBackground(1),
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width * 0.88,
                    height: PixelRatio.roundToNearestPixel(200),
                }]}>

                <Text style={[Styles.MonthText, {
                    color: Colors.softBackground(1),
                }]}>
                    Adicionar Mes
                </Text>
            </TouchableOpacity>
        </View>
    )
}