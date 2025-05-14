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
        setError(err.response?.data?.message || 'Failed to load proposals. Please try again.');
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Interviewing': return '#FFA500'; // Orange
      case 'Rejected': return '#FF3B30'; // Red
      default: return '#34C759'; // Green
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('detailed-proposal', { responses: item })}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.customerId?.fullName?.charAt(0) || 'C'}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.serviceType}>{item.bidId?.serviceType || 'Service'}</Text>
          <Text style={styles.customerName}>{item.customerId?.fullName || 'Customer'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Agreed Price:</Text>
          <Text style={styles.price}>Rs {item.agreedPrice || 'N/A'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.terms} numberOfLines={2}>
        {item.contractTerms || 'No specific terms mentioned'}
      </Text>

      <Text style={styles.viewDetails}>View Details →</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your proposals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Proposals</Text>
      
      <View style={styles.filterContainer}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilteredStatus(status)}
            style={[
              styles.filterButton,
              filteredStatus === status && styles.activeFilterButton
            ]}
          >
            <Text style={[
              styles.filterText,
              filteredStatus === status && styles.activeFilterText
            ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredResponses.length > 0 ? (
        <FlatList
          data={filteredResponses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
        
          <Text style={styles.emptyText}>No {filteredStatus.toLowerCase()} proposals found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  customerName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  terms: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetails: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
 Text: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
 
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Proposals;