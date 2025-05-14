import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../../URL/userBaseUrl';

const CompletedJobs = () => {
  const [loading, setLoading] = useState(true);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [error, setError] = useState(null);
  const serviceProviderId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    const fetchCompletedContracts = async () => {
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-completed-contract/${serviceProviderId}`);
        setCompletedContracts(response.data.contracts || []);
      } catch (err) {
        console.error('Error fetching completed contracts:', err);
        setError(err.response?.data?.message || 'Failed to load completed bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (serviceProviderId) {
      fetchCompletedContracts();
    }
  }, [serviceProviderId]);

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          {item.customerId?.profile?.profilePic ? (
            <Image 
              source={{ uri: item.customerId.profile.profilePic }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item.customerId?.fullName?.charAt(0) || 'C'}
            </Text>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.serviceTitle}>{item.bidId?.serviceType || 'Service'}</Text>
          <Text style={styles.customerName}>{item.customerId?.fullName || 'Customer'}</Text>
        </View>
        <View style={styles.completedBadge}>
          <Text style={styles.badgeText}>Completed</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Earned:</Text>
          <Text style={styles.amount}>Rs {item.agreedPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completed On:</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your completed bookings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Image 
          source={require('../../../../assets/images/jobs.png')} 
          style={styles.errorImage}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Bookings</Text>
      
      {completedContracts.length > 0 ? (
        <FlatList
          data={completedContracts}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('../../../../assets/images/jobs.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Completed Bookings Yet</Text>
          <Text style={styles.emptyText}>
            Your completed service bookings will appear here
          </Text>
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bookingCard: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  headerText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  customerName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  completedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewDetails: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'right',
    marginTop: 8,
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
  errorImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default CompletedJobs;
