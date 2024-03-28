import Realm, {BSON, Object, ObjectSchema} from 'realm';

export interface ThemeDBI {
  id: BSON.ObjectId;
  colors: string[];

  PrevUsedImgs: string[];
}

export class ThemeDB extends Object<ThemeDB> {
  _id!: BSON.ObjectId;
  colors!: string[];
  PrevUsedImgs!: string[];

  static schema: ObjectSchema = {
    name: 'Theme',
    properties: {
      _id: 'objectId',
      colors: 'string[]',
      PrevUsedImgs: 'string[]',
    },
    primaryKey: '_id',
  };
}
