import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log('User ID:', user.uid); // Debug: Verify user ID
        const q = query(collection(db, 'Cart'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), counter: doc.data().counter || 1 }));
        console.log('Fetched Cart Items:', items); // Debug: Verify fetched items
        setCartItems(items);
      } else {
        console.log('No user is logged in'); // Debug: Verify user authentication
      }
    };

    fetchCartItems();
  }, []);

  const handleIncrement = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].counter = (updatedItems[index].counter || 1) + 1;
    setCartItems(updatedItems);
  };

  const handleDecrement = (index) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].counter > 1) {
      updatedItems[index].counter -= 1;
      setCartItems(updatedItems);
    }
  };

  const handleProceedToCheckout = async () => {
    const user = auth.currentUser;
    if (user) {
      const batch = writeBatch(db);
      cartItems.forEach((item) => {
        const cartDocRef = doc(db, 'Cart', item.id);
        batch.update(cartDocRef, { counter: item.counter || 1 });
      });
      await batch.commit();
      console.log('Cart items updated with counters.');
      navigation.navigate('Checkout'); // Navigate to Checkout screen
    }
  };

  return (
    <ImageBackground source={require('../assets/hamburger_Bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Your Cart</Text>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View>
                <Text style={styles.serviceName}>Service: {item.serviceName}</Text>
                <Text style={styles.servicePrice}>Price: Rs{item.servicePrice * (item.counter || 1)}</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => handleDecrement(index)} style={styles.counterButton}>
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterText}>{item.counter || 1}</Text>
                <TouchableOpacity onPress={() => handleIncrement(index)} style={styles.counterButton}>
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCart}>Your cart is empty.</Text>
        )}
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToCheckout}>
            <Text style={styles.proceedButtonText}>Proceed to send request</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: '15%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
  emptyCart: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  proceedButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
