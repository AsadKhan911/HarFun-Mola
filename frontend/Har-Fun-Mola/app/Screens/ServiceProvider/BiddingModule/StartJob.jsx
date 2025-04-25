import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BiddingModelBaseUrl } from '../../../URL/userBaseUrl';
import axios from 'axios';

const JobTimerScreen = () => {
  const navigation = useNavigation();
  const { offer } = useRoute().params;

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedTime, setCompletedTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setStartTime(now);
    startElapsedTime(now);

    return () => clearInterval(intervalRef.current);
  }, []);

  const startElapsedTime = (start) => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - start) / 1000);
      setElapsedTime(diffInSeconds);
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} hrs ${m} min ${s} sec`;
  };

  const handleCompleteJob = async () => {
    Alert.alert("Confirm", "Are you sure you want to complete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: async () => {
          try {
            clearInterval(intervalRef.current);
            const now = new Date();
            setCompletedTime(now);
            setIsCompleted(true);
  
            // 👇 Backend call to mark job/contract complete
            const response = await axios.post(`${BiddingModelBaseUrl}/complete-job`, {
              jobId: offer.bidId?._id,        // ID of the Bid document
              contractId: offer._id           // ID of the Contract (offer)
            });
  
            if (response.status === 200) {
                navigation.pop(2);
              Alert.alert("Job Completed", `Total duration: ${formatTimer(elapsedTime)}`);
            } else {
              Alert.alert("Error", "Failed to complete the job. Please try again.");
            }
          } catch (error) {
            console.error("Error completing job:", error);
            Alert.alert("Error", "Something went wrong while completing the job.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} />
      </TouchableOpacity>

      <Text style={styles.title}>Job Started</Text>
      <Text style={styles.label}>Client: {offer.customerId?.fullName}</Text>
      <Text style={styles.label}>Started At: {startTime?.toLocaleString()}</Text>

      <Text style={styles.timerLabel}>Elapsed Time:</Text>
      <Text style={styles.timer}>
        { formatTimer(elapsedTime)}
      </Text>

      {!isCompleted && (
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteJob}>
          <Text style={styles.buttonText}>Complete Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default JobTimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  timerLabel: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
  },
  timer: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 10,
  },
  completeButton: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});
