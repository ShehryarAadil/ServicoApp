import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Sp_Pending_Request = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userData, setUserData] = useState(null);

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
    if (userData) {
      const q = query(
        collection(db, 'PendingRequest'),
        where('S_Category', '==', userData.S_Category),
        where('userInfo.city', '==', userData.City)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setPendingRequests(requests);
      });

      return () => unsubscribe();
    }
  }, [userData]);

  const handleAcceptRequest = async (request) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Prepare the data to be saved in the ToDoWork collection
        const toDoWorkData = {
          name: request.userInfo.name,
          phone: request.userInfo.phone,
          city: request.userInfo.city,
          serviceName: request.serviceName,
          servicePrice: request.servicePrice,
          quantity: request.serviceCounter,
          orderDate: request.orderDate,
          liveLocation: request.userInfo.liveLocation,
          email: user.email,
        };

        // Save the data in the ToDoWork collection
        await addDoc(collection(db, 'ToDoWork'), toDoWorkData);

        // Delete the document from the PendingRequest collection
        await deleteDoc(doc(db, 'PendingRequest', request.id));

        Alert.alert('Success', 'Request accepted and added to To Do Work.');
      } catch (error) {
        console.error('Error accepting request: ', error);
        Alert.alert('Error', 'There was an error accepting the request. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pending Requests</Text>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((request, index) => (
          <View key={index} style={styles.requestItem}>
            <Text style={styles.requestServiceName}>Service: {request.serviceName}</Text>
            <Text style={styles.requestDate}>Order Date: {request.orderDate.toDate().toLocaleString()}</Text>
            <Text style={styles.requestQuantity}>Quantity: {request.serviceCounter}</Text>
            <Text style={styles.requestPrice}>Price: Rs{request.servicePrice}</Text>
            <Text style={styles.requestCity}>City: {request.userInfo.city}</Text>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(request)}>
              <Text style={styles.acceptButtonText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noRequests}>No pending requests.</Text>
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
  requestItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  requestServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestDate: {
    fontSize: 14,
    color: '#555',
  },
  requestQuantity: {
    fontSize: 14,
    color: '#555',
  },
  requestPrice: {
    fontSize: 14,
    color: '#555',
  },
  requestCity: {
    fontSize: 14,
    color: '#555',
  },
  noRequests: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  acceptButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2a9d8f',
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sp_Pending_Request;
