import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import Colors from "../../../../constants/Colors.ts";
import { BookingBaseUrl } from "../../../URL/userBaseUrl.js";
import axios from "axios";
import { setAllProviderBookings } from "../../../redux/bookingSlice.js"; // Import the action

const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookingId } = route.params;
    const dispatch = useDispatch(); // Initialize dispatch
    const { singleBooking } = useSelector((store) => store.bookings);
    const [loading, setLoading] = useState(false);

    // Fetch booking details using the custom hook
    useGetFetchBookingDetails(bookingId);

    // Handle accept/reject action
    const handleAction = async (status) => {
        const statusText = status === "Reject" ? "Cancelled" : "Confirmed"; // Map "Reject" to "Cancelled" and "Accept" to "Confirmed"

        Alert.alert(
            `Confirm ${status}`,
            `Are you sure you want to ${status.toLowerCase()} this booking?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const response = await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, { status: statusText }); // Send the mapped status
                            if (response.status === 200) {
                                Alert.alert("Success", `Booking has been ${statusText.toLowerCase()}.`);

                                // Refetch the bookings list after updating the status
                                const bookingsResponse = await axios.get(`${BookingBaseUrl}/getproviderbookings`);
                                dispatch(setAllProviderBookings(bookingsResponse.data.bookings));

                                navigation.goBack(); // Go back to previous screen
                            }
                        } catch (error) {
                            console.error("Error updating booking:", error);
                            Alert.alert("Error", "Failed to update booking. Please try again.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (!singleBooking) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{singleBooking.service.serviceName}</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome name="user" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {singleBooking.user.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome name="phone" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {singleBooking.user.phoneNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome name="map-marker" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {singleBooking.user.area}, {singleBooking.user.city}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome name="dollar" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {singleBooking.service.price}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <FontAwesome name="calendar" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {new Date(singleBooking.date).toDateString()} | {singleBooking.timeSlot}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Status: {singleBooking.status}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleAction("Reject")}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Reject</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAction("Accept")}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Accept</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontFamily: "outfit-Bold",
        color: Colors.PRIMARY,
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        fontFamily: "outfit",
        color: Colors.GRAY,
        marginLeft: 10,
    },
    statusContainer: {
        marginTop: 15,
        padding: 8,
        borderRadius: 5,
        alignSelf: "center",
        backgroundColor: "#FFA726",
    },
    statusText: {
        fontSize: 14,
        color: Colors.WHITE,
        fontFamily: "outfit-Medium",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 5,
    },
    rejectButton: {
        backgroundColor: "#D9534F",
    },
    acceptButton: {
        backgroundColor: "#5CB85C",
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        fontFamily: "outfit-Medium",
    },
});

export default OrderDetailsScreen;