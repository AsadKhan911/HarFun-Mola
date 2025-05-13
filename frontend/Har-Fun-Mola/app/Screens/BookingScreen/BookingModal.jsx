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
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const generateUUID = () => uuidv4();

const GOOGLE_API_KEY = 'AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk';

const BookingModal = ({ business, handleCloseModal }) => {
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default is COD
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [selectedPricingOption, setSelectedPricingOption] = useState(null); // New state for selected pricing option
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
    if (!selectedPricingOption) {
      Alert.alert("Error", "Please select a pricing option.");
      return;
    }

    const amountInPaisa = selectedPricingOption.price * 100; // Use the selected pricing option's price

    try {
      const response = await axios.post(
        `${PaymentBaseUrl}/create-payment-intent`,
        {
          amount: amountInPaisa,
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
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
        console.error("Server Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Other Error:", error.message);
      }
    }
  };

  useEffect(() => {
    if (paymentMethod === "CARD") {
      createPaymentIntent();
    }
  }, [paymentMethod, selectedPricingOption]); // Add selectedPricingOption as a dependency

  const handleDateChange = async (date) => {
    if (!date) {
      console.log("Error: Selected date is undefined");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (business?.unavailableDates?.some(d => new Date(d).toISOString().split("T")[0] === formattedDate)) {
      Alert.alert("Date not available", "This date is not available for booking.");
      return;
    }

    setSelectedDate(formattedDate);

    try {
      const response = await axios.get(`${BookingBaseUrl}/bookings/${business._id}/${formattedDate}`);
      if (response.status === 200) {
        setBookedTimeSlots(response.data.bookedSlots);
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const confirmBooking = async () => {
    if (!selectedDate) {
      Alert.alert("Missing Field", "Please select a date.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Missing Field", "Please select a time.");
      return;
    }
    if (!selectedPricingOption) {
      Alert.alert("Missing Field", "Please select a pricing option.");
      return;
    }
    if (!address) {
      Alert.alert("Missing Field", "Please enter your address.");
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert("Missing Field", "Location coordinates are missing.");
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
          console.log(error.message);
          setLoading(false);
          return;
        }
      }
  
      const formattedDate = new Date(selectedDate).toISOString();
  
      const bookingDetails = {
        date: formattedDate,
        timeSlot: selectedTime,
        latitude,
        longitude,
        address,
        instructions: note,
        userId: _id,
        paymentMethod,
        paymentIntentId: paymentMethod === "CARD" ? paymentIntentId : null,
        paymentStatus: paymentMethod === "CARD" ? "Pending" : "Completed",
        selectedPricingOption,
      };
  
      if (!business?._id) {
        Alert.alert("Error", "Invalid service listing ID.");
        setLoading(false);
        return;
      }
  
      const response = await axios.post(`${BookingBaseUrl}/post/${business._id}`, bookingDetails);
      console.log("Booking Response:", response.data);
  
      if (response.status === 201) {
        Alert.alert("Success", "Your booking has been added. You can check your booking status in the booking tab.");
        handleCloseModal();
      } else {
        Alert.alert("Error", "Failed to book. Please try again later.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
        console.error("Server Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Other Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <StripeProvider publishableKey="pk_test_51QugNP4ar1n4jNltsbhPR9kEV43YDjI4RDrhltYb5YgjHo3WQGevNAPuKPeY8yoNqNgrEir6JfQLsIrPxs12gmAX00hDxdInIS">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          style={{ padding: 20, paddingTop: 60, backgroundColor: Colors.WHITE }}
        >
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

          {/* Pricing Options Section */}
          <View style={styles.section}>
            <Heading text={"Select Pricing Option"} />
            <FlatList
              data={business?.pricingOptions || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pricingOption,
                    selectedPricingOption?.label === item.label && styles.selectedPricingOption,
                  ]}
                  onPress={() => setSelectedPricingOption(item)}
                >
                  <Text style={styles.pricingOptionText}>
                    {item.label} - {item.price} PKR
                  </Text>
                </TouchableOpacity>
              )}
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
                    bookedTimeSlots.includes(item) && styles.disabledTimeSlot
                  ]}
                  onPress={() => !bookedTimeSlots.includes(item) && setSelectedTime(item)}
                  disabled={bookedTimeSlots.includes(item)}
                >
                  <Text
                    style={[
                      selectedTime === item ? styles.selectedTime : styles.unSelectedTime,
                      bookedTimeSlots.includes(item) && styles.disabledTimeText
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
            <GooglePlacesAutocomplete
              placeholder="Search Address"
              minLength={2}
              fetchDetails={true}
              onPress={(data, details = null) => {
                console.log("Selected Address:", data.description);
                console.log("Details:", details);
              
                if (details?.geometry?.location) {
                  const { lat, lng } = details.geometry.location;
                  console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                  setAddress(details?.formatted_address || data.description);
                  setLatitude(lat);
                  setLongitude(lng);
                } else {
                  console.log("Invalid or missing location details");
                }
              }}
              
              query={{
                key: GOOGLE_API_KEY,
                language: "en",
                components: "country:pk",
              }}
              styles={{
                textInput: styles.addressInput,
                listView: { backgroundColor: "white" },
              }}
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

          {/* Payment Selection */}
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
            style={[styles.confirmButton, loading && { backgroundColor: Colors.PRIMARY }]}
            onPress={confirmBooking}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>{loading ? "Booking..." : "Confirm & Book"}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
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
  section: {
    marginVertical: 10,
  },

  pricingOption: {
   marginRight: 10,
  padding: 10,
  backgroundColor: Colors.WHITE,
  borderBottomWidth: 1, // Only bottom border
  borderBottomColor: Colors.GRAY, // Color of the bottom border
  borderRadius: 0, // No rounded corners
  },

  selectedPricingOption: {
   backgroundColor:Colors.PRIMARY_LIGHT
  },

  pricingOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.DARK_GRAY,
  },

  selectedPricingOptionText: {
    color: Colors.WHITE,
  },
});

export default BookingModal;

