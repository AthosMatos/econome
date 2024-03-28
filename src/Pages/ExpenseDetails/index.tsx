import React, {useCallback, useEffect} from 'react';
import {ImageGradient, Month} from './styles.tsx';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {BillDB} from '../../database/Data/BillDB.ts';
import {useObject, useQuery, useRealm} from '@realm/react';
import {ExpenseDB} from '../../database/Data/ExpenseDB.ts';
import {BSON} from 'realm';
import ExpenseDetailsHeader from './sections/Header/index.tsx';
import BillList from './sections/BillList/index.tsx';
import {ExpenseDetailsProvider} from './context/index.tsx';

export interface BillPageProps {
  img: any;
  ExpenseID: BSON.ObjectID;
  currMonthID: BSON.ObjectID;
}

const ExpenseDetailsPage = () => {
  const route = useRoute();
  const {ExpenseID, currMonthID} = route.params as BillPageProps;
  return (
    <ExpenseDetailsProvider expenseID={ExpenseID} currMonthID={currMonthID}>
      <ImageGradient>
        <ExpenseDetailsHeader />
        <BillList />
      </ImageGradient>
    </ExpenseDetailsProvider>
  );
};

export default ExpenseDetailsPage;

/* 
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

*/
