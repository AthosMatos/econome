import React, { useState, useEffect } from 'react';
import { View, Text, PixelRatio, TouchableOpacity } from 'react-native';
import { useBillPage } from './useBillPage.tsx';
import { BillMoney, BillName, ImageGradient, Month } from './styles.tsx';
import { useRoute } from '@react-navigation/native';
import { AppIcon } from '../../components/appIcon/index.tsx';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../../utils.tsx';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { AddExpenseCard, ExpenseCard } from './components/ExpenseCard/index.tsx';
import { GeneralExpenseBar } from './components/GeneralExpenseBar/index.tsx';
import { BillsI, useAppContext } from '../../context/appContext.tsx';

import Geolocation from '@react-native-community/geolocation';

interface BillPageProps {
    bill: BillsI,
    month: string,
    maxBill: number,
}
const BillPage = () => {
    const route = useRoute();
    const { bill, month, maxBill } = route.params as BillPageProps;

    const [UpBill, setUpBill] = useState(bill)

    const { windowHeight, windowWidth, colors, } = useBillPage({ img: UpBill.img })

    const { funcs } = useAppContext()
    const [streetName, setStreetName] = useState<string | null>(null)

    interface sucessType {

        coords: {
            latitude: number;
            longitude: number;
            altitude: number | null;
            accuracy: number;
            altitudeAccuracy: number | null;
            heading: number | null;
            speed: number | null;
        };
        timestamp: number;
    }

    async function getStreetName(latitude: number, longitude: number, username: string): Promise<string | null> {
        const url = `http://api.geonames.org/findNearbyStreetsOSMJSON?lat=${latitude}&lng=${longitude}&username=${username}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.streetSegment && data.streetSegment.length > 0) {
                // Assuming we take the first street segment's name as the output
                return data.streetSegment[0].name;
            } else {
                return null; // No street segment found
            }
        } catch (error) {
            console.error("Error fetching street name:", error);
            return null;
        }
    }

    Geolocation.getCurrentPosition((info: sucessType) => {
        console.log(info)
        const myLat = info.coords.latitude
        const myLon = info.coords.longitude
        const username = 'athosladies';
        getStreetName(myLat, myLon, username).then((streetName) => {
            if (streetName) {
                setStreetName(streetName);
            } else {
                setStreetName("No street");
            }
        });
    }, (error: any) => {
        console.log(error)
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })


    return (
        <GestureHandlerRootView>
            <ImageGradient img={UpBill.img} windowHeight={windowHeight} windowWidth={windowWidth} colors={colors} >
                <AppIcon />
                <View style={{
                    marginHorizontal: PixelRatio.roundToNearestPixel(16),
                    gap: PixelRatio.roundToNearestPixel(28),
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <Month month={month} />
                            <BillName id={UpBill.id} billName={UpBill.name} />
                            <BillMoney id={UpBill.id} value={UpBill.value} maxBill={maxBill} />
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: PixelRatio.roundToNearestPixel(18),
                            paddingTop: PixelRatio.roundToNearestPixel(16),
                            marginRight: PixelRatio.roundToNearestPixel(8),
                        }}>
                            <TouchableOpacity onPress={() => {
                                launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
                                    //
                                    if (response.assets && response.assets[0].uri) {
                                        /* funcs.editBill({
                                            id: UpBill.id,
                                            img: response.assets[0].uri
                                        })
                                        setUpBill({ ...UpBill, img: response.assets[0].uri }) */
                                    }

                                })
                            }}>
                                <FaIcons name='camera' size={PixelRatio.roundToNearestPixel(24)} color={Colors.softBackground2(0.4)} />
                            </TouchableOpacity>
                            <TouchableOpacity>

                                <FaIcons name='trash' size={PixelRatio.roundToNearestPixel(30)} color={Colors.softBackground2(0.4)} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <GeneralExpenseBar Bill={UpBill.value} MaxBill={maxBill} />

                </View>

            </ImageGradient>


            {
                UpBill.expenses && <ScrollView contentContainerStyle={{
                    paddingBottom: PixelRatio.roundToNearestPixel(16),
                    marginTop: PixelRatio.roundToNearestPixel(32),
                    alignItems: 'center',
                    gap: PixelRatio.roundToNearestPixel(16),
                }}>
                    {UpBill.expenses.map((expense, index) => {
                        return (
                            <ExpenseCard
                                setUpBill={setUpBill}
                                Expenseid={expense.id}
                                Billid={UpBill.id}
                                maxBill={maxBill}
                                key={index}
                                name={expense.name}
                                initialValue={expense.value}
                            />
                        )
                    })}

                </ScrollView>

            }
            <AddExpenseCard setUpBill={setUpBill} streetName={streetName} id={UpBill.id} />
        </GestureHandlerRootView>
    )
}

export default BillPage;