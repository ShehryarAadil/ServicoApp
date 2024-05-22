// SS_Call.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import SS_Call
import Registration from './Registraion'

const Stack = createStackNavigator();

const Sp_Call = () => {
    return (
      <Stack.Navigator initialRouteName="Registraion" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Registration" component={Registration} />  
      </Stack.Navigator>
    );
  };

  export default Sp_Call;