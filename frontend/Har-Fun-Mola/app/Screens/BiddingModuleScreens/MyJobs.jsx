import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Use any icon set you prefer

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth.user);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserJobs = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-all-jobs/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.jobs) {
          setJobs(response.data.jobs);
        } else {
          console.warn('No jobs found.');
        }

      } catch (error) {
        console.error('Error fetching jobs:', error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [user, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : jobs.length > 0 ? (
        jobs.map((job, index) => (
          <View key={index} style={styles.jobCard}>
            {/* Edit Icon */}
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => navigation.navigate('edit-job', { job })}
            >
              <Icon name="edit" size={20} color="#007bff" />
            </TouchableOpacity>

            <Text style={styles.title}>Service Type: {job.serviceType}</Text>
            <Text>Description: {job.description}</Text>
            <Text>Budget: ${job.budget}</Text>
            <Text>Status: {job.status}</Text>
            <Text>Posted At: {new Date(job.createdAt).toLocaleString()}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noJobsText}>No jobs posted yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noJobsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
});

export default MyJobs;
