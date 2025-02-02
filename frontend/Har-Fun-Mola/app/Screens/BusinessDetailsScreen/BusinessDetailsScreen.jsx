import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '../../../constants/Colors.ts';
import { Heading } from '../../../components/Heading.jsx';
import BookingModal from '../BookingScreen/BookingModal.jsx';

const BusinessDetailsScreen = () => {
  const [business, setBusiness] = useState({});
  const [readMore, setReadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const param = useRoute().params;
  const navigation = useNavigation();

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal by changing the state
  };

  useEffect(() => {
    if (param?.business) {
      setBusiness(param.business);
      setIsLoading(false); // Stop loading when data is set
    } else {
      setIsLoading(false); // Handle case when no business data is passed
    }
  }, [param]);

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
            source={{ uri: business?.created_by?.profile?.profilePic }}
            style={styles.businessImage}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.businessName}>
              {business?.serviceName || 'Business Name'}
            </Text>
            <View style={styles.subContainer}>
              <Text style={styles.contactPerson}>
                {business?.created_by?.fullName || 'Abdullah Jan'} 🌟
              </Text>
              <Text style={styles.categoryTag}>
                {business?.category?.name || 'Category'}
              </Text>
            </View>
            <Text style={{ fontFamily: 'outfit-Medium', fontSize: 20 }}>
              {`${business?.price}Pkr`}
            </Text>
            <Text style={styles.address}>
              <FontAwesome6
                name="location-dot"
                size={25}
                color={Colors.PRIMARY}
              />{' '}
              {business?.location && business?.city ? `${business.location}, ${business.city}` : 'Business Address'}
            </Text>

            <View style={styles.horizontalLine}></View>

            <View>
              <Heading text="About Me" />
              <Text
                style={styles.aboutText}
                numberOfLines={readMore ? 200 : 5}
              >
                {business?.description || 'No details available.'}
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.messageBtn}>
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Screen Modal */}

      <Modal
        animationType="slide"
        visible={showModal}>
        <BookingModal business={business} handleCloseModal={handleCloseModal} />
      </Modal >

    </View>
  );
};

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
  address: {
    fontSize: 17,
    fontFamily: 'outfit',
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
  },
  bookText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 18,
  },
});

export default BusinessDetailsScreen;