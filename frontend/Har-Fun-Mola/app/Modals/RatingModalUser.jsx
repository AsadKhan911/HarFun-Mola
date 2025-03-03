import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import { BookingBaseUrl } from '../URL/userBaseUrl.js';
import Colors from '../../constants/Colors.ts';

const RatingModalUser = ({ visible, onClose, onSubmit, userToReviewId, bookingId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating.');
      return;
    }

    try {
      const response = await axios.post(`${BookingBaseUrl}/submitreviewserviceUser`, {
        userToReviewId,
        bookingId,
        rating,
        comment,
      });

      if (response.status === 200 && response.data.success) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Rate the Service Provider</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={30}
            startingValue={rating}
            onFinishRating={setRating}
            style={styles.rating}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Write a review..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.DARK_GRAY,
    marginBottom: 15,
  },
  rating: {
    marginBottom: 15,
  },
  commentInput: {
    width: '100%',
    height: 100,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'outfit',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
});

export default RatingModalUser;
