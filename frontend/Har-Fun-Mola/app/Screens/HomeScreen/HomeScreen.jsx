import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from "../HomeScreen/Header.jsx";
import { Slider } from "../HomeScreen/Slider.jsx";
import { Categories } from "../HomeScreen/Categories.jsx";
import { MinorCategories } from "../HomeScreen/minorCategories.jsx";
import { BusinessList } from "../HomeScreen/BusinessList.jsx";
import { ScrollView } from "react-native-gesture-handler";
import useUserData from "../../../customHooks/Universal/getUserData.jsx"; 
import Colors from "../../../constants/Colors.ts";
import RatingModalUser from "../../Modals/RatingModalUser.jsx"; 
import ChatPopup from '../AssistiveFixNavigator/ChatPopup.jsx';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
  const { userData, loading, error } = useUserData();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pendingReviewBooking, setPendingReviewBooking] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);


  useEffect(() => {
    if (userData?.pendingReviewBookings?.length > 0) {
      // Find the first booking where pendingReview is true
      const pendingReview = userData.pendingReviewBookings.find(booking => booking.pendingReview === true);

      if (pendingReview) {
        setPendingReviewBooking(pendingReview);
        setModalVisible(true);
      } else {
        setPendingReviewBooking(null); // Ensure no incorrect modal display
        setModalVisible(false);
      }
    } else {
      setPendingReviewBooking(null);
      setModalVisible(false);
    }
  }, [userData]); // Runs whenever userData changes

  const handleReviewSubmit = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.WHITE }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <Header />

      {/* Slider */}
      <View style={{ padding: 20 }}>
        <Slider />

        {/*Major Categories */}
        <Categories />

        {/*Minor Categories */}
        <MinorCategories />

        {/* Business List */}
        <BusinessList />
      </View>

      {/* Show the Rating Modal if pendingReview is true */}
      {pendingReviewBooking && (
        <RatingModalUser
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleReviewSubmit}
          userToReviewId={pendingReviewBooking?.serviceProviderId}  // Service provider ID
          bookingId={pendingReviewBooking.bookingId}  // Booking ID
        />
      )}

      {/* Chat Popup */}
      <ChatPopup visible={chatVisible} onClose={() => setChatVisible(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 250,
    right: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
});

export default Home;