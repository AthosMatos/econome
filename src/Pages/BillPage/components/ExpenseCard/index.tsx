import React, { useState, useEffect } from 'react';
import { View, PixelRatio, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MovableExpense } from '../MovableExpense';
import { Colors, formatMoney } from '../../../../utils';
import CurrencyInput from 'react-native-currency-input';
import { TextInput, } from 'react-native-gesture-handler';
import { BillsI, useAppContext } from '../../../../context/appContext';


const styles = StyleSheet.create({
    ExpenseCardContainer: {
        backgroundColor: '#00000083',
        paddingHorizontal: PixelRatio.roundToNearestPixel(10),
        borderRadius: PixelRatio.roundToNearestPixel(12),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: Colors.softBackground2(0.7),
        borderWidth: PixelRatio.roundToNearestPixel(1),
        height: PixelRatio.roundToNearestPixel(50),
    },
    AddExpenseCardContainer: {
        backgroundColor: '#00000089',
        paddingHorizontal: PixelRatio.roundToNearestPixel(10),
        borderRadius: PixelRatio.roundToNearestPixel(12),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: Colors.softBackground2(0.7),
        borderWidth: PixelRatio.roundToNearestPixel(1),
        height: PixelRatio.roundToNearestPixel(50),
    },
    text: {
        color: 'white',
        fontFamily: 'Mukta-ExtraLight',
        fontSize: PixelRatio.roundToNearestPixel(16),
        width: Dimensions.get('window').width * 0.25,
        //backgroundColor: Colors.softBackground(0.5),
    },
    AddText: {
        color: 'white',
        fontFamily: 'Mukta-Light',
        fontSize: PixelRatio.roundToNearestPixel(16),
        //backgroundColor: Colors.softBackground(0.5),
    }
})

interface ExpenseCardProps {
    name: string;
    initialValue: number;
    maxBill: number;
    Expenseid: number;
    Billid: number;
    setUpBill: React.Dispatch<React.SetStateAction<BillsI>>
}


export const ExpenseCard = (props: ExpenseCardProps) => {
    const { name, initialValue, maxBill, Expenseid, Billid, setUpBill } = props
    // const expenseColor = generateExpenseGradient(MaxBill > 0 ? Bill / MaxBill : 0)
    const [value, setCustomValue] = useState<number>(initialValue)
    const [customName, setCustomName] = useState<string>(name)

    const { funcs } = useAppContext()

    useEffect(() => {
        funcs.editExpenseFromBill({
            billId: Billid,
            expenseId: Expenseid,
            value: value,
        })
        const upBill = funcs.getBill(Billid)
        if (upBill) {
            setUpBill(upBill)
        }
    }, [value])

    useEffect(() => {
        funcs.editExpenseFromBill({
            billId: Billid,
            expenseId: Expenseid,
            name: customName,
        })
        const upBill = funcs.getBill(Billid)
        if (upBill) {
            setUpBill(upBill)
        }
    }, [customName])

    return (
        <View style={styles.ExpenseCardContainer}>
            <TextInput
                placeholder="Nome"
                placeholderTextColor={Colors.white(0.26)}
                onChange={(e) => setCustomName(e.nativeEvent.text)}
                value={customName}
                style={styles.text} />

            <MovableExpense Bill={value} MaxBill={maxBill} />
            <CurrencyInput
                placeholder="Valor"
                value={value}
                onChangeValue={(value) => {
                    setCustomValue(value ?? 0)
                }}
                prefix="R$"
                delimiter="."
                separator=","
                precision={2}
                minValue={0}
                style={styles.text}
            />
        </View>
    )
}

export const AddExpenseCard = ({ id, streetName, setUpBill }: { id: number, streetName: string | null, setUpBill: React.Dispatch<React.SetStateAction<BillsI>> }) => {
    const { funcs } = useAppContext()
    return (
        <TouchableOpacity
            onPress={() => {
                funcs.addEmptyExpenseToBill(id, streetName)
                setUpBill((prev) => {
                    const newBill = { ...prev }
                    newBill.expenses.push({
                        name: '',
                        value: 0,
                        id: newBill.expenses.length,
                        date: new Date().toISOString()
                    })
                    return newBill
                })
            }}
            style={styles.AddExpenseCardContainer}>
            <Text style={
                styles.AddText
            }>
                Adicionar despesa
            </Text>
        </TouchableOpacity>
    )
}