import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../../URL/userBaseUrl';

const Proposals = () => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  const serviceProviderId = useSelector((state) => state.auth.user?._id); // Adjust this path if needed

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-offers-responses/${serviceProviderId}`);
        setResponses(response.data.contracts || []);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError(
          err.response?.data?.message || 'Something went wrong while fetching responses.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceProviderId) {
      fetchResponses();
    }
  }, [serviceProviderId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={[styles.status, item.status === 'Rejected' && { color: 'red' }]}>
        {item.status}
      </Text>
      <Text>Service: {item.bidId?.serviceType}</Text>
      <Text>Customer: {item.customerId?.fullName || 'N/A'}</Text>
      <Text>Agreed Price: ${item.agreedPrice}</Text>
      <Text style={styles.terms}>Terms: {item.contractTerms}</Text>
      <Text style={styles.date}>
        Date: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.centered} size="large" color="#007bff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <FlatList
      data={responses}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
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
});

export default Proposals;
