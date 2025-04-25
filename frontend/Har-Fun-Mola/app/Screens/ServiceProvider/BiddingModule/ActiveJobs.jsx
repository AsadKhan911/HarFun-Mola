import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../../URL/userBaseUrl';
import { useNavigation } from 'expo-router';

const ActiveJobs = () => { //These are contract with status === "Agreed"
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const serviceProviderId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    const fetchAgreedContracts = async () => {
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-agreed-contract/${serviceProviderId}`);
        setContracts(response.data.contracts || []);
      } catch (err) {
        console.error('Error fetching agreed contracts:', err);
        setError(err.response?.data?.message || 'Something went wrong while fetching agreed contracts.');
      } finally {
        setLoading(false);
      }
    };

    if (serviceProviderId) {
      fetchAgreedContracts();
    }
  }, [serviceProviderId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('detailed-agreed-proposal', { responses: item })}
      style={styles.card}
    >
      <Text style={[styles.status, { color: 'green' }]}>Agreed</Text>
      <Text>Service: {item.bidId?.serviceType}</Text>
      <Text>Customer: {item.customerId?.fullName || 'N/A'}</Text>
      <Text>Agreed Price: ${item.agreedPrice}</Text>
      <Text style={styles.terms}>Terms: {item.contractTerms}</Text>
      <Text style={styles.date}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={styles.centered} size="large" color="#28a745" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contracts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No agreed contracts found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  status: { fontWeight: 'bold', fontSize: 16 },
  terms: { marginTop: 4, fontStyle: 'italic' },
  date: { marginTop: 4, fontSize: 12, color: '#666' },
  errorText: { textAlign: 'center', color: 'red', marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#555' },
});

export default ActiveJobs;