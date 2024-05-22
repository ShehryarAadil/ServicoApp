import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './Home/Start';
import Choose_Ss_Sp from './Home/Choose_Ss_Sp';
import Ss_Call from './ss_screens/SS_Call';
import Sp_Call from './sp_screen/Sp_Call';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        <Stack.Screen name="Choose_Ss_Sp" component={Choose_Ss_Sp} options={{ headerShown: false }} />
        <Stack.Screen name="Ss_Call" component={Ss_Call} options={{ headerShown: false }} />
        <Stack.Screen name="Sp_Call" component={Sp_Call} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;