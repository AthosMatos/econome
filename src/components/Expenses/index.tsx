import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useAppContext } from '../../context/appContext';
import { AddExpense, Expense } from './Expense';
import { useEffect } from 'react';
import { MonthlyExpense } from '../MonthlyExpense';

const CurrentBillMonthStyles = StyleSheet.create({
    BillsWrapper: {
        margin: 0,
        padding: 0
    }
})

export const Expenses = () => {
    const { states: ContextStates, funcs: ContextFuncs } = useAppContext()

    function goToPage(e: any) {
        const page = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
        if (page != ContextStates.pageIndex) {
            ContextFuncs.setPageIndex(page);
        }
    }

    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={CurrentBillMonthStyles.BillsWrapper}
            onScroll={goToPage}
        >
            {
                ContextStates.AppData.map((data, index) => (
                    <View key={index} >
                        <Expense Bill={data.Bill} MaxBill={data.MaxBill} month={data.month} />
                        <MonthlyExpense data={data} />
                    </View>
                ))
            }
            <AddExpense />
        </ScrollView>
    )
}