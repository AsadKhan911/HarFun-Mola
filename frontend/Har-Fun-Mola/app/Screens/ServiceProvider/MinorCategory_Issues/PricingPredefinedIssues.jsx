import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Colors from '../../../../constants/Colors.ts';

const PricingPredefinedIssues = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get the initial data from route params
  const { selectedIssues, selectedServices, providerId, categoryName, initialPricing } = route.params;

  // Create a deep copy of the pricing data to make it mutable
  const [pricingData, setPricingData] = useState(() => {
    return initialPricing ? JSON.parse(JSON.stringify(initialPricing)) : 
      selectedIssues.map(issue => ({
        _id: issue._id,
        issueName: issue.issueName,
        price: '',
        serviceId: issue.service
      }));
  });

  const handlePriceChange = (index, value) => {
    const newPricing = [...pricingData];
    newPricing[index] = {
      ...newPricing[index],
      price: value
    };
    setPricingData(newPricing);
  };

  const handleSubmit = () => {
    const hasEmpty = pricingData.some(item => !item.price);
    if (hasEmpty) {
      Alert.alert("Validation Error", "Please enter price for all issues.");
      return;
    }

    navigation.navigate('submit-minor-listing', {
      pricingData,
      selectedServices,
      providerId,
      categoryName
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set Prices for Selected Issues</Text>
      {pricingData.map((item, index) => (
        <View key={item._id} style={styles.inputBlock}>
          <Text style={styles.issueName}>{item.issueName}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(value) => handlePriceChange(index, value)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Prices</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    marginTop: 35,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputBlock: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  issueName: {
    fontFamily:'Outfit-Medium',
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  input: {
    marginTop:5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PricingPredefinedIssues;
