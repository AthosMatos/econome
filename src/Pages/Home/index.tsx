import {
    StatusBar,
    StyleSheet,
    PixelRatio,
    Image,
    Dimensions,
    ScrollView,
    View,
    Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Expenses } from '../../components/Expenses';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export interface BillsI {
    id: number;
    name: string;
    value: number;
}

export interface AppDataI {
    month: string;
    Bill: number;
    MaxBill: number;
    Bills: BillsI[];
}

const Home = (props: any) => {

    return (
        <LinearGradient
            colors={['#11111B', '#464660']}
            start={{ x: 0, y: 0.23 }}
            end={{ x: 0, y: 1 }}
            style={{
                flex: 1,
            }}
        >
            <StatusBar
                backgroundColor={'#11111B'}
                barStyle="light-content" />

            <Image
                resizeMode='contain'
                source={require('../../assets/images/AppTitle.png')}
                style={HomeStyles.titleIcon} />

            <ScrollView
            showsVerticalScrollIndicator={false}
            >
                <GestureHandlerRootView>
                    <Expenses />
                    {/* <MonthlyExpenses /> */}
                </GestureHandlerRootView>
            </ScrollView>

        </LinearGradient>
    );
}


export const HomeStyles = StyleSheet.create({
    backgroundStyle: {
        //background: 'linear-gradient(180deg, #11111B 23%, #464660 100%)',
        flex: 1,
    },

    titleIcon: {
        marginTop: PixelRatio.roundToNearestPixel(44),
        marginBottom: PixelRatio.roundToNearestPixel(24),
        height: PixelRatio.roundToNearestPixel(48),
        width: Dimensions.get('window').width,

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
