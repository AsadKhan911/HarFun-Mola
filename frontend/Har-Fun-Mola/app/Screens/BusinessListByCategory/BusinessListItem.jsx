import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { useNavigation } from 'expo-router';

const BusinessListItem = ({ business }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('business-details', { business: business })} // Sending business data
    >
      <Image source={{ uri: business?.created_by?.profile?.profilePic }} style={styles.image} />

      <View style={styles.subContainer}>
        {/* Contact Person */}
        <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>{business?.contactPerson}</Text>

        {/* Service Name */}
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 19 }}>{business?.serviceName}</Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Ionicons name="pricetag-outline" size={18} color={Colors.PRIMARY} style={styles.priceIcon} />
          <Text style={{ fontFamily: 'outfit-Medium', fontSize: 19 }}>{`${business?.price} Pkr`}</Text>
        </View>

        {/* Location */}
        <Text style={{ fontFamily: 'outfit', color: Colors.GRAY, fontSize: 16 }}>
          <FontAwesome6 name="location-dot" size={20} color={Colors.PRIMARY} />
             {business?.city}, {business?.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Align items vertically centered
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000', // Add a slight shadow for better separation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  subContainer: {
    flex: 1, // Allow text to take up remaining space
    marginLeft: 15, // Space between image and text
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  priceIcon: {
    marginRight: 8, // Space between icon and price text
  },
});

export default BusinessListItem;