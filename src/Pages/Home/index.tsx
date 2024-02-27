import {
    StatusBar,
    StyleSheet,
    PixelRatio,
    Dimensions,
    View, Text, Image, TouchableOpacity
} from 'react-native';

import { vec } from '@shopify/react-native-skia';
import GradientBackground from '../../components/GradientBackground';
import Bills from '../../components/Bills';
import ToolBar from '../../components/ToolsBar';
import { useThemeContext } from '../../context/themeContext';
import { AppIcon } from '../../components/appIcon';
import { ScrollView } from 'react-native';
import { useAppContext } from '../../context/appContext';
import { AddExpense, Expense } from '../../components/Expense';


const CurrentBillMonthStyles = StyleSheet.create({
    BillsWrapper: {

        flexDirection: 'row',

    }
})
const Home = (props: any) => {

    const { states: { colors }, } = useThemeContext()

    const { states: ContextStates, funcs: ContextFuncs } = useAppContext()

    function goToPage(e: any) {
        const page = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
        if (page != ContextStates.pageIndex) {
            ContextFuncs.setPageIndex(page);
        }
    }
    return (

        <GradientBackground
            gradient={{
                colors: colors,
                end: vec(Dimensions.get('window').width, Dimensions.get('window').height),
                start: vec(0, 0),
            }}
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height}
        >
            <StatusBar
                backgroundColor={'black'}
                barStyle="light-content" />

            <AppIcon />

            <View style={{
                gap: PixelRatio.roundToNearestPixel(26),
            }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal

                    onScroll={goToPage}
                    contentContainerStyle={[{
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                        padding: 0,
                    }, CurrentBillMonthStyles.BillsWrapper]}
                >

                    {
                        ContextStates.AppData.map((data, index) => (
                            <Expense key={index} Bill={data.Bill} MaxBill={data.MaxBill} month={data.month} />
                        ))
                    }
                    <AddExpense />
                </ScrollView>
            </View>
            <ToolBar />
            <Bills />






        </GradientBackground>




    );
}


export const HomeStyles = StyleSheet.create({
    backgroundStyle: {
        //background: 'linear-gradient(180deg, #11111B 23%, #464660 100%)',
        flex: 1,
    },
    buttonsContainer: {
        //justifyContent: 'center',
        alignItems: 'center',
        //flex: 1,
        flexDirection: 'row',
        //flexWrap: 'wrap',
        marginHorizontal: PixelRatio.roundToNearestPixel(14),
        gap: PixelRatio.roundToNearestPixel(14),
    },
});

export default Home;
