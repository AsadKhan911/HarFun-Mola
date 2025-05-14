import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Payments = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../../assets/images/cons.png')} // Add your own image or use a vector
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Payment Section Coming Soon!</Text>
      
      <Text style={styles.message}>
        We're working hard to integrate secure Stripe payments. 
        This section will be available once your account verification is complete.
      </Text>
      
      <View style={styles.statusContainer}>
        <Ionicons name="alert-circle" size={24} color="#FFA500" />
        <Text style={styles.statusText}>Stripe Account: Pending Verification</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('StripeVerification')} // Link to your verification screen
      >
        <Text style={styles.buttonText}>Complete Verification</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.contactText}>
        Need help? Contact support@example.com
      </Text>
    </View>
  );
}

export default Payments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  statusText: {
    fontSize: 16,
    color: '#E65100',
    marginLeft: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6772e5', // Stripe's brand color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
  },
});