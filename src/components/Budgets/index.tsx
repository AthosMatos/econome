import {Dimensions, ScrollView} from 'react-native';
import {View} from 'react-native';
import {useDBContext} from '../../database/DBContext';
import {MonthlyBudget} from './MonthlyBudget';
import {AddMonthlyBudget} from './MonthlyBudget/Add';
import {useCallback, useEffect, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Budgets = () => {
  const {
    states: {currMonthID, monthlyBudgets, loadingData},
    setStates: {setCurrMonthID, setMonthlyBudgets, setLoadingData},
    funcs: {
      get: {getMonthlyBudgets},
    },
  } = useDBContext();
  const ScrollViewRef = useRef<ScrollView>(null);

  function scrollToPage(page: number) {
    ScrollViewRef.current?.scrollTo({
      x: page * Dimensions.get('window').width,
      animated: true,
    });
  }

  function goToPage(e: any) {
    const page = Math.round(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );

    const mID = monthlyBudgets[page]?._id;

    // !loadingData && setLoadingData(true);
    if (mID) {
      console.log(page);
      if (mID !== currMonthID) {
        setCurrMonthID(mID);
        // setLoadingData(false);
      }
    } else {
      if (currMonthID !== null) {
        setCurrMonthID(null);
        // setLoadingData(false);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      const mb = getMonthlyBudgets();
      if (mb.length > 0) {
        setMonthlyBudgets(mb);
      }
    }, []),
  );

  return (
    <View>
      <ScrollView
        ref={ScrollViewRef}
        horizontal={true}
        pagingEnabled={true}
        onScroll={goToPage}
        showsHorizontalScrollIndicator={false}>
        <GestureHandlerRootView
          style={{
            flexDirection: 'row',
          }}>
          {monthlyBudgets.map(item => (
            <MonthlyBudget
              scrollToPage={scrollToPage}
              key={item._id.toString()}
              budget={item}
            />
          ))}
        </GestureHandlerRootView>
        <AddMonthlyBudget
          monthlyBudgets={monthlyBudgets}
          setMonthlyBudgets={setMonthlyBudgets}
        />
      </ScrollView>
    </View>
  );
};

export default Budgets;
