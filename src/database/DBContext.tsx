import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  MonthlyBudgetDB,
  MonthlyBudgetDBI,
  MonthlyBudgetDBIUpdate,
} from './Data/MonthlyBudgetDB';
import {useRealm} from '@realm/react';
import {BSON, Object} from 'realm';
import {ExpenseDB, ExpenseDBI} from './Data/ExpenseDB';
import {BillDB, BillDBI} from './Data/BillDB';

interface DBContextI {
  states: {
    currMonthID: BSON.ObjectId | null;
    currExpenseID: BSON.ObjectId | null;
    monthlyBudgets: MonthlyBudgetDBI[];
    expenses: ExpenseDBI[];
    loadingData: boolean;
  };
  setStates: {
    setCurrMonthID: React.Dispatch<React.SetStateAction<BSON.ObjectId | null>>;
    setCurrExpenseID: React.Dispatch<
      React.SetStateAction<BSON.ObjectId | null>
    >;
    setMonthlyBudgets: React.Dispatch<React.SetStateAction<MonthlyBudgetDBI[]>>;
    setExpenses: React.Dispatch<React.SetStateAction<ExpenseDBI[]>>;
    setLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  };

  funcs: {
    delete: {
      deleteExpenseCard: (id: BSON.ObjectId) => void;
      deleteBudget: (id: BSON.ObjectId) => void;
      deleteBill: (id: BSON.ObjectId) => void;
    };
    add: {
      addExpenseCard: (monthID: BSON.ObjectId) => void;
      addMonthlyBudget: (obj: MonthlyBudgetDBI) => void;
      addBill: (obj: BillDBI) => void;
    };
    get: {
      getBills: (expenseID: BSON.ObjectId) => BillDBI[];
      getMonthlyBudget(monthID: BSON.ObjectId): MonthlyBudgetDBI | null;
      getExpenses: (monthID?: BSON.ObjectId) => ExpenseDBI[];
      getMonthlyBudgets: () => MonthlyBudgetDBI[];
      getExpense: (id: BSON.ObjectId) => ExpenseDBI | null;
    };

    update: {
      updateBill: (id: BSON.ObjectId, update: Partial<BillDBI>) => void;
      updateMonthlyBudget: (
        id: BSON.ObjectId,
        update: Partial<MonthlyBudgetDBI>,
      ) => void;
      updateExpense: (id: BSON.ObjectId, update: Partial<ExpenseDBI>) => void;
    };
  };
}

const DBContext = createContext<DBContextI>({} as any);

export const DBProvider = ({children}: {children: any}) => {
  const realm = useRealm();

  const [currMonthID, setCurrMonthID] = useState<BSON.ObjectId | null>(null);
  const [currExpenseID, setCurrExpenseID] = useState<BSON.ObjectId | null>(
    null,
  );
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudgetDBI[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDBI[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    /*  realm.write(() => {
      realm.deleteAll();
    }); */
    //mockMonthlyBudget();
    /* createTheme(realm, {
      colors: [
        'hsl(0, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(240, 100%, 50%)',
      ],
    }); */
    const mb = getMonthlyBudgets();
    if (mb.length > 0) {
      console.log(mb);
      setCurrMonthID(mb[0]._id);
    }
  }, []);

  function getMonthlyBudgets() {
    return realm.objects<MonthlyBudgetDB>('MonthlyBudget').map(mb => {
      const monthlyBudget: MonthlyBudgetDBI = {
        _id: mb._id,
        currentValue: mb.currentValue,
        maxValue: mb.maxValue,
        month: mb.month,
        year: mb.year,
      };
      return monthlyBudget;
    });
  }

  function getMonthlyBudget(monthID: BSON.ObjectId) {
    const m = realm.objectForPrimaryKey<MonthlyBudgetDB>(
      'MonthlyBudget',
      monthID,
    );
    if (m) {
      const mi: MonthlyBudgetDBI = {
        _id: m._id,
        currentValue: m.currentValue,
        maxValue: m.maxValue,
        month: m.month,
        year: m.year,
      };
      return mi;
    }
    return null;
  }

  function getExpenses(monthID?: BSON.ObjectId) {
    if (monthID) {
      return realm
        .objects<ExpenseDB>('Expense')
        .filter(e => e.currMonthID.equals(monthID))
        .map(e => {
          const exps: ExpenseDBI = {
            currMonthID: e.currMonthID,
            id: e._id,
            img: e.img,
            maxValue: e.maxValue,
            name: e.name,
            value: e.value,
          };
          return exps;
        });
    } else {
      return realm.objects<ExpenseDB>('Expense').map(e => {
        const exps: ExpenseDBI = {
          currMonthID: e.currMonthID,
          id: e._id,
          img: e.img,
          maxValue: e.maxValue,
          name: e.name,
          value: e.value,
        };
        return exps;
      });
    }
  }

  function addExpenseCard(monthID: BSON.ObjectId) {
    const obj: ExpenseDBI = {
      id: new BSON.ObjectId(),
      name: 'Novo Gasto',
      value: 0,
      maxValue: 1000,
      img: '',
      currMonthID: monthID,
    };
    setExpenses([...expenses, obj]);

    realm.write(() => {
      realm.create<ExpenseDB>('Expense', {
        _id: obj.id,
        name: obj.name,
        value: obj.value,
        maxValue: obj.maxValue,
        img: obj.img,
        currMonthID: obj.currMonthID,
      });
    });
  }

  function addMonthlyBudget(obj: MonthlyBudgetDBI) {
    realm.write(() => {
      realm.create<MonthlyBudgetDB>('MonthlyBudget', {
        _id: obj._id,
        month: obj.month,
        year: obj.year,
        currentValue: obj.currentValue,
        maxValue: obj.maxValue,
      });
    });
  }

  function addBill(obj: BillDBI) {
    realm.write(() => {
      realm.create<BillDB>('Bill', {
        _id: obj.id,
        name: obj.name,
        value: obj.value,
        expenseID: obj.expenseID,
      });
    });
  }

  function updateMonthlyBudget(
    id: BSON.ObjectId,
    update: Partial<MonthlyBudgetDBI>,
  ) {
    realm.write(() => {
      const monthly = realm.objectForPrimaryKey<MonthlyBudgetDB>(
        'MonthlyBudget',
        id,
      );
      if (monthly) {
        update.month && (monthly.month = update.month);
        update.year && (monthly.year = update.year);
        update.maxValue && (monthly.maxValue = update.maxValue);
        update.currentValue && (monthly.currentValue = update.currentValue);
      }
    });
  }

  function updateExpense(id: BSON.ObjectId, update: Partial<ExpenseDBI>) {
    realm.write(() => {
      const expense = realm.objectForPrimaryKey<ExpenseDB>('Expense', id);
      if (expense) {
        update.name && (expense.name = update.name);
        update.value && (expense.value = update.value);
        update.maxValue && (expense.maxValue = update.maxValue);
        update.img && (expense.img = update.img);
      }
    });
  }

  function deleteBillFromExpense(expenseID: BSON.ObjectId) {
    const bills = realm
      .objects<BillDB>('Bill')
      .filter(b => b.expenseID.equals(expenseID));
    realm.delete(bills);
  }

  function deleteExpenseCard(id: BSON.ObjectId) {
    realm.write(() => {
      const expense = realm.objectForPrimaryKey<ExpenseDB>('Expense', id);
      if (expense) {
        const month = realm.objectForPrimaryKey<MonthlyBudgetDB>(
          'MonthlyBudget',
          expense.currMonthID,
        );
        realm.delete(expense);
        deleteBillFromExpense(id);
        if (month) {
          const expenses = realm
            .objects<ExpenseDB>('Expense')
            .filter(e => e.currMonthID.equals(month._id));

          month.currentValue = expenses.reduce((acc, e) => acc + e.value, 0);
        }
      }
    });
  }

  function deleteBill(id: BSON.ObjectId) {
    realm.write(() => {
      const bill = realm.objectForPrimaryKey<BillDB>('Bill', id);
      if (bill) {
        realm.delete(bill);
      }
    });
  }

  function deleteExpensesFromBudget(budgetID: BSON.ObjectId) {
    const expenses = realm
      .objects<ExpenseDB>('Expense')
      .filter(e => e.currMonthID.equals(budgetID));
    const bills = realm
      .objects<BillDB>('Bill')
      .filter(b => expenses.map(e => e._id).includes(b.expenseID));
    realm.delete(bills);
    realm.delete(expenses);
  }

  function deleteBudget(id: BSON.ObjectId) {
    realm.write(() => {
      const budget = realm.objectForPrimaryKey<MonthlyBudgetDB>(
        'MonthlyBudget',
        id,
      );
      if (budget) {
        realm.delete(budget);
        deleteExpensesFromBudget(id);
      }
    });
  }

  function getBills(expenseID: BSON.ObjectId) {
    return realm
      .objects<BillDB>('Bill')
      .filter(b => b.expenseID.equals(expenseID))
      .map(b => {
        const bill: BillDBI = {
          id: b._id,
          expenseID: b.expenseID,
          name: b.name,
          value: b.value,
        };
        return bill;
      });
  }

  function getExpense(id: BSON.ObjectId) {
    const e = realm.objectForPrimaryKey<ExpenseDB>('Expense', id);
    if (e) {
      const expense: ExpenseDBI = {
        currMonthID: e.currMonthID,
        id: e._id,
        img: e.img,
        maxValue: e.maxValue,
        name: e.name,
        value: e.value,
      };
      return expense;
    }
    return null;
  }

  function updateBill(id: BSON.ObjectId, update: Partial<BillDBI>) {
    realm.write(() => {
      const bill = realm.objectForPrimaryKey<BillDB>('Bill', id);
      if (bill) {
        update.name && (bill.name = update.name);
        if (update.value) {
          bill.value = update.value;
          const expense = realm.objectForPrimaryKey<ExpenseDB>(
            'Expense',
            bill.expenseID,
          );
          if (expense) {
            const bills = realm
              .objects<BillDB>('Bill')
              .filter(b => b.expenseID.equals(expense._id));
            expense.value = bills.reduce((acc, b) => acc + b.value, 0);

            const monthly = realm.objectForPrimaryKey<MonthlyBudgetDB>(
              'MonthlyBudget',
              expense.currMonthID,
            );
            if (monthly) {
              const expenses = realm
                .objects<ExpenseDB>('Expense')
                .filter(e => e.currMonthID.equals(monthly._id));
              monthly.currentValue = expenses.reduce(
                (acc, e) => acc + e.value,
                0,
              );
            }
          }
        }
      }
    });
  }

  const funcs = {
    delete: {
      deleteExpenseCard,
      deleteBudget,
      deleteBill,
    },
    add: {
      addExpenseCard,
      addMonthlyBudget,
      addBill,
    },
    get: {
      getBills,
      getMonthlyBudget,
      getExpenses,
      getMonthlyBudgets,
      getExpense,
    },
    update: {
      updateBill,
      updateMonthlyBudget,
      updateExpense,
    },
  };

  const setStates = {
    setCurrMonthID,
    setCurrExpenseID,
    setMonthlyBudgets,
    setExpenses,
    setLoadingData,
  };

  const states = {
    currMonthID,
    currExpenseID,
    monthlyBudgets,
    expenses,
    loadingData,
  };

  return (
    <DBContext.Provider value={{states, setStates, funcs}}>
      {children}
    </DBContext.Provider>
  );
};

export const useDBContext = () => {
  const context = useContext(DBContext);
  return context;
};
