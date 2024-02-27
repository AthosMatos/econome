import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, PixelRatio } from 'react-native';
import { useToolBarContext } from '../../context/ToolBarContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AddBillCard, BillCard } from '../BillCard';
import { useAppContext } from '../../context/appContext';



const Bills = () => {
    const { states: { extendedCards } } = useToolBarContext();
    const { states: ContextStates, funcs: ContextFuncs } = useAppContext()

    const navigation = useNavigation()


    return (
        <ScrollView
            contentContainerStyle={{
                alignItems: 'center',
                paddingBottom: PixelRatio.roundToNearestPixel(66),
                width: Dimensions.get('window').width,
            }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                gap: 16,
                width: Dimensions.get('window').width * 0.93,
            }}>
                {
                    ContextStates.currentBill?.Bills.map((bill, index) => {
                        return (
                            <BillCard
                                key={index}
                                id={bill.id}
                                extended={extendedCards}
                                maxBill={ContextStates.currentBill?.MaxBill}
                                onPress={() => {
                                    navigation.navigate('BillPage' as never, {
                                        bill: bill,
                                        maxBill: ContextStates.currentBill?.MaxBill,
                                        month: ContextStates.currentBill?.month
                                    } as never)
                                }}
                            />
                        )
                    })
                }
                <AddBillCard
                    onPress={() => {
                        if (ContextStates.currentBill) ContextFuncs.addEmptyBill(ContextStates.currentBill.month)
                    }}
                    extended={extendedCards} />
            </View>
        </ScrollView>

    )
}

export default Bills;