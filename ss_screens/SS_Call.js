// SS_Call.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ElectricalScreen from './ElectricalScreen'; 
import CleaningScreen from './CleaningScreen'; 
import PlumberScreen from './PlumberScreen';  
import SaloonScreen from './SaloonScreen'; 
import CarpenterScreen from './CarpenterScreen';  
import MechanicScreen from './MechanicScreen';  
import PaintingScreen from './PaintingScreen';  
import GardenerScreen from './GardenerScreen';  
import Cart from './Cart';
//import SS_Call
import Services from './Services';

const Stack = createStackNavigator();

const SS_Call = () => {
    return (
      <Stack.Navigator initialRouteName="Services" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Services" component={Services} />  
        <Stack.Screen name="ElectricalScreen" component={ElectricalScreen} />
        <Stack.Screen name="CleaningScreen" component={CleaningScreen} />
        <Stack.Screen name="PlumberScreen" component={PlumberScreen} />
        <Stack.Screen name="SaloonScreen" component={SaloonScreen} />
        <Stack.Screen name="CarpenterScreen" component={CarpenterScreen} />
        <Stack.Screen name="MechanicScreen" component={MechanicScreen} />
        <Stack.Screen name="PaintingScreen" component={PaintingScreen} />
        <Stack.Screen name="GardenerScreen" component={GardenerScreen} />
       <Stack.Screen name='Cart' component={Cart}/>
      </Stack.Navigator>
    );
  };

  export default SS_Call;