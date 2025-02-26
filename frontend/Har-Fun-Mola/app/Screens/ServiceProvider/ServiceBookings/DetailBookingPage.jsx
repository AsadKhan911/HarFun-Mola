import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import Colors from "../../../../constants/Colors.ts";
import { useGetUpdateBookingStatus } from "../../../../customHooks/useGetBookingPendingToAccepted.jsx";
import { PaymentBaseUrl } from "../../../URL/userBaseUrl.js";
import axios from "axios";

const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookingId } = route.params;
    const { singleBooking } = useSelector((store) => store.bookings);
    const { handleAction } = useGetUpdateBookingStatus(bookingId);

    const [acceptLoading, setAcceptLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    // Fetch booking details
    useGetFetchBookingDetails(bookingId);


    const handleBookingAction = async (status) => {
        console.log("🟢 handleBookingAction triggered with status:", status);
    
        if (!singleBooking) {
            console.error("❌ No booking data found. Exiting function.");
            return;
        }
    
        if (status === "Accept") {
            setAcceptLoading(true);
        } 
    
        // Payment unauthorization when rejecting the booking
        if (status === "Reject") {
            try {
                setRejectLoading(true)    

                const response = await axios.post(`${PaymentBaseUrl}/cancel-payment`, {
                    paymentIntentId: singleBooking.paymentIntentId,
                });
    
            } catch (error) {
                Alert.alert("Payment Cancellation Failed", error.response?.data?.error || error.message);
                console.log("Payment Cancellation Failed", error.response?.data?.error || error.message);
                setRejectLoading(false);
                return;
            }
        }
        
        const result = await handleAction(status);
    
        if (result.success) {
            console.log("Booking action successful.");
            Alert.alert("Success", result.message);
            navigation.goBack();
        } else {
            console.error("Booking action failed!");
            Alert.alert("Error", result.message);
        }
    
        // Reset loading state after the action is completed
        setAcceptLoading(false);
        setRejectLoading(false);
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
            {/* Go Back Icon */}
            <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
            </TouchableOpacity>

            <Card style={styles.card}>
                <Card.Content>
                    {/* View Profile Button */}
                    <View style={styles.profileButtonContainer}>
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("UserProfile", { userId: singleBooking.user.id })}>
                            <Text style={styles.profileButtonText}>View Client's Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>{singleBooking.service.serviceName}</Text>


                    <View style={styles.infoRow}>
                        <FontAwesome name="file" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}>Order Number: {singleBooking.orderNumber || "Assigns after confirmation"}</Text>
                    </View>

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
                        <Text style={styles.detail}> {singleBooking.address}, {singleBooking.user.city}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <FontAwesome name="credit-card" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}>{singleBooking.paymentMethod}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <FontAwesome name="money" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {singleBooking.service.price} Pkr</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <FontAwesome name="calendar" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}> {new Date(singleBooking.date).toDateString()} | {singleBooking.timeSlot}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <FontAwesome name="sticky-note-o" size={16} color={Colors.GRAY} />
                        <Text style={styles.detail}>{singleBooking?.instructions}</Text>
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
                    onPress={() => handleBookingAction("Reject")}
                    disabled={rejectLoading || acceptLoading}
                >
                    {rejectLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Reject</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleBookingAction("Accept")}
                    disabled={acceptLoading || rejectLoading}
                >
                    {acceptLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Accept</Text>}
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
        marginTop: '50%',
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
    profileButtonContainer: {
        marginTop: 0,
        marginBottom:20,
        alignItems: "center",
    },
    profileButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        backgroundColor: Colors.PRIMARY,
        shadowColor: Colors.GRAY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    profileButtonText: {
        fontSize: 16,
        color: Colors.WHITE,
        fontFamily: "outfit-Medium",
    },
    goBackContainer: {
        position: "absolute",
        top: 20,
        left: 18,
        zIndex: 1,
    },
});

export default OrderDetailsScreen;