import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator, Image } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '../../../constants/Colors.ts';
import { Heading } from '../../../components/Heading.jsx';
import BookingModal from '../BookingScreen/BookingModal.jsx';
import MinorBookingModal from './MinorBookingModal.jsx';

const MinorDetailedListingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listing } = route.params || {};

  const [readMore, setReadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading] = useState(!listing); // Show loading if no listing data

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const imageSource = listing?.Listingpicture
    ? { uri: listing.Listingpicture }
    : listing?.created_by?.profile?.profilePic
      ? { uri: listing.created_by.profile.profilePic }
      : null;

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={{ height: '92%' }}>
        <View>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={imageSource}
            style={styles.businessImage}
            contentFit="cover"
          />

          <View style={styles.infoContainer}>
            <Text style={styles.businessName}>
              {listing?.serviceName || 'Service Listing'}
            </Text>
            <View style={styles.subContainer}>
              <Text style={styles.contactPerson}>
                {listing?.created_by?.fullName || 'Service Provider'} 🌟
              </Text>
              <Text style={styles.categoryTag}>
                {listing?.category?.name || listing?.service?.category?.name || 'Service Category'}
              </Text>
            </View>

            {/* Pricing Section */}
            <View style={styles.priceContainer}>
              <Ionicons name="pricetag-outline" size={20} color={Colors.PRIMARY} />
              <Text style={{ fontFamily: 'outfit-bold', fontSize: 25, marginLeft: 5 }}>Pricing:</Text>
            </View>

            {/* Pricing Details */}
            <View style={styles.pricingList}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Service Fee:</Text>
                <Text style={styles.priceValue}>Rs. {listing?.price || 0}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Diagnostic Fee:</Text>
                <Text style={styles.priceValue}>Rs. {listing?.diagnosticPrice || 0}</Text>
              </View>
            </View>

            {/* Availability */}
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.timeText}>
                {listing?.timeSlots?.length > 0 ? (
                  <>
                    Available from <Text style={styles.boldText}>{listing.timeSlots[0]}</Text> till{' '}
                    <Text style={styles.boldText}>{listing.timeSlots[listing.timeSlots.length - 1]}</Text>
                  </>
                ) : (
                  'Availability not specified'
                )}
              </Text>
            </View>

            {/* Location */}
            <Text style={styles.address}>
              <FontAwesome6
                name="location-dot"
                size={20}
                color={Colors.PRIMARY}
              />{' '}
              {listing?.location || 'Location not specified'}
            </Text>

            <View style={styles.horizontalLine}></View>

            {/* Description */}
            <View>
              <Heading text="About this service" />
              <Text
                style={styles.aboutText}
                numberOfLines={readMore ? 200 : 5}
              >
                {listing?.description || 'No details available.'}
              </Text>
              <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                <Text style={styles.readMore}>
                  {readMore ? 'Read Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => navigation.navigate('view-provider-profile', {
            serviceProvider: listing?.created_by
          })}
        >
          <Ionicons name="person-outline" size={18} color={Colors.PRIMARY} style={{ marginRight: 10 }} />
          <Text style={styles.messageText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.WHITE} style={{ marginRight: 10 }} />
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal animationType="slide" visible={showModal}>
        <MinorBookingModal
          business={listing}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </View>
  );
};

// Reuse the same styles from BusinessDetailsScreen
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    zIndex: 10,
    padding: 20,
    paddingTop: 40
  },
  businessImage: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 20,
    display: 'flex',
    gap: 7,
  },
  businessName: {
    fontFamily: 'outfit-bold',
    fontSize: 25,
  },
  subContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  contactPerson: {
    fontFamily: 'outfit-Medium',
    color: Colors.PRIMARY,
    fontSize: 20,
  },
  categoryTag: {
    color: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  pricingList: {
    marginTop: -12,
    padding: 10,
    borderRadius: 10,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  priceValue: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  noPricing: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
  },
  address: {
    fontSize: 17,
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginVertical: 10
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
  horizontalLine: {
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY_LIGHT,
    marginTop: 20,
    marginBottom: 20,
  },
  aboutText: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 16,
    lineHeight: 28,
  },
  readMore: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: Colors.PRIMARY,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  messageBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 18,
  },
  bookBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 18,
  },
});

export default MinorDetailedListingScreen;