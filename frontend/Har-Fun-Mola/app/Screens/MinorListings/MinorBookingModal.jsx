import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarPicker from "react-native-calendar-picker";
import axios from "axios";
import Colors from "../../../constants/Colors.ts";
import { Heading } from "../../../components/Heading.jsx";
import { FlatList, TextInput } from "react-native-gesture-handler";
import {  MinorListingsBaseUrl, PaymentBaseUrl } from '../../URL/userBaseUrl.js';
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "expo-router";

const generateUUID = () => uuidv4();

const GOOGLE_API_KEY = 'AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk';

const MinorBookingModal = ({ business, handleCloseModal }) => {
    const [timeList, setTimeList] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [selectedPricingType, setSelectedPricingType] = useState(null); // 'service' or 'diagnostic'
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { _id } = useSelector(state => state?.auth?.user || {});

    const navigation = useNavigation()

    // Pricing options based on the business listing
    const pricingOptions = [
        {
            type: 'service',
            label: 'Service Fee',
            price: business?.price || 0,
            description: 'Standard service charge'
        },
        {
            type: 'diagnostic',
            label: 'Diagnostic Fee',
            price: business?.diagnosticPrice || 0,
            description: 'Initial diagnostic check (if applicable)'
        }
    ];

    useEffect(() => {
        if (business?.timeSlots && Array.isArray(business.timeSlots)) {
            setTimeList(business.timeSlots);
        } else {
            console.log("No valid time slots found.");
        }
    }, [business]);

    const createPaymentIntent = async () => {
        if (!selectedPricingType) {
            Alert.alert("Error", "Please select a pricing option.");
            return;
        }

        const selectedOption = pricingOptions.find(opt => opt.type === selectedPricingType);
        const amountInPaisa = selectedOption.price * 100;

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
            }
        }
    };

    useEffect(() => {
        if (paymentMethod === "CARD" && selectedPricingType) {
            createPaymentIntent();
        }
    }, [paymentMethod, selectedPricingType]);

    // Update the handleDateChange function


    // Update the confirmBooking function in MinorBookingModal
const confirmBooking = async () => {
    if (!selectedDate) {
        Alert.alert("Missing Field", "Please select a date.");
        return;
    }
    if (!selectedTime) {
        Alert.alert("Missing Field", "Please select a time.");
        return;
    }
    if (!selectedPricingType) {
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
                setLoading(false);
                return;
            }
        }

        const selectedOption = pricingOptions.find(opt => opt.type === selectedPricingType);

        const bookingDetails = {
            serviceListingId: business._id,
            date: selectedDate,
            timeSlot: selectedTime,
            latitude,
            longitude,
            address,
            instructions: note,
            paymentMethod,
            pricingType: selectedPricingType,
            amount: selectedOption.price
        };

        const response = await axios.post(`${MinorListingsBaseUrl}/book-minor-listing`, bookingDetails);

        if (response.status === 201) {
            Alert.alert("Success", "Your booking has been confirmed!");
            handleCloseModal();
            navigation.navigate('home-screen')
        } else {
            Alert.alert("Error", "Failed to book. Please try again later.");
        }
    } catch (error) {
        console.error("Booking Error:", error);
        Alert.alert("Error", error.response?.data?.message || "Failed to create booking");
    } finally {
        setLoading(false);
    }
};

// Update the handleDateChange function
// Update the handleDateChange function
const handleDateChange = async (date) => {
    if (!date) {
        console.log("Error: Selected date is undefined");
        return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);

    try {
        const response = await axios.get(
            `${MinorListingsBaseUrl}/${business._id}/${formattedDate}`,
            {
                headers: {
                    'Authorization': `Bearer ${YOUR_AUTH_TOKEN}` // Add your auth token here
                }
            }
        );
        
        if (response.status === 200) {
            setBookedTimeSlots(response.data.bookedSlots);
        }
    } catch (error) {
        console.error("Error fetching booked slots:", error);
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

                    {/* Pricing Options Section - Updated */}
                    <View style={styles.section}>
                        <Heading text={"Select Service Type"} />
                        <View style={styles.pricingOptionsContainer}>
                            {pricingOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.type}
                                    style={[
                                        styles.pricingOptionCard,
                                        selectedPricingType === option.type && styles.selectedPricingOptionCard,
                                    ]}
                                    onPress={() => setSelectedPricingType(option.type)}
                                >
                                    <View style={styles.pricingOptionHeader}>
                                        <Text style={[
                                            styles.pricingOptionTitle,
                                            selectedPricingType === option.type && styles.selectedPricingOptionTitle
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <Text style={[
                                            styles.pricingOptionPrice,
                                            selectedPricingType === option.type && styles.selectedPricingOptionPrice
                                        ]}>
                                            Rs. {option.price}
                                        </Text>
                                    </View>
                                    <Text style={styles.pricingOptionDescription}>{option.description}</Text>
                                    {selectedPricingType === option.type && (
                                        <View style={styles.selectedIndicator}>
                                            <Ionicons name="checkmark-circle" size={20} color={Colors.PRIMARY} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
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
                                if (details?.geometry?.location) {
                                    const { lat, lng } = details.geometry.location;
                                    setAddress(details?.formatted_address || data.description);
                                    setLatitude(lat);
                                    setLongitude(lng);
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
                        <Heading text={"Any Special Instructions"} />
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
                        style={[styles.confirmButton, loading && { opacity: 0.7 }]}
                        onPress={confirmBooking}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.WHITE} />
                        ) : (
                            <Text style={styles.confirmButtonText}>Confirm & Book</Text>
                        )}
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
        backgroundColor: Colors.PRIMARY_LIGHT
    },

    pricingOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.DARK_GRAY,
    },

    selectedPricingOptionText: {
        color: Colors.WHITE,
    },
    pricingOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pricingOptionCard: {
        flex: 1,
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: Colors.WHITE,
    },
    selectedPricingOptionCard: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY_LIGHT,
    },
    pricingOptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    pricingOptionTitle: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        color: Colors.DARK_GRAY,
    },
    selectedPricingOptionTitle: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    pricingOptionPrice: {
        fontSize: 16,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    selectedPricingOptionPrice: {
        color: Colors.PRIMARY_DARK,
    },
    pricingOptionDescription: {
        fontSize: 14,
        fontFamily: 'outfit',
        color: Colors.GRAY,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 5,
        right: 5,
    },

    // ... (rest of the existing styles)
});

export default MinorBookingModal;