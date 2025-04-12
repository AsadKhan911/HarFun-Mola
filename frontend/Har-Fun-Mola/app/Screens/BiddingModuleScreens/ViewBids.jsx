import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl, PaymentBaseUrl } from '../../URL/userBaseUrl.js';
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../../constants/Colors.ts';

const generateUUID = () => uuidv4();

const ViewAllBids = () => {
    const [loading, setLoading] = useState(false);
    const [allOffers, setAllOffers] = useState([]);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { user } = useSelector((state) => state.auth);
    const { token } = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchAllBidOffers = async () => {
            if (!user || !user._id) {
                console.log("No user found.");
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${BiddingModelBaseUrl}/all-jobs-bid-offers/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data && data.offers) {
                    setAllOffers(data.offers);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching all bid offers:", error);
                setLoading(false);
            }
        };

        fetchAllBidOffers();
    }, [user, token]);

    const createPaymentIntent = async (price) => {
        const amountInPaisa = price * 100;

        try {
            const response = await fetch(
                `${PaymentBaseUrl}/create-payment-intent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: amountInPaisa,
                        currency: "pkr",
                        userId: user._id,
                    }),
                }
            );

            const responseData = await response.json();

            if (response.status === 200) {
                setPaymentIntentId(responseData.paymentIntentId);

                const { error } = await initPaymentSheet({
                    paymentIntentClientSecret: responseData.clientSecret,
                    returnURL: "myapp://stripe-redirect",
                });

                if (error) {
                    console.error("Error initializing payment sheet:", error.message);
                    Alert.alert("Payment Error", error.message);
                    return false;
                }
                return true;
            }
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
        return false;
    };

    const handlePayment = async (offer) => {
        setSelectedOffer(offer);
        setLoading(true);

        const paymentSuccess = await createPaymentIntent(offer.proposedPrice);
        setLoading(false);

        if (paymentSuccess) {
            setShowPaymentModal(true);
        }
    };

    const processPaymentAndAcceptOffer = async () => {
        setLoading(true);
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert("Payment Failed", error.message);
                setLoading(false);
                return;
            }

            // Payment succeeded, now accept the offer
            await acceptOfferAfterPayment(selectedOffer);

        } catch (error) {
            console.error("Error processing payment:", error);
            setLoading(false);
        }
    };

    const acceptOfferAfterPayment = async (offer) => {
        try {
            const contractTerms = "Standard service agreement.";

            const response = await fetch(`${BiddingModelBaseUrl}/accept-bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    offerId: offer._id,
                    agreedPrice: offer.proposedPrice,
                    contractTerms,
                    paymentIntentId,
                    paymentMethod: "CARD",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Offer accepted and payment processed successfully!");

                setAllOffers((prevOffers) =>
                    prevOffers.map((prevOffer) =>
                        prevOffer._id === offer._id ? { ...prevOffer, status: "Accepted" } : prevOffer
                    )
                );
            } else {
                Alert.alert("Error", data.message || "Failed to accept the offer.");
            }
        } catch (error) {
            console.error("Error accepting the offer:", error);
            Alert.alert("Error", "Something went wrong while accepting the offer.");
        } finally {
            setLoading(false);
            setShowPaymentModal(false);
            setSelectedOffer(null);
        }
    };

    const handleRejectOffer = async (offerId) => {
        try {
            const response = await fetch(`${BiddingModelBaseUrl}/reject-bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ offerId }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Offer rejected successfully.");

                setAllOffers((prevOffers) =>
                    prevOffers.map((offer) =>
                        offer._id === offerId ? { ...offer, status: "Rejected" } : offer
                    )
                );
            } else {
                Alert.alert("Error", data.message || "Failed to reject the offer.");
            }
        } catch (error) {
            console.error("Error rejecting the offer:", error);
            Alert.alert("Error", "Something went wrong while rejecting the offer.");
        }
    };

    return (
        <StripeProvider publishableKey="pk_test_51QugNP4ar1n4jNltsbhPR9kEV43YDjI4RDrhltYb5YgjHo3WQGevNAPuKPeY8yoNqNgrEir6JfQLsIrPxs12gmAX00hDxdInIS">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {loading && !showPaymentModal ? (
                        <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    ) : (
                        <>
                            {allOffers.length > 0 ? (
                                allOffers.map((offer, index) => {
                                    return (
                                        <View key={index} style={styles.offerCard}>
                                            <Text style={styles.serviceProviderName}>{offer.serviceProviderId.fullName}</Text>
                                            <Text>Email: {offer.serviceProviderId.email}</Text>
                                            <Text>Phone: {offer.serviceProviderId.phone}</Text>
                                            <Text>Price Offered: Rs.{offer.proposedPrice}</Text>
                                            <Text>Notes: {offer.additionalNotes || "No additional notes"}</Text>
                                            <Text>Status: {offer.status}</Text>

                                            <Text style={styles.bidDetails}>
                                                Service Type: {offer.bidId.serviceType}
                                            </Text>
                                            <Text style={styles.bidDetails}>
                                                Description: {offer.bidId.description}
                                            </Text>
                                            <Text style={styles.bidDetails}>
                                                Budget: Rs.{offer.bidId.budget}
                                            </Text>
                                            <Text style={styles.bidDetails}>
                                                Status: {offer.bidId.status}
                                            </Text>

                                            {offer.status === "Pending" && (
                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity
                                                        style={[styles.button, styles.acceptButton]}
                                                        onPress={() => handlePayment(offer)}
                                                        disabled={loading}
                                                    >
                                                        <Text style={[styles.buttonText , {color:Colors.BLACK}]}>Accept & Pay</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.button, styles.rejectButton]}
                                                        onPress={() => handleRejectOffer(offer._id)}
                                                        disabled={loading}
                                                    >
                                                        <Text style={styles.buttonText}>Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                            ) : (
                                <Text>No offers available for the jobs posted by you.</Text>
                            )}

                        </>
                    )}

                    {/* Payment Modal */}
                    {showPaymentModal && (
                        <View style={styles.paymentModal}>
                            <View style={styles.paymentContent}>
                                <Text style={styles.modalTitle}>Complete Payment</Text>
                                <Text style={styles.modalText}>
                                    You're about to pay Rs.{selectedOffer?.proposedPrice} to accept this offer.
                                </Text>

                                <TouchableOpacity
                                    style={[styles.button, styles.payButton]}
                                    onPress={processPaymentAndAcceptOffer}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.WHITE} />
                                    ) : (
                                        <Text style={styles.buttonText}>Pay Now</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => {
                                        setShowPaymentModal(false);
                                        setSelectedOffer(null);
                                    }}
                                    disabled={loading}
                                >
                                    <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    offerCard: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    serviceProviderName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bidDetails: {
        fontSize: 14,
        color: '#555',
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        height: 50, // Fixed height
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        minHeight: 50,
    },
    buttonText: {
        color: '#FFFFFF', // Hardcoded white for testing
        fontWeight: 'bold',
        fontSize: 16, // Explicit size
    },
    acceptButton: {
        backgroundColor: Colors.PRIMARY,
    },
    rejectButton: {
        backgroundColor: '#dc3545',
    },
    payButton: {
        backgroundColor: Colors.PRIMARY,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    buttonText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
    paymentModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingVertical:50
    },
    paymentContent: {
        backgroundColor: Colors.WHITE,
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ViewAllBids;