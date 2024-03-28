import {MonthlyBudgetDB} from '../database/Data/MonthlyBudgetDB';
import {dbList} from '../database/db_list';
import {contextsList} from './contexts_list';
import {RealmProvider} from '@realm/react';

interface PropsI {
  children: React.ReactNode;
}

const GeneralContext = ({children}: PropsI) => {
  return (
    <RealmProvider schema={dbList}>
      {contextsList.reduceRight((acc, Context) => {
        return <Context>{acc}</Context>;
      }, children)}
    </RealmProvider>
  );
};

export default GeneralContext;
