import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarPicker from "react-native-calendar-picker";
import axios from "axios";
import Colors from "../../../constants/Colors.ts";
import { Heading } from "../../../components/Heading.jsx";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { BookingBaseUrl, PaymentBaseUrl } from '../../URL/userBaseUrl.js';
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

const BookingModal = ({ business, handleCloseModal }) => {
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default is COD
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { _id } = useSelector(state => state?.auth?.user || {});

  useEffect(() => {
    if (business?.timeSlots && Array.isArray(business.timeSlots)) {
      setTimeList(business.timeSlots); // Directly set the timeSlots array
    } else {
      console.log("No valid time slots found.");
    }
  }, [business]);
  const createPaymentIntent = async () => {
   
    const amountInPaisa = business?.price * 100;

    try {
      console.log("PaymentBaseUrl:",  business?.price);
      const response = await axios.post(
        `${PaymentBaseUrl}/create-payment-intent`,
        {
          amount: amountInPaisa, // Replace with actual service price
          currency: "pkr",
          userId: _id,
        }
      );
  
      if (response.status === 200) {
        setPaymentIntentId(response.data.paymentIntentId);
  
        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.clientSecret,
          returnURL: "myapp://stripe-redirect",
        });
  
        if (error) {
          console.error("Error initializing payment sheet:", error.message);
          Alert.alert("Payment Error", error.message);
        }
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      if (error.response) {
        console.error("📡 Server Response Data:", error.response.data);
        console.error("📡 Server Response Status:", error.response.status);
        console.error("📡 Server Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("❌ No Response Received:", error.request);
      } else {
        console.error("❌ Other Error:", error.message);
      }
    }
  };
  

  useEffect(() => {
    if (paymentMethod === "CARD") {
      createPaymentIntent();
    }
  }, [paymentMethod]);

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

    setLoading(true);
    try {
      if (paymentMethod === "CARD") {
        if (!paymentIntentId) {
          Alert.alert("Payment Error", "Payment has not been initialized.");
          setLoading(false);
          return;
        }

        const { error } = await presentPaymentSheet();
        if (error) {
          Alert.alert("Payment Failed", error.message);
          console.log(error.message)
          setLoading(false);
          return;
        }
      }

      const formattedDate = new Date(selectedDate).toISOString();

      const bookingDetails = {
        date: formattedDate,
        timeSlot: selectedTime,
        address,
        instructions: note,
        userId: _id,
        paymentMethod,
        paymentIntentId: paymentMethod === "CARD" ? paymentIntentId : null,
        paymentStatus: paymentMethod === "CARD" ? "Pending" : "Completed",
      };

      if (!business?._id) {
        Alert.alert("Error", "Invalid service listing ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${BookingBaseUrl}/post/${business._id}`, bookingDetails);
        console.log("Booking Response:", response.data); // Log response

        if (response.status === 201) {
          Alert.alert("Success", "Your booking has been added. You can check your booking status in the booking tab.");
          handleCloseModal();
        } else {
          Alert.alert("Error", "Failed to book. Please try again later.");
        }
      } catch (error) {
        console.error("Booking Error:", error);
        if (error.response) {
          console.error("📡 Server Response Data:", error.response.data);
          console.error("📡 Server Response Status:", error.response.status);
          console.error("📡 Server Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("❌ No Response Received:", error.request);
        } else {
          console.error("❌ Other Error:", error.message);
        }
      }
    } catch (error) {  // Added missing catch block
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <StripeProvider publishableKey="pk_test_51QugNP4ar1n4jNltsbhPR9kEV43YDjI4RDrhltYb5YgjHo3WQGevNAPuKPeY8yoNqNgrEir6JfQLsIrPxs12gmAX00hDxdInIS">
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

          {/* ✅ Payment Selection */}
          <View style={styles.paymentContainer}>
            <Heading text={"Select Payment Method"} />
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentButton, paymentMethod === "COD" && styles.selectedPaymentButton]}
                onPress={() => setPaymentMethod("COD")}
              >
                <Text style={[styles.paymentText, paymentMethod === "COD" && styles.selectedPaymentText]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentButton, paymentMethod === "CARD" && styles.selectedPaymentButton]}
                onPress={() => setPaymentMethod("CARD")}
              >
                <Text style={[styles.paymentText, paymentMethod === "CARD" && styles.selectedPaymentText]}>
                  Card Payment
                </Text>
              </TouchableOpacity>
            </View>
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
    </StripeProvider>
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
  paymentContainer: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selectedPaymentButton: {
    backgroundColor: Colors.PRIMARY,
  },
  paymentText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.PRIMARY,
  },
  selectedPaymentText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
});

export default BookingModal;

