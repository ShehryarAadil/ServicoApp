// SS_Call.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import SS_Call
import Services from '../ss_screens/Services';

const Stack = createStackNavigator();

const Sp_Call = () => {
    return (
      <Stack.Navigator initialRouteName="Services" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Services" component={Services} />  
      </Stack.Navigator>
    );
  };

  export default Sp_Call;