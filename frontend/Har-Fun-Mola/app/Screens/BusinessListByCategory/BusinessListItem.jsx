import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Image} from 'expo-image'

const BusinessListItem = ({ business }) => {
  const navigation = useNavigation();


  // Get Image (Either Listing Image or Profile Pic)
  const imageSource = business?.Listingpicture
    ? { uri: business.Listingpicture }
    : {uri:business?.created_by?.profile?.profilePic}; 

  // Find the minimum price from pricingOptions
  const minPrice = business?.pricingOptions?.length > 0
    ? Math.min(...business.pricingOptions.map(option => option.price))
    : 'N/A';


  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('business-details', { business: business })}
    >
      <Image source={imageSource} style={styles.image} />

      <View style={styles.subContainer}>
        {/* Service Name */}
        <View style={styles.locationContainer}>
          <Ionicons name="construct" size={20} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Bold', fontSize: 21 }}>   {business?.serviceName}</Text>
        </View>


        {/* Price */}
        <View style={styles.priceContainer}>
          <Ionicons name="pricetag-outline" size={20} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit', fontSize: 16, marginLeft: 5 }}>
            {minPrice !== 'N/A' ? (
              <>
                Starting from <Text style={{ fontFamily: 'outfit-Bold', color: Colors.GRAY }}>{minPrice}</Text> PKR
              </>
            ) : (
              'Price not available'
            )}
          </Text>
        </View>

        {/* Available Time Slots */}
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={20} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit', fontSize: 14, marginLeft: 5 }}>
            {business?.timeSlots?.length > 0 ? (
              <>
                Available from <Text style={{ fontFamily: 'outfit-Bold', color: Colors.GRAY }}>{business.timeSlots[0]}</Text> till{' '}
                <Text style={{ fontFamily: 'outfit-Bold', color: Colors.GRAY }}>{business.timeSlots[business.timeSlots.length - 1]}</Text>
              </>
            ) : (
              'Not specified'
            )}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
        <MaterialCommunityIcons name="map-marker-outline" size={22} color={Colors.PRIMARY} />
        <Text style={{ fontFamily: 'outfit', fontSize: 14, marginLeft: 5 }}>
            {business?.location}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
});

export default BusinessListItem;
