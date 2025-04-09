import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, Button, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux'; // Access Redux state
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl.js'; // Assuming you have a base URL

const ViewAllBids = () => {
    const [loading, setLoading] = useState(false);
    const [allOffers, setAllOffers] = useState([]);

    const { token, user } = useSelector((state) => state.auth); // Get user token and user from Redux

    useEffect(() => {
        const fetchAllBidOffers = async () => {
            if (!user || !user._id) {
                console.log("No user found.");
                return;
            }

            setLoading(true);
            try {
                // Fetch all offers for jobs posted by the service user
                const response = await fetch(`${BiddingModelBaseUrl}/all-jobs-bid-offers/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass token in headers if needed
                    },
                });

                const data = await response.json();

                if (data && data.offers) {
                    console.log("Fetched All Offers:", data.offers);

                    // Set all fetched offers
                    setAllOffers(data.offers);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching all bid offers:", error);
                setLoading(false);
            }
        };

        fetchAllBidOffers();
    }, [user, token]); // Dependency on user and token

    const handleAcceptOffer = (offerId) => {
        console.log('Offer Accepted:', offerId);
        // Implement accept offer logic (e.g., API call to accept offer)
    };

    const handleRejectOffer = (offerId) => {
        console.log('Offer Rejected:', offerId);
        // Implement reject offer logic (e.g., API call to reject offer)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {allOffers.length > 0 ? (
                        allOffers.map((offer, index) => (
                            <View key={index} style={styles.offerCard}>
                                <Text style={styles.serviceProviderName}>{offer.serviceProviderId.fullName}</Text>
                                <Text>Email: {offer.serviceProviderId.email}</Text>
                                <Text>Phone: {offer.serviceProviderId.phone}</Text>
                                <Text>Price Offered: ${offer.proposedPrice}</Text>
                                <Text>Notes: {offer.additionalNotes || "No additional notes"}</Text>
                                <Text>Status: {offer.status}</Text>

                                {/* Displaying Bid Details */}
                                <Text style={styles.bidDetails}>
                                    Service Type: {offer.bidId.serviceType}
                                </Text>
                                <Text style={styles.bidDetails}>
                                    Description: {offer.bidId.description}
                                </Text>
                                <Text style={styles.bidDetails}>
                                    Budget: ${offer.bidId.budget}
                                </Text>
                                <Text style={styles.bidDetails}>
                                    Status: {offer.bidId.status}
                                </Text>

                                <Button title="Accept Offer" onPress={() => handleAcceptOffer(offer._id)} />
                                <Button title="Reject Offer" onPress={() => handleRejectOffer(offer._id)} />
                            </View>
                        ))
                    ) : (
                        <Text>No offers available for the jobs posted by you.</Text>
                    )}
                </>
            )}
        </ScrollView>
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
});

export default ViewAllBids;
