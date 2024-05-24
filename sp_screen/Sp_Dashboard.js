import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '../Home/Start';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const Sp_Dashboard = () => {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(-300)).current;

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
        setHasPendingRequests(!querySnapshot.empty);
      });

      return () => unsubscribe();
    }
  }, [userData]);

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

  const navigateToPendingRequests = () => {
    navigation.navigate('Sp_Pending_Request');
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Animated.Image source={require('../assets/BackGround/hamburger_Bg.jpg')} style={[styles.mainBackground, { transform: [{ rotate }] }]} />

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
          <TouchableOpacity onPress={() => handleMenuNavigation('Services')} style={styles.menuItem}>
            <Image source={require('../assets/Icons/Services.png')} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Go to Service Seeker Menu</Text>
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

        <ScrollView style={styles.contentContainer}>
          {userData && (
            <View style={styles.userInfoContainer}>
              <Image source={{ uri: userData.ProfileImage }} style={styles.userImage} />
              <View style={styles.userInfoText}>
                <Text style={styles.userName}>{userData.Name}</Text>
                <View style={styles.userCityContainer}>
                  <Image source={require('../assets/Icons/telephone.png')} style={styles.callIcon} />
                  <Text style={styles.userPhone}>Number : {userData.Ph_Number}</Text>
                </View>
                <View style={styles.userCityContainer}>
                  <Image source={require('../assets/Icons/ServiceProvider.png')} style={styles.serviceIcon} />
                  <Text style={styles.userCategory}>Service  : {userData.S_Category}</Text>
                </View>
                <View style={styles.userCityContainer}>
                  <Image source={require('../assets/Icons/location.png')} style={styles.cityIcon} />
                  <Text style={styles.userCity}>{userData.City}, Pakistan</Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.pendingRequestContainer}>
            <Text style={styles.pendingRequestTitle}>Pending Requests</Text>
            {hasPendingRequests ? (
              <TouchableOpacity onPress={navigateToPendingRequests}>
                <Text style={styles.newRequestsLink}>Click for new Job requests</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noRequests}>No pending requests.</Text>
            )}
          </View> 
          
          <View style={styles.toDoWorkContainer}>
            <Text style={styles.toDoWorkTitle}>To Do Work</Text>
            {hasPendingRequests ? (
              <TouchableOpacity onPress={navigateToPendingRequests}>
                <Text style={styles.newRequestsLink}>Click for To Do Work</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noRequests}>No work to do.</Text>
            )}
          </View> 
        </ScrollView>
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
    resizeMode: 'cover',
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
    marginTop: 'auto', 
    marginBottom: 30,
    marginHorizontal: 20,
  },
  contentContainer: {
    marginTop: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  userCategory: {
    fontSize: 14,
    color: '#555',
  },
  userCityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  callIcon: {
    width: 21,
    height: 21,
    marginRight: 7,
  },
  serviceIcon: {
    width: 21,
    height: 21,
    marginRight: 7,
  },
  cityIcon: {
    width: 19,
    height: 19,
    marginRight: 10,
  },
  userCity: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    marginBottom: 5,
  },
  pendingRequestContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    height: 220,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  pendingRequestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    //textAlign: 'left',
  },
  newRequestsLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2a9d8f',
    textDecorationLine: 'underline',
    marginTop: 10, // Add space above the link
  },
  noRequests: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  toDoWorkContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    height: 220,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  toDoWorkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    //textAlign: 'left',
  },
  newWorkLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2a9d8f',
    textDecorationLine: 'underline',
    marginTop: 10, // Add space above the link
  },
  noWork: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default Sp_Dashboard;
