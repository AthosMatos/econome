import {NavigationContainer} from '@react-navigation/native';
import Home from './src/Pages/Home';
import GeneralContext from './src/context/generalContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ExpenseDetailsPage from './src/Pages/ExpenseDetails';

const Stack = createNativeStackNavigator();

export const App = () => {
  return (
    <GeneralContext>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'fade_from_bottom',
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ExpenseDetailsPage"
            component={ExpenseDetailsPage}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GeneralContext>
  );
};
