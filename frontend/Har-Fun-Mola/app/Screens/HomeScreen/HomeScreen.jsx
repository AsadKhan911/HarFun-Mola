import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Header } from "../HomeScreen/Header.jsx";
import { Slider } from "../HomeScreen/Slider.jsx";
import { Categories } from "../HomeScreen/Categories.jsx";
import { BusinessList } from "../HomeScreen/BusinessList.jsx";
import { ScrollView } from "react-native-gesture-handler";
import useUserData from "../../../customHooks/Universal/getUserData.jsx"; 
import Colors from "../../../constants/Colors.ts";
import RatingModal from "../../Modals/RatingModal.jsx"; 

const Home = () => {
  const { userData, loading, error } = useUserData();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pendingReviewBooking, setPendingReviewBooking] = useState(null);

  // Update isModalVisible when userData is loaded
  useEffect(() => {
    if (userData?.pendingReviewBookings?.length > 0) {
      // Get the first booking with pending review
      const pendingReview = userData.pendingReviewBookings[0];
      setPendingReviewBooking(pendingReview);
      setModalVisible(true);
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

        {/* Categories */}
        <Categories />

        {/* Business List */}
        <BusinessList />

        {/* Display user info */}
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Welcome, {userData?.fullName}!
        </Text>
      </View>

      {/* Show the Rating Modal if pendingReview is true */}
      {pendingReviewBooking && (
        <RatingModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleReviewSubmit}
          ReviewToWhomId={pendingReviewBooking.serviceProviderId}  // Service provider ID
          bookingId={pendingReviewBooking.bookingId}  // Booking ID
        />
      )}
    </ScrollView>
  );
};

export default Home;
