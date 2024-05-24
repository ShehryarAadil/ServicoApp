// ToDoWork.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

const ToDoWork = () => {
  const [toDoWork, setToDoWork] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'Sp_Data'), where('Email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userData && isConnected) {
      const q = query(collection(db, 'ToDoWork'), where('email', '==', auth.currentUser.email));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const work = [];
        querySnapshot.forEach((doc) => {
          work.push({ id: doc.id, ...doc.data() });
        });
        setToDoWork(work);
      }, (error) => {
        console.error("Error fetching ToDoWork: ", error);
        Alert.alert('Error', 'Error fetching ToDoWork. Please check your connection.');
      });

      return () => unsubscribe();
    }
  }, [userData, isConnected]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>To Do Work</Text>
      {toDoWork.length > 0 ? (
        toDoWork.map((work, index) => (
          <View key={index} style={styles.workItem}>
            <Text style={styles.workServiceName}>Service: {work.serviceName}</Text>
            <Text style={styles.workDate}>Order Date: {work.orderDate.toDate().toLocaleString()}</Text>
            <Text style={styles.workQuantity}>Quantity: {work.quantity}</Text>
            <Text style={styles.workPrice}>Price: Rs{work.servicePrice}</Text>
            <Text style={styles.workCity}>City: {work.city}</Text>
            <Text style={styles.workName}>Name: {work.name}</Text>
            <Text style={styles.workPhone}>Phone: {work.phone}</Text>
            <Text style={styles.workLocation}>Location: {work.liveLocation}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noWork}>No work assigned.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: '15%',
  },
  workItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  workServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workDate: {
    fontSize: 14,
    color: '#555',
  },
  workQuantity: {
    fontSize: 14,
    color: '#555',
  },
  workPrice: {
    fontSize: 14,
    color: '#555',
  },
  workCity: {
    fontSize: 14,
    color: '#555',
  },
  workName: {
    fontSize: 14,
    color: '#555',
  },
  workPhone: {
    fontSize: 14,
    color: '#555',
  },
  workLocation: {
    fontSize: 14,
    color: '#555',
  },
  noWork: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ToDoWork;
