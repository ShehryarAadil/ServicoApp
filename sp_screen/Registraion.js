import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebase'; // Ensure your firebase.js exports db and auth
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Registration = () => {
  const [name, setName] = useState('');
  const [phNumber, setPhNumber] = useState('');
  const [sCategory, setSCategory] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    
    if (!name || !phNumber || !sCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'Sp_Data'), {
        Email: user.email,
        Name: name,
        Ph_Number: phNumber,
        S_Category: sCategory,
      });
      Alert.alert('Success', 'Registration successful');
      // Navigate to a different screen if needed
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Provider Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phNumber}
        onChangeText={setPhNumber}
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
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Registration;
