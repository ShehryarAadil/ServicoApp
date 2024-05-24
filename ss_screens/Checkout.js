import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';

const Checkout = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    city: '',
    liveLocation: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const cities = ["Faisalabad", "Lahore", "Islamabad", "Karachi", "Multan"];

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'Cart'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      handleInputChange('liveLocation', `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`);
    })();
  }, []);

  const handleInputChange = (name, value) => {
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const fetchServiceCategory = async (serviceId) => {
    const serviceQuery = query(collection(db, 'Services'), where('ServiceId', '==', serviceId));
    const serviceSnapshot = await getDocs(serviceQuery);

    if (serviceSnapshot.empty) {
      throw new Error(`Service with id ${serviceId} not found`);
    }

    const serviceData = serviceSnapshot.docs[0].data();
    return serviceData.S_Category;
  };

  const handleConfirmOrder = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.city || !userInfo.liveLocation) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        const batch = writeBatch(db);

        for (const item of cartItems) {
          const serviceCategory = await fetchServiceCategory(item.serviceId);

          const orderDetails = {
            userId: user.uid,
            userInfo,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            servicePrice: item.servicePrice,
            serviceCounter: item.counter || 1,
            orderDate: new Date(),
            S_Category: serviceCategory, // Include the service category
          };

          const docRef = doc(collection(db, 'PendingRequest'));
          batch.set(docRef, orderDetails);
        }

        // Delete cart items
        const cartQuery = query(collection(db, 'Cart'), where('userId', '==', user.uid));
        const cartSnapshot = await getDocs(cartQuery);
        cartSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();

        Alert.alert('Order Confirmed', 'Your order has been confirmed.', [
          { text: 'OK', onPress: () => navigation.navigate('Services') },
        ]);
      } catch (error) {
        console.error('Error confirming order: ', error);
        Alert.alert('Error', 'There was an error confirming your order. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Checkout</Text>
      <Text style={styles.subHeading}>User Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userInfo.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={userInfo.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        keyboardType="phone-pad"
      />
      <Picker
        selectedValue={userInfo.city}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('city', itemValue)}
      >
        {cities.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>
      {location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Location: {location.coords.latitude}, {location.coords.longitude}</Text>
          <WebView
            style={styles.map}
            source={{ uri: userInfo.liveLocation }}
          />
        </View>
      ) : (
        <Text style={styles.locationText}>{errorMsg ? errorMsg : 'Fetching location...'}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Live Location"
        value={userInfo.liveLocation}
        editable={false}
      />

      <Text style={styles.subHeading}>Your Cart</Text>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <View>
              <Text style={styles.serviceName}>Service: {item.serviceName}</Text>
              <Text style={styles.servicePrice}>Price: Rs{item.servicePrice * (item.counter || 1)}</Text>
              <Text style={styles.serviceCounter}>Quantity: {item.counter || 1}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      )}

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 200,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
    color: '#555',
  },
  serviceCounter: {
    fontSize: 16,
    color: '#555',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;
