import Realm, {BSON, Object, ObjectSchema} from 'realm';

/* 
- MonthlyBudget
    - - Expense
        - - - Bill
*/
/* 

- Bill
    name
    value
*/

// Define your object model
export interface BillDBI {
  id: BSON.ObjectId;

  name: string;
  value: number;

  expenseID: BSON.ObjectId;
}

export interface BillDBI {
  id: BSON.ObjectId;

  name: string;
  value: number;

  expenseID: BSON.ObjectId;
}

export class BillDB extends Object<BillDB> {
  _id!: BSON.ObjectId;
  name!: string;
  value!: number;

  expenseID!: BSON.ObjectId;

  static schema: ObjectSchema = {
    name: 'Bill',
    properties: {
      _id: 'objectId',
      name: 'string',
      value: 'float',

      expenseID: 'objectId',
    },
    primaryKey: '_id',
  };
}
