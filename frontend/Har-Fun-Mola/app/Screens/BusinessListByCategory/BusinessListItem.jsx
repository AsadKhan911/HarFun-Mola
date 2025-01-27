import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from 'expo-router';

const BusinessListItem = ({ business }) => {

  const navigation = useNavigation()
  return (

    <TouchableOpacity style={styles.container}
    onPress={()=>navigation.push('business-details' , {business:business})}> {/*sending business data*/}
      <Image source={require('../../../assets/images/abd.jpg')} style={styles.image} />  {/* { uri: business?.images?.url } */}

      <View style={styles.subContainer}>
        <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>{business?.contactPerson}</Text>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 19 }}>{business?.serviceName}</Text>
        <Text style={{ fontFamily: 'outfit-Medium', fontSize: 19 }}>{`${business?.price}Pkr`}</Text>
        <Text style={{ fontFamily: 'outfit', color: Colors.GRAY, fontSize: 16 }}>
          <FontAwesome6 name="location-dot" size={20} color={Colors.PRIMARY} 
          style={{marginRight:20}}/> {business?.location}
          </Text>
      </View>
    </TouchableOpacity>
  )
}

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
    marginBottom:20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  contactPerson: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 14,
  },
  serviceName: {
    fontFamily: 'outfit-bold',
    fontSize: 19,
    color: Colors.BLACK,
    marginVertical: 2,
  },
  price: {
    fontFamily: 'outfit-Medium',
    fontSize: 16,
    color: Colors.BLACK,
    marginVertical: 2,
  },
  location: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 14,
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10, 
  },
});

export default BusinessListItem