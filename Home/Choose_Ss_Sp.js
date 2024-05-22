import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Choose_Ss_Sp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/BackGround/hamburger_Bg.jpg')} style={styles.background} />
      <View style={styles.content}>
        <Image source={require('../assets/Logo/Servico_Logo.png')} style={styles.logo} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Ss_Call')}
        >
          <Text style={styles.buttonText}>Service Seeker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Sp_Call')}
        >
          <Text style={styles.buttonText}>Service Provider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.3, 
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,  
    height: 150,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#6189d4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Choose_Ss_Sp;
