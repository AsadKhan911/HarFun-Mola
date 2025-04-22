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

const Proposals = () => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('Interviewing');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const serviceProviderId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-offers-responses/${serviceProviderId}`);
        setResponses(response.data.contracts || []);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError(err.response?.data?.message || 'Something went wrong while fetching responses.');
      } finally {
        setLoading(false);
      }
    };

    if (serviceProviderId) {
      fetchResponses();
    }
  }, [serviceProviderId]);

  const statuses = ['Interviewing', 'Rejected'];

  const filteredResponses = responses.filter(
    (item) => item.status === filteredStatus
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('detailed-proposal', { responses: item })}
      style={styles.card}
    >
      <Text style={[styles.status, item.status === 'Rejected' && { color: 'red' }]}>
        {item.status}
      </Text>
      <Text>Service: {item.bidId?.serviceType}</Text>
      <Text>Customer: {item.customerId?.fullName || 'N/A'}</Text>
      <Text>Agreed Price: ${item.agreedPrice}</Text>
      <Text style={styles.terms}>Terms: {item.contractTerms}</Text>
      <Text style={styles.date}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={styles.centered} size="large" color="#007bff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterRow}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilteredStatus(status)}
            style={[
              styles.filterButton,
              filteredStatus === status && styles.activeFilterButton,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filteredStatus === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredResponses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  status: { fontWeight: 'bold', fontSize: 16, color: 'green' },
  terms: { marginTop: 4, fontStyle: 'italic' },
  date: { marginTop: 4, fontSize: 12, color: '#666' },
  errorText: { textAlign: 'center', color: 'red', marginTop: 20 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Proposals;
