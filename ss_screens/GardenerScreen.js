import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Animated, Easing, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const GardenerScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [services, setServices] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef(null);
  const scrollViewRef = useRef(null);

  const images = [
    require('../assets/Gardener1.jpg'),
    require('../assets/logo.png'),
    require('../assets/Gardener1.jpg'),
  ];

  // Define the images and their associated service IDs
  const serviceImages = {
    '100': require('../assets/GardenerServicesImages/Planting.png'),
    '101': require('../assets/GardenerServicesImages/Landscaper.png'),
    '102': require('../assets/GardenerServicesImages/Florist.png'),
    '103': require('../assets/GardenerServicesImages/Greenhouse worker.png'),
    '104': require('../assets/GardenerServicesImages/Irrigation Technician.png'),
  };

  const defaultImage = require('../assets/Arrow.png'); // Define a default image

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const q = query(collection(db, 'Services'), where('S_Category', '==', 'Gardener Service'));
      const querySnapshot = await getDocs(q);
      const servicesList = [];
      querySnapshot.forEach((doc) => {
        servicesList.push({ id: doc.id, ...doc.data() });
      });
      setServices(servicesList);
      setLoading(false);
    };

    fetchServices();

    const interval = setInterval(() => {
      const currentIndex = Math.floor(scrollX._value / width);
      const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
      Animated.timing(scrollX, {
        toValue: nextIndex * width,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }, 2000);

    return () => clearInterval(interval);
  }, [scrollX]);

  const handleAddToCart = async (serviceId, serviceName, servicePrice,) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'Cart'), where('userId', '==', user.uid), where('serviceId', '==', serviceId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await addDoc(collection(db, 'Cart'), {
            userId: user.uid,
            serviceId,
            serviceName,
            servicePrice,
          });
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            setShowProceedButton(true);
          }, 3000);
        } else {
          Toast.show({
            type: 'info',
            text1: 'Already added to the Cart',
            position: 'bottom', // Position: 'top', 'bottom', 'center'
            visibilityTime: 3000, // Duration in ms
            autoHide: true,
            topOffset: 40, // Offset from the top
            bottomOffset: 40, // Offset from the bottom
            onPress: () => { /* Optional callback when toast is pressed */ },
            props: { /* Custom props to pass to the toast */ },
          });
        }
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error adding to cart: ', error);
    }
  };

  const handleProceedToCheckout = () => {
    navigation.navigate('Cart');
  };

  const renderServiceButton = ({ item }) => {
    const serviceImage = serviceImages[item.ServiceId] || defaultImage;
    
    return (
      <TouchableOpacity style={styles.serviceButton} onPress={() => handleAddToCart(item.ServiceId, item.ServiceName, item.ServicePrice)}>
        <Image source={serviceImage} style={styles.serviceButtonImage} />
        <View style={styles.serviceButtonTextContainer}>
          <Text style={styles.serviceButtonText}>{item.ServiceName}</Text>
          <Text style={styles.serviceButtonPrice}>Rs{item.ServicePrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.circle}>
            <Text style={styles.backButtonText}>←</Text>
          </View>
        </TouchableOpacity>
       
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
          ref={scrollViewRef}
        >
          {images.map((image, index) => (
            <Image key={index} source={image} style={styles.image} />
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Gardener</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          Our professional gardeners provide top-notch services to keep your garden beautiful and healthy.
          They can handle everything from planting and pruning to lawn care and pest control.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceButton}
          keyExtractor={(item) => item.id}
          style={styles.serviceButtonContainer}
        />
      )}

      {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fallSpeed={3000} ref={confettiRef} />}

      {showProceedButton && (
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToCheckout}>
          <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 200,
    marginTop: 50,
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: -11,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginVertical: 10,
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    borderTopColor: '#dee0e3',
    borderBottomColor: '#dee0e3',
  },
  description: {
    fontSize: 12,
    color: '#333',
    textAlign: 'justify',
  },
  serviceButtonContainer: {
    marginVertical: 20,
  },
  serviceButton: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: 'auto',
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    borderTopColor: '#dee0e3',
    borderBottomColor: '#dee0e3',
  },
  serviceButtonImage: {
    width: 150,
    height: 80,
    marginLeft: -20,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
  serviceButtonTextContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  serviceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceButtonPrice: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GardenerScreen;
