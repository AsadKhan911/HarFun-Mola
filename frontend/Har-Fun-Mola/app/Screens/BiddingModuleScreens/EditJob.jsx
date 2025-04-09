import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';

const EditJobScreen = () => {
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [images, setImages] = useState('');
  const [status, setStatus] = useState('Open');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params; // Receive the job data passed from 'MyJobs'

  useEffect(() => {
    // Initialize form with existing job details
    if (job) {
      setDescription(job.description);
      setBudget(job.budget.toString());
      setImages(job.images.join(', ')); // Assuming images is an array of URLs
      setStatus(job.status);
    }
  }, [job]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BiddingModelBaseUrl}/edit-job/${job._id}`,
        {
          description,
          budget,
          images: images.split(', '), // Convert the string of images back to an array
          status,
        }
      );

      if (response.data?.updatedJob) {
        Alert.alert('Success', 'Job updated successfully');
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert('Error', 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error?.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while updating the job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#7a7a7a"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Budget"
        keyboardType="numeric"
        placeholderTextColor="#7a7a7a"
        value={budget}
        onChangeText={setBudget}
      />

      <TextInput
        style={styles.input}
        placeholder="Images (comma-separated URLs)"
        placeholderTextColor="#7a7a7a"
        value={images}
        onChangeText={setImages}
      />

      <TextInput
        style={styles.input}
        placeholder="Status"
        placeholderTextColor="#7a7a7a"
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Updating...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Very light background color
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Dark text for readability
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff', // White background for input fields
    color: '#333', // Dark text inside input fields
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd', // Light gray border color
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green color for save button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // White text for the button
  },
});

export default EditJobScreen;
