import { createContext, useContext, useEffect, useState } from "react";
import { AppDataI } from "../Pages/Home";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextI {
    funcs: {
        setAppData: (data: AppDataI[]) => void;
        setPageIndex: (index: number) => void;
        getDBData: () => void;
        addEmptyMonth: () => void;
        addEmptyBill: (month: string) => void;
        editBill: (id: number, name: string, value: number) => void;
        deleteBill: (id: number) => void;
        editMonthBill: (MaxBill: number) => void;
        addEmptyExpense: () => void;
        deleteExpense: () => void;
    };
    states: {
        AppData: AppDataI[];
        pageIndex: number;
        currentBill: AppDataI | undefined;
    };
}

const AllMonths = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

const AppContext = createContext<AppContextI>({} as any);

export const AppProvider = ({ children }: { children: any }) => {
    const [AppData, setAppData] = useState<AppDataI[]>([]);
    const [currentBill, setCurrentBill] = useState<AppDataI>();
    const [pageIndex, setPageIndex] = useState(0);

    async function getDBData() {
        try {
            const item = await AsyncStorage.getItem('AppData')

            if (item != null) {
                setAppData(JSON.parse(item).data)
            }


        } catch (error) {
            console.log(error);
        }
    }

    function addEmptyMonth() {
        const nextMonth = AllMonths[AppData.length]
        setAppData((data) => [...data, {
            month: nextMonth,
            Bill: 0,
            MaxBill: 0,
            Bills: []
        }])
    }

    function addEmptyBill() {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills.push({
            id: newAppData[mIndex].Bills.length + 1,
            name: '',
            value: 0
        })
        setAppData(newAppData)
    }

    function editBill(id: number, name: string, value: number) {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills = newAppData[mIndex].Bills.map((bill) => {
            if (bill.id == id) {
                return {
                    ...bill,
                    name,
                    value
                }
            }
            else {
                return bill
            }
        })
        //sum all bills
        const sum = newAppData[pageIndex].Bills.reduce((acc, bill) => acc + bill.value, 0)
        //set the sum to the current bill
        newAppData[pageIndex].Bill = sum

        setAppData(newAppData)
    }

    function deleteBill(id: number) {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills = newAppData[mIndex].Bills.filter((bill) => bill.id != id)
        setAppData(newAppData)
    }

    function editMonthBill(MaxBill: number) {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].MaxBill = MaxBill
        //sum all bills
        const sum = newAppData[mIndex].Bills.reduce((acc, bill) => acc + bill.value, 0)
        //set the sum to the current bill
        newAppData[mIndex].Bill = sum

        setAppData(newAppData)
    }

    function addEmptyExpense() {
        const newAppData = [...AppData]

        let nextMonth = AllMonths[0]
        let nextMonthIndex = 0
        if (newAppData.length > 0) {
            const lastMonth = newAppData[newAppData.length - 1].month
            nextMonthIndex = AllMonths.indexOf(lastMonth) + 1
            nextMonth = AllMonths[nextMonthIndex]
        }

        if (nextMonthIndex < AllMonths.length) {
            newAppData.push({
                month: nextMonth,
                Bill: 0,
                MaxBill: 0,
                Bills: []
            })

            setAppData(newAppData)
        }

    }

    function deleteExpense() {
        const newAppData = [...AppData]
        const mIndex = pageIndex

        newAppData.splice(mIndex, 1)
        setAppData(newAppData)

    }

    useEffect(() => {
        changeNavigationBarColor('#464660', false, true);
        //AsyncStorage.clear();
        /*  async function mock() {
 
             await AsyncStorage.setItem('AppData', JSON.stringify({
                 data: [{
                     month: 'Janeiro',
                     Bill: 1500,
                     MaxBill: 3000,
                     Bills: [
                         {
                             id: 1,
                             name: 'Nubank',
                             value: 700,
                         },
                         {
                             id: 2,
                             name: 'Cartão de Crédito',
                             value: 300,
                         },
                         {
                             id: 3,
                             name: 'Aluguel',
                             value: 300,
                         },
                         {
                             id: 4,
                             name: 'Luz',
                             value: 200,
                         },
                     ]
                 },
                 {
                     month: 'Fevereiro',
                     Bill: 500,
                     MaxBill: 3100,
                     Bills: [
                         {
                             id: 1,
                             name: 'Will',
                             value: 200,
                         },
                         {
                             id: 2,
                             name: 'SM',
                             value: 300,
                         },
                     ]
                 },
                 {
                     month: 'Março',
                     Bill: 800,
                     MaxBill: 3050,
                     Bills: [
                         {
                             id: 1,
                             name: 'Nu',
                             value: 300,
                         },
                         {
                             id: 2,
                             name: 'BB',
                             value: 200,
                         },
                         {
                             id: 3,
                             name: 'Picpay',
                             value: 300,
                         },
                     ]
                 },
                 ]
             }))
             getDBData()
         } */

        getDBData()
        //mock()

    }, [])

    /* 
    AsyncStorage.setItem('AppData', JSON.stringify({
                data:
    */

    useEffect(() => {
        if (AppData.length > 0) {

            setCurrentBill(AppData[pageIndex])
            AsyncStorage.setItem('AppData', JSON.stringify({
                data: AppData
            }))
        }
    }, [AppData]);


    useEffect(() => {
        if (AppData.length > 0) {
            setCurrentBill(AppData[pageIndex])
        }
    }, [pageIndex]);

    const funcs = {
        setAppData,
        setPageIndex,
        getDBData,
        addEmptyMonth,
        addEmptyBill,
        editBill,
        deleteBill,
        editMonthBill,
        addEmptyExpense,
        deleteExpense
    }

    const states = {
        AppData,
        pageIndex,
        currentBill
    }

    return (
        <AppContext.Provider value={{ funcs, states }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
}