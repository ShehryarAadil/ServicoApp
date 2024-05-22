import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignInScreen from '../SignIn/SignInScreen';
import SignUpScreen from '../SignUp/SignUpScreen';
import Choose_Ss_Sp from './Choose_Ss_Sp';
import Ss_Call from '../ss_screens/SS_Call'; 
import Sp_Call from '../sp_screen/Sp_Call';

const Stack = createNativeStackNavigator();

export default function Start() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      if (user) {
        setLoggedOut(false); // Reset the logged-out state if a user is detected
      }
    });

    return unsubscribe; // Clean up the subscription
  }, [initializing]);

  if (initializing) return null; // Or a loading spinner

  return (
    <Stack.Navigator>
      {loggedOut || !user ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Choose_Ss_Sp" component={Choose_Ss_Sp} options={{ headerShown: false }} />
          <Stack.Screen name="Ss_Call" component={Ss_Call} options={{ headerShown: false }} />
          <Stack.Screen name="Sp_Call" component={Sp_Call} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Log-out function to be used in the dashboard or other screens
export const handleLogout = (navigation) => {
  signOut(auth)
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Start', params: { loggedOut: true } }],
      });
    })
    .catch((error) => {
      console.error('Error signing out: ', error);
    });
};