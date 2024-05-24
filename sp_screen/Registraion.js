import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../firebase'; // Ensure your firebase.js exports db, auth, and storage
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const paymentMethods = [
  { label: 'Easy Paisa', value: 'EasyPaisa' },
  { label: 'Jazz Cash', value: 'JazzCash' },
  { label: 'Sada Pay', value: 'SadaPay' },
  { label: 'Naya Pay', value: 'NayaPay' }
];

const cities = [
  { label: 'Faisalabad', value: 'Faisalabad' },
  { label: 'Lahore', value: 'Lahore' },
  { label: 'Islamabad', value: 'Islamabad' },
  { label: 'Rawalpindi', value: 'Rawalpindi' },
  { label: 'Multan', value: 'Multan' },
  { label: 'Karachi', value: 'Karachi' }
];

const Registration = () => {
  const [name, setName] = useState('');
  const [phNumber, setPhNumber] = useState('');
  const [sCategory, setSCategory] = useState('');
  const [city, setCity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState({});
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const navigation = useNavigation();
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `profile_images/${filename}`);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!name || !phNumber || !sCategory || !profileImage || !city) {
      Alert.alert('Error', 'Please fill in all fields and upload a profile image');
      return;
    }

    setLoading(true);

    try {
      const profileImageUrl = await uploadImage(profileImage);

      await addDoc(collection(db, 'Sp_Data'), {
        Email: user.email,
        Name: name,
        Ph_Number: phNumber,
        S_Category: sCategory,
        City: city,
        ProfileImage: profileImageUrl,
        PaymentOptions: selectedPayments
      });

      setLoading(false);
      setSuccessModalVisible(true);
    } catch (error) {
      setLoading(false);
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handlePaymentOptionChange = (method, value) => {
    if (value.length <= 11 && /^[0-9]*$/.test(value)) {
      setSelectedPayments((prev) => ({
        ...prev,
        [method]: value,
      }));
    }
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Sp_Dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service Provider Registration</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Upload Profile Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number of 11 Digits"
        value={phNumber}
        onChangeText={(text) => {
          if (text.length <= 11 && /^[0-9]*$/.test(text)) {
            setPhNumber(text);
          }
        }}
        keyboardType="phone-pad"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSCategory(itemValue)}
        >
          <Picker.Item label="Select Service Category" value="" />
          <Picker.Item label="Electrical Service" value="ElectricalService" />
          <Picker.Item label="Cleaning Service" value="CleaningService" />
          <Picker.Item label="Saloon Service" value="SaloonService" />
          <Picker.Item label="Plumber Service" value="PlumberService" />
          <Picker.Item label="Carpenter Service" value="CarpenterService" />
          <Picker.Item label="AC Service" value="ACService" />
          <Picker.Item label="Painting Service" value="PaintingService" />
          <Picker.Item label="Gardener Service" value="GardenerService" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={city}
          style={styles.picker}
          onValueChange={(itemValue) => setCity(itemValue)}
        >
          <Picker.Item label="Select City" value="" />
          {cities.map(city => (
            <Picker.Item key={city.value} label={city.label} value={city.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setPaymentModalVisible(true)}>
        <Text style={styles.buttonText}>Select Payment Methods</Text>
      </TouchableOpacity>

      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.paymentTitle}>Select Payment Methods</Text>
            
            {paymentMethods.map((method) => (
              <View key={method.value} style={styles.paymentContainer}>
                <View style={styles.checkboxContainer}>
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                  <TouchableOpacity
                    style={[styles.checkbox, selectedPayments[method.value] && styles.checkboxSelected]}
                    onPress={() => handlePaymentOptionChange(method.value, !selectedPayments[method.value] ? '' : null)}
                  />
                </View>
                {selectedPayments[method.value] !== null && (
                  <TextInput
                    style={styles.input}
                    placeholder={`${method.label} Account Number`}
                    value={selectedPayments[method.value]}
                    onChangeText={(value) => handlePaymentOptionChange(method.value, value)}
                    keyboardType="number-pad"
                  />
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.modalButton} onPress={() => setPaymentModalVisible(false)}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={styles.loadingContainer}>
          <Animated.Image
            source={require('../assets/Logo/Servico_Logo.png')} // Replace with your logo
            style={[styles.loadingImage, { transform: [{ rotate }], opacity }]}
          />
        </View>
      </Modal>

      <Modal visible={successModalVisible} transparent={true} animationType="fade" onRequestClose={handleSuccessModalClose}>
        <TouchableWithoutFeedback onPress={handleSuccessModalClose}>
          <View style={styles.successModalContainer}>
            <View style={styles.successModalContent}>
              <Text style={styles.successModalText}>Registration successful</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius: 75,
  },
  imagePickerText: {
    color: '#ccc',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentContainer: {
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
  },
  checkboxSelected: {
    backgroundColor: '#2a9d8f',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Registration;
