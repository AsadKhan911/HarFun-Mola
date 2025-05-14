import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Text, 
  View, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl.js';
import { useNavigation } from 'expo-router';

const ViewAllBids = () => {
    const [loading, setLoading] = useState(false);
    const [allOffers, setAllOffers] = useState([]);
    const [processingOffer, setProcessingOffer] = useState(null); // Track which offer is being processed
    const { user } = useSelector((state) => state.auth);
    const { token } = useSelector((state) => state.auth.user);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAllBidOffers = async () => {
            if (!user || !user._id) return;

            setLoading(true);
            try {
                const response = await fetch(`${BiddingModelBaseUrl}/all-jobs-bid-offers/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data?.offers) {
                    setAllOffers(data.offers);
                }
            } catch (error) {
                console.error("Error fetching all bid offers:", error);
                Alert.alert("Error", "Failed to load offers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllBidOffers();
    }, [user, token]);

    const handleAcceptOffer = async (offer) => {
        try {
            setProcessingOffer(offer._id); // Set the offer being processed
            const contractTerms = "Standard service agreement.";
    
            const response = await fetch(`${BiddingModelBaseUrl}/accept-bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    offerId: offer._id,
                    agreedPrice: offer.proposedPrice,
                    contractTerms,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert("Success", "Offer accepted and contract created successfully!");
                setAllOffers(prevOffers =>
                    prevOffers.map(o =>
                        o._id === offer._id ? { ...o, status: "Accepted" } : o
                    )
                );
                // Navigate to contracts screen after 1.5 seconds
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                Alert.alert("Error", data.message || "Failed to accept the offer.");
            }
        } catch (error) {
            console.error("Error accepting the offer:", error);
            Alert.alert("Error", "Something went wrong while accepting the offer.");
        } finally {
            setProcessingOffer(null); // Reset processing state
        }
    };

    const handleRejectOffer = async (offerId) => {
        try {
            setProcessingOffer(offerId); // Set the offer being processed
            const response = await fetch(`${BiddingModelBaseUrl}/reject-bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ offerId }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert("Success", "Offer rejected successfully.");
                setAllOffers(prevOffers =>
                    prevOffers.map(o =>
                        o._id === offerId ? { ...o, status: "Rejected" } : o
                    )
                );
                // Navigate back to jobs screen after 1.5 seconds
                setTimeout(() => {
                    navigation.navigate('MyJobs');
                }, 1500);
            } else {
                Alert.alert("Error", data.message || "Failed to reject the offer.");
            }
        } catch (error) {
            console.error("Error rejecting the offer:", error);
            Alert.alert("Error", "Something went wrong while rejecting the offer.");
        } finally {
            setProcessingOffer(null); // Reset processing state
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return '#4CAF50';
            case 'Rejected': return '#F44336';
            default: return '#FFC107';
        }
    };

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.header}>All Bid Offers</Text>
            <ScrollView contentContainerStyle={styles.container}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loaderText}>Loading bids...</Text>
                    </View>
                ) : (
                    <>
                        {allOffers.length > 0 ? (
                            allOffers.map((offer, index) => (
                                <View key={index} style={styles.offerCard}>
                                    <Text style={styles.serviceProviderName}>Bid Offer</Text>
                                    <View style={styles.cardHeader}>
                                        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(offer.status) }]}>
                                            {offer.status}
                                        </Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Name:</Text>
                                        <Text style={styles.value}>{offer.serviceProviderId.fullName}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Email:</Text>
                                        <Text style={styles.value}>{offer.serviceProviderId.email}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Offer:</Text>
                                        <Text style={styles.price}>${offer.proposedPrice}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Notes:</Text>
                                        <Text style={styles.value}>
                                            {offer.additionalNotes || "No additional notes"}
                                        </Text>
                                    </View>
                                    <View style={styles.bidDetailsContainer}>
                                        <Text style={styles.sectionTitle}>Job Details</Text>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Service Type:</Text>
                                            <Text style={styles.value}>{offer.bidId.serviceType}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Description:</Text>
                                            <Text style={styles.value}>{offer.bidId.description}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Budget:</Text>
                                            <Text style={styles.price}>${offer.bidId.budget}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Status:</Text>
                                            <Text style={styles.value}>{offer.bidId.status}</Text>
                                        </View>
                                    </View>

                                    {offer.status === 'Pending' && (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={[styles.button, styles.rejectButton]}
                                                onPress={() => handleRejectOffer(offer._id)}
                                                disabled={processingOffer === offer._id}
                                            >
                                                {processingOffer === offer._id ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text style={styles.buttonText}>Reject Offer</Text>
                                                )}
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.button, styles.acceptButton]}
                                                onPress={() => handleAcceptOffer(offer)}
                                                disabled={processingOffer === offer._id}
                                            >
                                                {processingOffer === offer._id ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text style={styles.buttonText}>Accept Offer</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No pending offers available for your posted jobs.
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loaderText: {
        marginTop: 16,
        color: '#6B7280',
    },
    offerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    serviceProviderName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 100,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    price: {
        flex: 1,
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
    bidDetailsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default ViewAllBids;