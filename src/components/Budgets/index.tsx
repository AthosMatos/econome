import {
  Dimensions,
  FlatList,
  PixelRatio,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {View} from 'react-native';
import {useDBContext} from '../../database/DBContext';
import {MonthlyBudget} from './MonthlyBudget';
import {AddMonthlyBudget} from './MonthlyBudget/Add';
import {useCallback, useEffect, useRef} from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {normalWidth} from '../ExpenseCard/styles';
import {MonthlyBudgetDBI} from '../../database/Data/MonthlyBudgetDB';
import {BSON} from 'realm';
import ExpenseCard from '../ExpenseCard';
import AddExpenseCard from '../ExpenseCard/AddExpenseCard';

const gap = PixelRatio.roundToNearestPixel(15);

const Budgets = () => {
  const {
    states: {currMonthID, monthlyBudgets, expenses},
    setStates: {setCurrMonthID, setMonthlyBudgets, setExpenses},
    funcs: {
      get: {getMonthlyBudgets, getExpenses},
    },
  } = useDBContext();
  const FlatListRef = useRef<FlatList>(null);

  const route = useRoute();
  function scrollToPage(page: number) {
    // console.log('scrollToPage', page);

    FlatListRef.current?.scrollToIndex({index: page, animated: true});
  }

  function goToPage(e: any) {
    const page = Math.round(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );

    const mID = monthlyBudgets[page]?._id;

    // !loadingData && setLoadingData(true);
    if (mID) {
      //console.log(page);
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
        const exps = getExpenses();
        setExpenses(exps);
        //console.log('exps', exps.length);
      }

      /* if (currMonthID) {
        console.log('currMonthID', currMonthID);
        const exps = getExpenses(currMonthID);
        setExpenses(exps);
      } else {
        setExpenses([]);
      } */
    }, []),
  );

  const RenderMonthlyBudget = ({item: month}: {item: MonthlyBudgetDBI}) => {
    const exps = expenses.filter(e => e.currMonthID.equals(month._id));
    exps.push({
      currMonthID: null,
      id: new BSON.ObjectId(),
      img: null,
      maxValue: null,
      name: null,
      value: null,
      isAdd: true,
    } as any);

    return (
      <GestureHandlerRootView
        style={{
          width: Dimensions.get('window').width,
          alignItems: 'center',
          justifyContent: 'center',
          gap: gap,
        }}>
        <MonthlyBudget budget={month} scrollToPage={scrollToPage} />

        <FlatList
          data={exps}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return item.isAdd == true ? (
              <AddExpenseCard monthID={month._id} />
            ) : (
              <ExpenseCard expense={item} />
            );
          }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          //stickyHeaderIndices={[0]}
          columnWrapperStyle={{
            gap: gap,
            width: normalWidth * 2 + gap * 2,
            justifyContent: 'center',
          }}
          contentContainerStyle={{
            gap: gap,
          }}
        />
      </GestureHandlerRootView>
    );
  };

  return (
    <FlatList
      ref={FlatListRef}
      data={monthlyBudgets}
      keyExtractor={item => item._id.toString()}
      renderItem={RenderMonthlyBudget}
      horizontal
      onScroll={goToPage}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={
        <AddMonthlyBudget
          monthlyBudgets={monthlyBudgets}
          setMonthlyBudgets={setMonthlyBudgets}
        />
      }
      //onScroll={goToPage}
    />
  );
};

export default Budgets;
