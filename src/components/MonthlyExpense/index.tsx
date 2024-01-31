import { Dimensions, FlatList, PixelRatio, ScrollView, StyleSheet, View } from "react-native"
import { AppDataI } from "../../Pages/Home"
import { Colors } from "../../utils";
import { AddSingleExpense, SingularExpenses } from "./SingularExpenses";
import { useAppContext } from "../../context/appContext";

const LineW = Dimensions.get('window').width * 0.4

export const MonthlyExpenseStyles = StyleSheet.create({
    Wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        width: Dimensions.get('window').width * 0.92,
        gap: PixelRatio.roundToNearestPixel(14),
    },
    Text: {
        fontFamily: 'Mukta-ExtraLight',
        color: '#FFF',
        fontSize: Dimensions.get('window').width * 0.04,
        textAlign: 'center',
        backgroundColor: Colors.softBackground(0.45),

        paddingVertical: PixelRatio.roundToNearestPixel(4),
        borderRadius: PixelRatio.roundToNearestPixel(8),
    },
    Line: {
        backgroundColor: Colors.softBackground(0.5),
        borderRadius: 100,
        overflow: 'hidden',
        display: 'flex',
        flex: 1,
        //width: ,

    },
    LineGradient: {
        display: 'flex',
        flex: 1,
        borderRadius: 50,
        width: 0
    }
});


export const MonthlyExpense = ({ data }: { data: AppDataI }) => {
    const { funcs } = useAppContext()

    return (
        <FlatList
            data={data.Bills}
            renderItem={({ item }) => (
                <SingularExpenses Bill={data.Bill} maxBill={data.MaxBill} LineW={LineW} billData={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => (
                <AddSingleExpense onPress={() => funcs.addEmptyBill(data.month)} />
            )}
            contentContainerStyle={{
                width: Dimensions.get('window').width,
                alignItems: 'center',
                gap: PixelRatio.roundToNearestPixel(26),
            }}
        />
    )
}