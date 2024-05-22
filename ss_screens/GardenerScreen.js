import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

// Mock function to simulate fetching price from a database
const fetchPriceFromDatabase = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(50); // Mock price value
    }, 1000);
  });
};

const GardenerScreen = () => {
  const navigation = useNavigation();
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef(null);
  const scrollViewRef = useRef(null);

  const images = [
    require('../assets/Gardener1.jpg'),
    require('../assets/logo.png'),
    require('../assets/Gardener1.jpg'),
  ];

  useEffect(() => {
    // Simulate fetching price from a database
    fetchPriceFromDatabase().then((fetchedPrice) => {
      setPrice(fetchedPrice);
      setLoading(false);
    });

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

  const handleAddToCart = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setShowProceedButton(true);
    }, 3000);
  };

  const handleProceedToCheckout = () => {
    navigation.navigate('Cart');
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

      <View style={styles.priceContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.price}>Price: ${price} per visit</Text>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} disabled={loading}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fallSpeed={3000} ref={confettiRef} />}

      {showProceedButton && (
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToCheckout}>
          <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
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
    textAlign:'center',
    marginTop:-11,
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
  },
  description: {
    fontSize: 12,
    color: '#333',
    textAlign:'justify',
  },
  priceContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a9d8f',
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
