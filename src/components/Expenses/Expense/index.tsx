import { Dimensions, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors, formatMoney, generateExpenseColor } from "../../../utils"
import { useAppContext } from "../../../context/appContext"
import CurrencyInput from "react-native-currency-input";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { runOnJS } from "react-native-reanimated";

const Styles = StyleSheet.create({
    BillWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: Colors.softBackground(0.5),
        width: Dimensions.get('window').width,
        //height: PixelRatio.roundToNearestPixel(200),
        marginTop: PixelRatio.roundToNearestPixel(20),
        marginBottom: PixelRatio.roundToNearestPixel(60)
    },
    InnerBorder: {
        borderWidth: 1,
        borderRadius: PixelRatio.roundToNearestPixel(18),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //paddingVertical: PixelRatio.roundToNearestPixel(50),
        //marginVertical: PixelRatio.roundToNearestPixel(60),
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
    const expenseColor = generateExpenseColor(MaxBill > 0 ? Bill / MaxBill : 0)
    const [deleteBill, setDeleteBill] = useState<boolean>(false)

    function toogleDeleteBill() {
        console.log('toogleDeleteBill')
        setDeleteBill(!deleteBill)
    }

    useEffect(() => {
        if (customMaxBill !== MaxBill) {
            funcs.editMonthBill(customMaxBill)
        }
    }, [customMaxBill])

    const OnLongPress = Gesture.LongPress().onStart(({ state }) => {
        runOnJS(toogleDeleteBill)()
    })

    return (
        <View style={Styles.BillWrapper}>
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
                                    funcs.deleteExpense()
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
        </View>
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
                    ContextFuncs.addEmptyExpense()
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