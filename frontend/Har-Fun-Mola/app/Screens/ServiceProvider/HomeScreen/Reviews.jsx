import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Rating } from 'react-native-ratings';
import { userBaseUrl } from '../../../URL/userBaseUrl';
import { Button } from 'react-native-paper';
import Colors from '../../../../constants/Colors';

const Reviews = () => {
  const serviceProviderId = useSelector((state)=>state.auth.user._id)

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${userBaseUrl}/get-SP-review/${serviceProviderId}`,
        
      );
      setReviews(response.data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [serviceProviderId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        {item.user.avatar ? (
          <Image 
            source={{ uri: item.user.avatar }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>
              {item.user.name?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
        <Text style={styles.userName}>{item.user.name}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Rating
        type='star'
        ratingCount={5}
        imageSize={20}
        readonly
        startingValue={item.rating}
        style={styles.rating}
      />
      
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again" 
          onPress={fetchReviews} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    marginTop:50,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  reviewCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Colors.WHITE
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default Reviews;