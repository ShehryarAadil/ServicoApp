import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC2pDrN3fiLGXfaJpEd_LuqBYGlOuDJpYs',
  authDomain: 'servico-8505f.firebaseapp.com',
  projectId: 'servico-8505f',
  storageBucket: 'servico-8505f.appspot.com',
  messagingSenderId: '903015491253',
  appId: '1:903015491253:web:3577d2f4090a3b8875c0fc',
  measurementId: 'G-5LDR4KVS7T',
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const db = getFirestore(app)

export { app, auth, db }