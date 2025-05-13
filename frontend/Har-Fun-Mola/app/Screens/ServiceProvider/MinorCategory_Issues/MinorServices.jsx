import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { MinorServicesBaseUrl } from '../../../URL/userBaseUrl';
import Colors from '../../../../constants/Colors.ts';
import { useNavigation } from 'expo-router';

export const MinorServices = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation()
  const route = useRoute();
  const { categoryId, categoryName } = route.params;

  useEffect(() => {
    getServicesByCategory(categoryId);
  }, [categoryId]);

  const getServicesByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${MinorServicesBaseUrl}/get-minor-service-by-category/${categoryId}`);
      if (response.data.success) {
        setServices(response.data.services  || []);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (serviceId) => {
    setSelectedServices((prevState) => {
      if (prevState.includes(serviceId)) {
        return prevState.filter((id) => id !== serviceId);
      } else {
        return [...prevState, serviceId];
      }
    });
  };

  const handleSubmit = () => {
    const selectedServiceDetails = services.filter(service => 
      selectedServices.includes(service._id)
    );
    
    navigation.navigate('predefined-issues', {
      selectedServices: selectedServiceDetails,
      categoryName // Pass category name for reference
    });
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Services</Text>
        <Text style={styles.subtitle}>Under {categoryName} which you offer</Text>
      </View>

      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No services available in this category</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={services}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.serviceItem}>
                <CheckBox
                  checked={selectedServices.includes(item._id)}
                  onPress={() => handleCheckboxChange(item._id)}
                  checkedColor={Colors.PRIMARY}
                  containerStyle={styles.checkbox}
                />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.serviceName}</Text>
                </View>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              selectedServices.length === 0 && styles.disabledButton
            ]}
            disabled={selectedServices.length === 0}
          >
            <Text style={styles.submitButtonText}>
              Next {selectedServices.length > 0 ? `(${selectedServices.length})` : ''}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
    marginTop:30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    padding: 0,
    margin: 0,
    marginRight: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MinorServices;