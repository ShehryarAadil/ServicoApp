//SignUpScreen.js
import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/Logo/Servico_Logo.png';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Verification Email Sent', 'Please check your email inbox and verify your email address before signing up.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send verification email. Please try again later.');
    }
  };

  const handleSignUp = async () => {
    try {
      // Check if the email is verified
      const isEmailVerified = auth.currentUser.emailVerified;
      if (!isEmailVerified) {
        Alert.alert('Email Verification Required', 'Please verify your email address before signing up.');
        return;
      }
      
      // Proceed with signup
      // You can add the code for createUserWithEmailAndPassword here
      // For example:
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Once signed up, navigate to the main menu or login screen
      navigation.navigate('SignIn');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signUpButton} onPress={handleSendVerificationEmail}>
        <Text style={styles.signUpButtonText}>Send Verification Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  signUpButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;