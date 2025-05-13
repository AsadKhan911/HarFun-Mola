import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Image
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MinorListingsBaseUrl } from '../../URL/userBaseUrl.js';
import Colors from '../../../constants/Colors.ts';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ListingScreenMinor = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { issueId, serviceId, categoryId, issueName } = route.params || {};

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        issueId,
        serviceId,
        categoryId,
        issueName
      };

      const response = await axios.get(`${MinorListingsBaseUrl}/get-minor-listings`, { params });

      if (response.data.success) {
        const safeListings = response.data.data.map(item => ({
          ...item,
          created_by: item.created_by || { fullName: 'Provider', profile: { profilePic: null } },
          Listingpicture: item.Listingpicture || null,
          description: item.description || 'No description available',
          price: item.price || 0,
          diagnosticPrice: item.diagnosticPrice || 0,
          timeSlots: item.timeSlots || [],
          location: item.location || 'Location not specified'
        }));
        setListings(safeListings);
      } else {
        setError(response.data.message || 'Failed to fetch listings');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const renderListingItem = ({ item }) => {
    if (!item) return null;

    // Get Image (Either Listing Image or Profile Pic)
    const imageSource = item?.Listingpicture
      ? { uri: item.Listingpicture }
      : item?.created_by?.profile?.profilePic
        ? { uri: item.created_by.profile.profilePic }
        : null;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('minor-detailed-listing-screen', { listing: item })}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="hammer" size={40} color={Colors.PRIMARY} />
          </View>
        )}

        <View style={styles.subContainer}>
          {/* Service Provider Name */}
          <View style={styles.locationContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.providerName}>{item.created_by.fullName || 'Provider'}</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Ionicons name="pricetag-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.priceText}>
              Rs. {item.price} Service fee
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Ionicons name="construct-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.priceText}>
            Rs. {item.diagnosticPrice} diagnostic fee
            </Text>
          </View>

          {/* Available Time Slots */}
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.timeText}>
              {item.timeSlots?.length > 0 ? (
                <>
                  Available from <Text style={styles.boldText}>{item.timeSlots[0]}</Text> till{' '}
                  <Text style={styles.boldText}>{item.timeSlots[item.timeSlots.length - 1]}</Text>
                </>
              ) : (
                'Not specified'
              )}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={22} color={Colors.PRIMARY} />
            <Text style={styles.locationText}>
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingScreenContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Finding available providers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorScreenContainer}>
        <Ionicons name="warning" size={50} color={Colors.ERROR} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchListings()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.header}>

                {/* Go Back Icon */}
                      <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
                      </TouchableOpacity>
                      
              <Text style={styles.headerTitle}>Available Service Providers</Text>
              <Text style={styles.headerSubtitle}>For: {issueName}</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyScreenContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Available Service Providers</Text>
            <Text style={styles.headerSubtitle}>For: {issueName}</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={60} color={Colors.GRAY} />
            <Text style={styles.emptyText}>No providers available</Text>
            <Text style={styles.emptySubtext}>
              We couldn't find any providers for this service
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ListingScreenMinor;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  loadingScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  goBackContainer: {
    position: "absolute",
    top: 22,
    left: 18,
    zIndex: 1,
  },
  errorScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 30,
  },
  emptyScreenContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    marginTop:40,
    marginBottom:20,
    padding: 20,
    paddingBottom: 10,
    backgroundColor: Colors.WHITE,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'outfit-Bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 20,
    fontFamily: 'outfit-Bold',
    color: Colors.GRAY,
    marginTop: 5,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subContainer: {
    flex: 1,
    marginLeft: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerName: {
    fontFamily: 'outfit-Bold',
    fontSize: 18,
    marginLeft: 5,
  },
  descriptionText: {
    fontFamily: 'outfit-Regular',
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  priceText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 5,
  },
  diagnosticText: {
    fontFamily: 'outfit-Regular',
    fontSize: 14,
    color: Colors.GRAY,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginLeft: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  timeText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginLeft: 5,
  },
  boldText: {
    fontFamily: 'outfit-Bold',
    color: Colors.GRAY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'outfit-Medium',
    color: Colors.GRAY,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'outfit-Medium',
    color: Colors.ERROR,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  retryButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-SemiBold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'outfit-Medium',
    color: Colors.GRAY,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'outfit-Regular',
    color: Colors.LIGHT_GRAY,
    marginTop: 10,
    textAlign: 'center',
  },

  listContainer: {
    padding: 15,
    paddingTop: 0, 
  },
});