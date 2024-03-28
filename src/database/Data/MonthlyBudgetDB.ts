import Realm, {BSON, Object, ObjectSchema} from 'realm';

/* 
- MonthlyBudget
    - - Expense
        - - - Bill
*/
/* 

- MonthlyBudget
    currentValue
    maxValue
    month
*/

// Define your object model

export interface MonthlyBudgetDBI {
  _id: BSON.ObjectId;

  currentValue: number;
  maxValue: number;
  month: string;
  year: number;
}
export interface MonthlyBudgetDBIUpdate {
  _id?: BSON.ObjectId;

  currentValue?: number;
  maxValue?: number;
  month?: string;
  year?: number;
}

export class MonthlyBudgetDB extends Object<MonthlyBudgetDB> {
  _id!: BSON.ObjectId;
  currentValue!: number;
  maxValue!: number;
  month!: string;
  year!: number;

  static schema: ObjectSchema = {
    name: 'MonthlyBudget',
    properties: {
      _id: 'objectId',
      currentValue: 'float',
      maxValue: 'float',
      month: 'string',
      year: 'int',
    },
    primaryKey: '_id',
  };
}
