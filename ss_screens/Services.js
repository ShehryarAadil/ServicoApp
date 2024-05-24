import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Animated, Easing, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '../Home/Start';

import ElectricalImage from '../assets/logo.png';
import CleaningImage from '../assets/logo.png';
import PlumberImage from '../assets/logo.png';
import SaloonImage from '../assets/logo.png';
import CarpenterImage from '../assets/logo.png';
import MechanicImage from '../assets/logo.png';
import PaintingImage from '../assets/logo.png';
import GardenerImage from '../assets/logo.png';

const { width } = Dimensions.get('window');

const ServicesDashboard = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current; // Added for scroll position
  const menuAnim = useRef(new Animated.Value(-300)).current; // For menu animation

  const servicesData = [
    { name: 'Electrical Services', image: ElectricalImage, route: 'ElectricalScreen' },
    { name: 'Cleaning Services', image: CleaningImage, route: 'CleaningScreen' },
    { name: 'Plumber Services', image: PlumberImage, route: 'PlumberScreen' },
    { name: 'Saloon Services', image: SaloonImage, route: 'SaloonScreen' },
    { name: 'Carpenter Services', image: CarpenterImage, route: 'CarpenterScreen' },
    { name: 'Mechanic Services', image: MechanicImage, route: 'MechanicScreen' },
    { name: 'Painting Services', image: PaintingImage, route: 'PaintingScreen' },
    { name: 'Gardener Services', image: GardenerImage, route: 'GardenerScreen' },
  ];

  const sliderImages = [
    require('../assets/Gardener1.jpg'),
    require('../assets/logo.png'),
    require('../assets/Gardener1.jpg'),
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const interval = setInterval(() => {
      const currentIndex = Math.floor(scrollX._value / width);
      const nextIndex = currentIndex === sliderImages.length - 1 ? 0 : currentIndex + 1;
      scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
      Animated.timing(scrollX, {
        toValue: nextIndex * width,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, scrollX]);

  const navigateToServiceScreen = (route) => {
    navigation.navigate(route);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterServices(query);
  };

  const filterServices = (query) => {
    const filtered = servicesData.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(menuAnim, {
      toValue: isMenuOpen ? -300 : 0,
      duration: 450,
      useNativeDriver: true,
    }).start();
  };

  const handleOutsidePress = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const handleMenuNavigation = (route) => {
    setIsMenuOpen(false);
    navigation.navigate(route);
    Animated.timing(menuAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogoutPress = () => {
    handleLogout(navigation);
  };

  const rotate = scrollY.interpolate({
    inputRange: [-900, 900],
    outputRange: ['-360deg', '360deg'],
    extrapolate: 'clamp',
  });

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Animated.Image source={require('../assets/BackGround/Servico_Logo_Bg.jpeg')} style={[styles.mainBackground, { transform: [{ rotate }] }]} />
        
        <Animated.View style={[styles.hamburgerMenu, { transform: [{ translateX: menuAnim }] }]}>
          <Image source={require('../assets/BackGround/hamburger_Bg.jpg')} style={styles.menuBackground} />
          <TouchableOpacity onPress={() => toggleMenu()} style={styles.closeMenuButton}>
            <View style={styles.circle1}>
              <Text style={styles.closeMenuButtonText}>X</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuNavigation('CustomerSupport')} style={styles.menuItem}>
            <Image source={require('../assets/Icons/support.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Customer Support</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuNavigation('TermsConditions')} style={styles.menuItem}>
            <Image source={require('../assets/Icons/terms_and_conditions.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuNavigation('Start')} style={styles.menuItem}>
            <Image source={require('../assets/Icons/ServiceProvider.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Go to Service Provider Menu</Text>
          </TouchableOpacity>
          
          <View style={styles.menuBottom}>
            <TouchableOpacity onPress={handleLogoutPress} style={styles.menuItem}>
              <Image source={require('../assets/Icons/logout.png')} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => toggleMenu()} style={styles.hamburgerButton}>
            <View style={styles.circle}>
              <Text style={styles.hamburgerButtonText}>☰</Text>
            </View>
          </TouchableOpacity>
          <Image source={require('../assets/Logo/Servico_Logo.png')} style={styles.logo} />
        </View>

        <Animated.ScrollView
          style={styles.firstScroll}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <Animated.View style={[styles.animatedTextContainer, { opacity: fadeAnim }]}>
            <Text style={styles.catchyText}>Experience Excellence, One Service at a Time</Text>
          </Animated.View>
          <View style={styles.sliderContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              {sliderImages.map((image, index) => (
                <Image key={index} source={image} style={styles.sliderImage} />
              ))}
            </ScrollView>
          </View>
          <Text style={styles.heading}>Our Services</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a service..."
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
          <ScrollView contentContainerStyle={styles.servicesContainer}>
            {(searchQuery ? filteredServices : servicesData).map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceButton}
                onPress={() => navigateToServiceScreen(service.route)}
              >
                <Image source={service.image} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.2,
    resizeMode: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    top: 40,
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  hamburgerButton: {
    marginLeft: 10,
    marginRight: 'auto',
  },
  hamburgerButtonText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 1,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b1b5b2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerMenu: {
    position: 'absolute',
    top: '4.7%',
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuBackground: {
    ...StyleSheet.absoluteFillObject,
    width: 'auto',
    height: 'auto',
    opacity: 0.2,
  },
  closeMenuButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeMenuButtonText: {
    fontSize: 20,
    color: 'white',
  },
  circle1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#696b6a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignContent: 'flex-start',
    width: '100%',
  },
  menuItemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 14,
    textAlign: 'left',
  },
  menuBottom: {
    marginTop: 'auto', // Ensure this sticks to the bottom
   // width: '100%',
    marginBottom:30,
    marginHorizontal:20,
  },
  firstScroll: {
    marginTop: 30,
  },
  animatedTextContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  catchyText: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sliderContainer: {
    height: 200,
    padding: 10,
    borderRadius: 10, // Added border radius
  },
  sliderImage: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 32,
    fontWeight: '500',
    paddingLeft: 10,
    marginVertical: 20,
  },
  searchBar: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  serviceButton: {
    width: '45%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default ServicesDashboard;
