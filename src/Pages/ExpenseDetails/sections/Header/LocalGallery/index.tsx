import {
  Dimensions,
  Image,
  PixelRatio,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import FaIcons from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../../../../../utils';
import {useEffect, useState} from 'react';
import {DefaultModal} from '../../../../Home/styles';
import {useThemeContext} from '../../../../../context/themeContext';
import {Text} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useExpenseDetails} from '../../../context';
import {useDBContext} from '../../../../../database/DBContext';
import DropShadow from 'react-native-drop-shadow';

const LocalGallery = () => {
  const [open, setOpen] = useState(false);
  const {
    funcs: {getTheme, addImg, deleteImg},
  } = useThemeContext();
  const {expense, setExpense, expenseID} = useExpenseDetails();
  const [theme, setTheme] = useState(getTheme());
  const {
    funcs: {
      update: {updateExpense},
    },
  } = useDBContext();

  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <>
      <DefaultModal open={open} setOpen={setOpen}>
        <View
          style={{
            backgroundColor: Colors.white(0.2),
            width: Dimensions.get('window').width * 0.9,
            height: Dimensions.get('window').height * 0.5,
            borderRadius: PixelRatio.roundToNearestPixel(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: PixelRatio.roundToNearestPixel(12),
            }}>
            <TouchableOpacity
              onPress={() => {
                launchImageLibrary(
                  {mediaType: 'photo', quality: 1},
                  response => {
                    if (response.assets) {
                      addImg(response.assets[0].uri!);
                      const newTheme = getTheme();
                      setTheme(newTheme);
                    }
                  },
                );
              }}>
              <View
                style={{
                  backgroundColor: Colors.white(0.2),
                  borderRadius: PixelRatio.roundToNearestPixel(10),
                  padding: PixelRatio.roundToNearestPixel(10),

                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>Adicionar do dispositivo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDeleteMode(!deleteMode);
              }}>
              <DropShadow
                style={{
                  shadowColor: Colors.white(0.6),
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: !deleteMode ? 0 : 0.94,
                  shadowRadius: 5,
                  opacity: !deleteMode ? 0.2 : 1,
                }}>
                <FaIcons
                  name="trash"
                  size={PixelRatio.roundToNearestPixel(24)}
                />
              </DropShadow>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: PixelRatio.roundToNearestPixel(10),

                width:
                  Dimensions.get('window').width * 0.26 * 3 +
                  PixelRatio.roundToNearestPixel(10) * 2,
              }}>
              {theme?.PrevUsedImgs?.map((img, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (deleteMode) {
                        const imgIndex = theme.PrevUsedImgs.findIndex(
                          i => i === img,
                        );
                        deleteImg(imgIndex);
                        const newTheme = getTheme();
                        setTheme(newTheme);
                      } else {
                        const updatedExpense = {
                          ...expense,
                          img: img,
                        };
                        setExpense(updatedExpense);
                        updateExpense(expenseID, {img});
                      }
                    }}>
                    <View
                      style={{
                        backgroundColor: deleteMode
                          ? 'rgba(255,0,0,0.4)'
                          : 'transparent',
                      }}>
                      <Image
                        source={{uri: img}}
                        style={{
                          width: Dimensions.get('window').width * 0.26,
                          height: Dimensions.get('window').width * 0.26,
                          borderRadius: PixelRatio.roundToNearestPixel(6),
                          opacity: deleteMode ? 0.6 : 1,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </DefaultModal>
      <TouchableOpacity
        onPress={() => {
          setOpen(true);
        }}>
        <FaIcons
          name="image"
          size={PixelRatio.roundToNearestPixel(24)}
          color={Colors.softBackground2(0.4)}
        />
      </TouchableOpacity>
    </>
  );
};

export default LocalGallery;
