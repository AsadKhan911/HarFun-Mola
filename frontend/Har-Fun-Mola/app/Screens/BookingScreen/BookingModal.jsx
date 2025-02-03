import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarPicker from "react-native-calendar-picker";
import axios from "axios";
import Colors from "../../../constants/Colors.ts";
import { Heading } from "../../../components/Heading.jsx";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { BookingBaseUrl } from '../../URL/userBaseUrl.js';

const BookingModal = ({ business, handleCloseModal }) => {
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);

  const { _id } = useSelector(state => state?.auth?.user || {});

  useEffect(() => {
    if (business?.timeSlots && Array.isArray(business.timeSlots)) {
      setTimeList(business.timeSlots); // Directly set the timeSlots array
    } else {
      console.log("No valid time slots found.");
    }
  }, [business]);

  const handleDateChange = async (date) => {
    if (!date) {
      console.log("Error: Selected date is undefined");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Ensure business?.unavailableDates is an array before checking
    if (business?.unavailableDates?.some(d => new Date(d).toISOString().split("T")[0] === formattedDate)) {
      Alert.alert("Date not available", "This date is not available for booking.");
      return;
    }

    setSelectedDate(formattedDate);

    try {
      const response = await axios.get(`${BookingBaseUrl}/bookings/${business._id}/${formattedDate}`);
      if (response.status === 200) {
        setBookedTimeSlots(response.data.bookedSlots); // Ensure this is an array of strings
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || !address) {
      Alert.alert("Please fill all fields", "Please select a date, time, and enter your address.");
      return;
    }

    const formattedDate = new Date(selectedDate).toISOString();

    const bookingDetails = {
      date: formattedDate,
      timeSlot: selectedTime,
      address,
      instructions: note,
      userId: _id,
    };

    try {
      setLoading(true);

      if (!business?._id) {
        Alert.alert("Error", "Invalid service listing ID.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${BookingBaseUrl}/post/${business._id}`, bookingDetails);

      if (response.status === 201) {
        Alert.alert("Success", "Your booking has been added. You can check your booking status in the booking tab.");
        handleCloseModal();
      } else {
        Alert.alert("Error", "Failed to book. Please try again later.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20, paddingTop: 60 }}>
        <TouchableOpacity style={styles.backButton} onPress={handleCloseModal}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
          <Text style={styles.headerText}>Booking</Text>
        </TouchableOpacity>

        {/* Calendar Section */}
        <Heading text={"Select Date"} />
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={handleDateChange}
            width={340}
            minDate={new Date()}
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
                style={[
                  styles.timeSlot,
                  selectedTime === item && styles.selectedTimeSlot,
                  bookedTimeSlots.includes(item) && styles.disabledTimeSlot // Apply disabled styles
                ]}
                onPress={() => !bookedTimeSlots.includes(item) && setSelectedTime(item)}
                disabled={bookedTimeSlots.includes(item)} // Prevent selection
              >
                <Text
                  style={[
                    selectedTime === item ? styles.selectedTime : styles.unSelectedTime,
                    bookedTimeSlots.includes(item) && styles.disabledTimeText // Apply disabled text styles
                  ]}
                >
                  {item}
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
          <Text style={styles.confirmButtonText}>{loading ? "Booking..." : "Confirm & Book"}</Text>
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
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // For positioning the icon
  },
  selectedTimeSlot: {
    backgroundColor: Colors.PRIMARY,
  },
  selectedTime: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  unSelectedTime: {
    color: Colors.PRIMARY,
  },
  disabledTimeSlot: {
    backgroundColor: Colors.LIGHT_GRAY, // Muted background color
    borderColor: Colors.GRAY, // Muted border color
    opacity: 0.7, // Reduce opacity
  },
  disabledTimeText: {
    color: Colors.GRAY, // Muted text color
    textDecorationLine: "line-through", // Strikethrough effect
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
    marginBottom: 20,
  },
  confirmButtonText: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.WHITE,
  },
});

export default BookingModal;