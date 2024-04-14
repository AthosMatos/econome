import Realm, {BSON, Object, ObjectSchema} from 'realm';
import {BillDB} from './BillDB';

/* 
- MonthlyBudget
    - - Expense
        - - - Bill
*/
/* 

- Expense
    name
    value
    maxValue
    img
*/

// Define your object model

export interface ExpenseDBI {
  id: BSON.ObjectID;

  name: string;
  value: number;
  maxValue: number;
  img: string;

  currMonthID: BSON.ObjectID;

  isAdd?: boolean;
}

export class ExpenseDB extends Object<ExpenseDB> {
  _id!: BSON.ObjectId;
  name!: string;
  value!: number;
  maxValue!: number;
  img!: string;

  currMonthID!: BSON.ObjectID;

  static schema: ObjectSchema = {
    name: 'Expense',
    properties: {
      _id: 'objectId',
      name: 'string',
      value: 'float',
      maxValue: 'float',
      img: 'string',

      currMonthID: 'objectId',
    },
    primaryKey: '_id',
  };
}
