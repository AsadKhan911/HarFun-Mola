import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarPicker from "react-native-calendar-picker";
import axios from "axios"; 
import Colors from "../../../constants/Colors.ts";
import { Heading } from "../../../components/Heading.jsx";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { BookingBaseUrl } from '../../URL/userBaseUrl.js'

const BookingModal = ({ business, handleCloseModal }) => {
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); // State to manage API call status
  
  const { _id } = useSelector(state => state?.auth?.user || {});

  useEffect(() => {
    generateTimeSlots();
  }, []);

  // Generate time slots
  const generateTimeSlots = () => {
    const times = [];
    for (let i = 8; i <= 12; i++) {
      times.push({ time: `${i}:00 AM` });
      times.push({ time: `${i}:30 AM` });
    }
    for (let i = 1; i <= 7; i++) {
      times.push({ time: `${i}:00 PM` });
      times.push({ time: `${i}:30 PM` });
    }
    setTimeList(times);
  };

  // Confirm booking and call backend API
  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || !address) {
      Alert.alert("Error", "Please select a date, time, and enter your address.");
      return;
    }

    // Alert.alert("Booking created successfully!")
    // handleCloseModal()

  
    // Construct booking details object
    const bookingDetails = {
      date: selectedDate,
      timeSlot: selectedTime,
      address,
      instructions: note,
      userId:_id , // Replace with the actual user ID
    };
  
    try {
      setLoading(true); // Start loading
  
      // Ensure the business._id is defined
      if (!business?._id) {
        Alert.alert("Error", "Invalid service listing ID.");
        setLoading(false);
        return;
      }
  
      const response = await axios.post(`${BookingBaseUrl}/post/${business._id}`, bookingDetails);
  
      if (response.status === 201) {
        Alert.alert("Success", "Your booking has been added, You can check you booking status in booking tab");
        handleCloseModal(); // Close the modal after successful booking
      } else {
        Alert.alert("Error", "Failed to book. Please try again later.");
      }
    } catch (error) {
      console.error("Booking API error: ", error.response?.data || error.message);
      Alert.alert("Error", "An error occurred while booking. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ padding: 20, paddingTop: 60 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCloseModal}
        >
          <Ionicons name="arrow-back-outline" size={30} color="black" />
          <Text style={styles.headerText}>Booking</Text>
        </TouchableOpacity>

        {/* Calendar Section */}
        <Heading text={"Select Date"} />
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={setSelectedDate}
            width={340}
            minDate={Date.now()}
            todayBackgroundColor={Colors.BLACK}
            todayTextStyle={{ color: Colors.WHITE }}
            selectedDayColor={Colors.PRIMARY}
            selectedDayTextColor={Colors.WHITE}
          />
        </View>

        {/* Time select section */}
        <View style={styles.section}>
          <Heading text={"Select Time Slot"} />
          <FlatList
            data={timeList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.timeSlot}
                onPress={() => setSelectedTime(item?.time)}
              >
                <Text
                  style={
                    selectedTime === item.time
                      ? styles.selectedTime
                      : styles.unSelectedTime
                  }
                >
                  {item?.time}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Address section */}
        <View style={styles.section}>
          <Heading text={"Enter Address"} />
          <TextInput
            placeholder="Enter your address"
            placeholderTextColor="gray"
            style={styles.addressInput}
            onChangeText={setAddress}
            value={address}
          />
        </View>

        {/* User Note section */}
        <View style={styles.section}>
          <Heading text={"Any Suggestion Note"} />
          <TextInput
            placeholder="Enter your note"
            placeholderTextColor="gray"
            numberOfLines={4}
            multiline
            style={styles.noteInput}
            onChangeText={setNote}
            value={note}
          />
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, loading && { backgroundColor: Colors.GRAY }]}
          onPress={confirmBooking}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? "Booking..." : "Confirm & Book"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "outfit-medium",
    marginLeft: 10,
  },
  calendarContainer: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    padding: 20,
    borderRadius: 15,
  },
  section: {
    marginTop: 20,
  },
  timeSlot: {
    marginRight: 10,
  },
  selectedTime: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
    paddingHorizontal: 18,
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
  },
  unSelectedTime: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
    paddingHorizontal: 18,
    color: Colors.PRIMARY,
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    padding: 15,
    height: 60,
    fontSize: 16,
    fontFamily: "outfit",
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    textAlignVertical: "top",
    padding: 20,
    height: 150,
    fontSize: 16,
    fontFamily: "outfit",
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    padding: 15,
    marginBottom:20
  },
  confirmButtonText: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.WHITE,
  },
});

export default BookingModal;