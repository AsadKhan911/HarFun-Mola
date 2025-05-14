import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image, RefreshControl
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth.user);
  const navigation = useNavigation();

  const fetchUserJobs = async () => {
    if (!user?._id) return;

    setRefreshing(true);
    try {
      const response = await axios.get(`${BiddingModelBaseUrl}/get-all-jobs/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.jobs) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserJobs();
  }, [user, token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'in progress':
        return '#FFC107';
      case 'pending':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Posted Jobs</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : jobs.length > 0 ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchUserJobs}
              colors={['#3498db']}
            />
          }
        >
          {jobs.map((job, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.jobCard}
              onPress={() => navigation.navigate('edit-job', { job })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.serviceType}>{job.serviceType}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditJob', { job })}
                >
                  <Icon name="edit" size={20} color="#3498db" />
                </TouchableOpacity>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {job.description}
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>₨ {job.budget}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Icon name="event" size={16} color="#e74c3c" />
                  <Text style={styles.detailText}>
                    {moment(job.createdAt).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                <Text style={styles.statusText}>{job.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Image 
            source={require('../../../assets/images/jobs.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
          <Text style={styles.emptyText}>When you post jobs, they'll appear here</Text>
          <TouchableOpacity 
            style={styles.postJobButton}
            onPress={() => navigation.navigate('PostJob')}
          >
            <Text style={styles.postJobButtonText}>Post Your First Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#34495e',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  postJobButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  postJobButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyJobs;