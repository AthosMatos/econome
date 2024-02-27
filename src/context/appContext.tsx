import { createContext, useContext, useEffect, useState } from "react";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BillsExpensesI {
    id: number;
    name: string;
    value: number;
    date: string;
}

export interface BillsI {
    id: number;
    name: string;
    value: number;
    img: any;
    expenses: BillsExpensesI[];
}

export interface AppDataI {
    month: string;
    Bill: number;
    MaxBill: number;
    Bills: BillsI[];
}

interface editExpenseFromBillI {
    billId: number;
    expenseId: number;
    name?: string;
    value?: number;
    date?: string;
}

interface editBillI {
    id: number;
    name?: string;
    value?: number;
    img?: any;
}

interface AppContextI {
    funcs: {
        setAppData: (data: AppDataI[]) => void;
        setPageIndex: (index: number) => void;
        getDBData: () => void;
        addEmptyMonth: () => void;
        addEmptyBill: (month: string) => void;
        editBill: (params: editBillI) => void;
        deleteBill: (id: number) => void;
        editMonthBill: (MaxBill: number) => void;
        addEmptyNewMonth: () => void;
        deleteMonth: () => void;
        getBill: (id: number) => BillsI | undefined;
        addEmptyExpenseToBill: (id: number, streetName?: string | null) => void;
        editExpenseFromBill: (params: editExpenseFromBillI) => void;
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

    function addEmptyExpenseToBill(id: number, streetName?: string | null) {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        const bill = newAppData[mIndex].Bills.find((bill) => bill.id == id)
        if (bill) {
            bill.expenses.push({
                id: bill.expenses.length + 1,
                name: streetName ? streetName : '',
                value: 0,
                date: new Date().toISOString()
            })
            //update total bill value
            bill.value = bill.expenses.reduce((acc, expense) => acc + expense.value, 0)
        }
    }


    function editBill(params: editBillI) {
        const { id, name, value, img } = params
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills = newAppData[mIndex].Bills.map((bill) => {
            if (bill.id == id) {
                const updatedBill = {
                    ...bill,
                }
                if (name) {
                    updatedBill.name = name
                }
                if (value) {
                    updatedBill.value = value
                }
                if (img) {
                    updatedBill.img = img
                }
                return updatedBill
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


    function editExpenseFromBill(params: editExpenseFromBillI) {
        const { billId, expenseId, name, value, date } = params

        const mIndex = pageIndex
        const newAppData = [...AppData]
        const bill = newAppData[mIndex].Bills.find((bill) => bill.id == billId)
        if (bill) {
            bill.expenses = bill.expenses.map((expense) => {
                if (expense.id == expenseId) {
                    const updatedExpense = {
                        ...expense,
                    }
                    if (name) {
                        updatedExpense.name = name
                    }
                    if (value) {
                        updatedExpense.value = value
                    }
                    if (date) {
                        updatedExpense.date = date
                    }
                    return updatedExpense
                }
                else {
                    return expense
                }
            })
            //update total bill value
            bill.value = bill.expenses.reduce((acc, expense) => acc + expense.value, 0)
        }

        setAppData(newAppData)
    }

    function deleteBill(id: number) {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills = newAppData[mIndex].Bills.filter((bill) => bill.id != id)
        setAppData(newAppData)
    }

    function getBill(id: number) {
        const mIndex = pageIndex
        const bill = AppData[mIndex].Bills.find((bill) => bill.id == id)
        return bill
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
    function addEmptyNewMonth() {
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

    function addEmptyBill() {
        const mIndex = pageIndex
        const newAppData = [...AppData]
        newAppData[mIndex].Bills.push({
            id: newAppData[mIndex].Bills.length + 1,
            name: '',
            value: 0,
            img: '',
            expenses: []
        })
        setAppData(newAppData)
    }
    function deleteMonth() {
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
        addEmptyNewMonth,
        deleteMonth,
        getBill,
        addEmptyExpenseToBill,
        editExpenseFromBill,
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