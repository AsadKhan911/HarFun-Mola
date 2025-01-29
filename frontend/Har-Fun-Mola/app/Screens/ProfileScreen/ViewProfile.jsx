import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors.ts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ViewProfile = () => {
  const navigation = useNavigation(); // Initialize navigation
  const { fullName, email, phoneNumber, role, isEmailVerified, profile, area, city } = useSelector(state => state?.auth?.user || {});
  
  const emailBadgeText = isEmailVerified ? 'Email Verified' : 'Email Not Verified';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.LIGHT_GRAY }}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerText}>View Profile</Text>
      </View>

      {/* Combined Card */}
      <View style={styles.card}>
        {/* User Profile Info */}
        <View style={styles.innerContainer}>
          <Image source={{uri:profile?.profilePic}} style={styles.imgStyle} />
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.badgeContainer}>
            <Ionicons 
              name={isEmailVerified ? 'checkmark-circle' : 'close-circle'} 
              size={18} 
              color={isEmailVerified ? 'green' : 'red'} 
            />
            <Text style={[styles.badgeText, { color: isEmailVerified ? 'green' : 'red' }]}>{emailBadgeText}</Text>
          </View>
        </View>

        {/* Other Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>{phoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>{role}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>{area}, {city}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.aboutText}>About me{'\n'} <Text style={{fontFamily:'outfit'}}>{profile?.bio}</Text></Text>
          </View>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('edit-profile')}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 35,
    zIndex: 1,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  innerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imgStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    color: Colors.DARK_TEXT,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontFamily: 'outfit-Medium',
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  badgeText: {
    marginLeft: 5,
    fontFamily: 'outfit-Medium',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'outfit',
    color: Colors.DARK_TEXT,
  },
  aboutText:{
    marginLeft: -4,
    marginTop:5,
    fontSize: 17,
    fontFamily: 'outfit-Bold',
    color: Colors.DARK_TEXT,
  },
  editButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
    elevation: 5,
  },
  editButtonText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    textTransform: 'uppercase',
  },
});
