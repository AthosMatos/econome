import {PixelRatio, TouchableOpacity, View} from 'react-native';
import {AppIcon} from '../../../../components/appIcon';
import {Colors} from '../../../../utils';
import React, {useEffect} from 'react';
import {ExpenseMoney, ExpenseName, Month} from '../../styles';
import FaIcons from 'react-native-vector-icons/FontAwesome5';
import {GeneralBillBar} from './GeneralBillBar';
import {useDBContext} from '../../../../database/DBContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useExpenseDetails} from '../../context';
import {useNavigation} from '@react-navigation/native';
import LocalGallery from './LocalGallery';

const ExpenseDetailsHeader = () => {
  const {
    funcs: {
      get: {getMonthlyBudget},
    },
  } = useDBContext();
  const {expenseID, currMonthID, setExpense, expense} = useExpenseDetails();
  const {
    funcs: {
      update: {updateExpense},
      delete: {deleteExpenseCard},
    },
  } = useDBContext();
  const month = getMonthlyBudget(currMonthID)?.month;

  const nav = useNavigation() as any;

  return (
    <>
      <AppIcon />

      <View
        style={{
          marginHorizontal: PixelRatio.roundToNearestPixel(16),
          gap: PixelRatio.roundToNearestPixel(28),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Month month={month ?? ''} />
            <ExpenseName />
            <ExpenseMoney />
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: PixelRatio.roundToNearestPixel(18),
              paddingTop: PixelRatio.roundToNearestPixel(16),
              marginRight: PixelRatio.roundToNearestPixel(8),
            }}>
            <LocalGallery />
            <TouchableOpacity
              onPress={() => {
                launchCamera(
                  {mediaType: 'photo', quality: 1, includeBase64: true},
                  response => {
                    if (response.assets) {
                      // console.log(response.assets[0].uri);
                      const updatedExpense = {
                        ...expense,
                        img: response.assets[0].uri!,
                      };
                      setExpense(updatedExpense);
                      updateExpense(expenseID, {img: response.assets[0].uri!});
                    }
                  },
                );
              }}>
              <FaIcons
                name="camera"
                size={PixelRatio.roundToNearestPixel(24)}
                color={Colors.softBackground2(0.4)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                nav.navigate('Home');
                deleteExpenseCard(expenseID);
              }}>
              <FaIcons
                name="trash"
                size={PixelRatio.roundToNearestPixel(30)}
                color={Colors.softBackground2(0.4)}
              />
            </TouchableOpacity>
          </View>
        </View>

        <GeneralBillBar />
      </View>
    </>
  );
};

export default ExpenseDetailsHeader;
