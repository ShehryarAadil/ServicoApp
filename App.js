import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './Home/Start';
import Choose_Ss_Sp from './Home/Choose_Ss_Sp';
import Ss_Call from './ss_screens/SS_Call';
import Sp_Call from './sp_screen/Sp_Call';
import Sp_Dashboard from './sp_screen/Sp_Dashboard';
import Services from './ss_screens/Services';
import GardenerScreen from './ss_screens/GardenerScreen';
import Checkout from './ss_screens/Checkout';
import Sp_Pending_Request from './sp_screen/Sp_Pending_Request';
import To_Do_Work from './sp_screen/To_Do_Work'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
          <Stack.Screen name="Choose_Ss_Sp" component={Choose_Ss_Sp} options={{ headerShown: false }} />
          <Stack.Screen name="Ss_Call" component={Ss_Call} options={{ headerShown: false }} />
          <Stack.Screen name="Sp_Call" component={Sp_Call} options={{ headerShown: false }} />
          <Stack.Screen name="Sp_Dashboard" component={Sp_Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Services" component={Services} options={{ headerShown: false }} />
          <Stack.Screen name="GardenerScreen" component={GardenerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
          <Stack.Screen name="Sp_Pending_Request" component={Sp_Pending_Request} options={{ headerShown: false }} />
          <Stack.Screen name="To_Do_Work" component={To_Do_Work} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
