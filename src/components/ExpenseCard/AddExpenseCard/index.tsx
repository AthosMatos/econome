import {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FAicons from 'react-native-vector-icons/FontAwesome5';
import {BSON} from 'realm';
import {cardHeight, extendedWidth, normalWidth} from '../styles';
import {memo, useState} from 'react';
import {ExpenseDBI} from '../../../database/Data/ExpenseDB';
import {useDBContext} from '../../../database/DBContext';
import {useToolBarContext} from '../../../context/ToolBarContext';
import {Colors} from '../../../utils';

interface AddExpenseCardProps {
  monthID: BSON.ObjectId;
}

const AddExpenseCardStyles = StyleSheet.create({
  AddExpenseCardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: PixelRatio.roundToNearestPixel(8),
    backgroundColor: Colors.TransparentGrey,
  },
});

const AddExpenseCard = memo(function ({monthID}: AddExpenseCardProps) {
  const [showDefaults, setShowDefaults] = useState(false);
  const {
    funcs: {
      add: {addExpenseCard},
    },
  } = useDBContext();
  const {
    states: {extendedCards},
  } = useToolBarContext();

  const mockDefaults = [
    {
      name: 'Alimentação',
      maxValue: 1000,
      img: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg',
    },
    {
      name: 'Transporte',
      maxValue: 1000,
      img: 'https://media.istockphoto.com/id/1361394182/pt/foto/funny-british-shorthair-cat-portrait-looking-shocked-or-surprised.jpg?s=612x612&w=0&k=20&c=t7Z5ImdWMiaZ3HGbNy0ZIhdGiubZZZ-VIoqCwU2uIFY=',
    },
    {
      name: 'Lazer',
      maxValue: 1000,
      img: 'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
    },
    {
      name: 'Outros',
      maxValue: 1000,
      img: 'https://img.freepik.com/fotos-gratis/gatinho-domestico-fofo-senta-na-janela-olhando-para-fora-da-ia-generativa_188544-12519.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1710806400&semt=ais',
    },
  ];

  return (
    <TouchableOpacity
      disabled={showDefaults}
      style={[
        AddExpenseCardStyles.AddExpenseCardContainer,
        {
          width: extendedCards ? extendedWidth : normalWidth,
          height: showDefaults ? cardHeight * 2 : cardHeight,
          alignItems: showDefaults ? 'flex-start' : 'center',
          overflow: 'hidden',
        },
      ]}
      onPress={() => setShowDefaults(true)}>
      {!showDefaults && <FAicons name="plus" size={40} color="#dfdfdf42" />}
      {showDefaults && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flexDirection: 'column',
          }}>
          {mockDefaults.map((e, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setShowDefaults(false);
                addExpenseCard(monthID);
              }}
              style={{
                height: cardHeight * 0.6,
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: e.img}}
                width={extendedCards ? extendedWidth : normalWidth}
                height={cardHeight * 0.6}
                style={{
                  position: 'absolute',
                }}
              />
              <View
                style={{
                  width: extendedCards ? extendedWidth : normalWidth,
                  height: cardHeight * 0.6,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  position: 'absolute',
                }}
              />
              <Text
                style={{
                  color: Colors.white(0.8),
                  fontSize: PixelRatio.roundToNearestPixel(15),
                  fontFamily: 'Mukta-Medium',
                  marginLeft: PixelRatio.roundToNearestPixel(6),
                }}>
                {e.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </TouchableOpacity>
  );
});

export default AddExpenseCard;
