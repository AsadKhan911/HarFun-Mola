import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {  StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import axios from 'axios';
import { BiddingModelBaseUrl } from '../../../URL/userBaseUrl';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { useNavigation } from 'expo-router';
import { addBidOffer } from '../../../redux/biddingSlice.js'; // Import the addBidOffer action

const JobDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { job } = route.params; // make sure you pass this from navigation
    const [bidAmount, setBidAmount] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((store) => store.auth.user);
    const dispatch = useDispatch(); // Initialize dispatch

    const handlePlaceBid = async () => {
        if (!bidAmount) {
            Alert.alert("Error", "Please enter your bid amount.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${BiddingModelBaseUrl}/place-bid`, {
                bidId: job._id,
                proposedPrice: parseFloat(bidAmount),
                additionalNotes,
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

            Alert.alert("Success", response.data.message);

            // Dispatch the bid offer to Redux after successful bid submission
            dispatch(addBidOffer({
                bidId: job._id,
                proposedPrice: parseFloat(bidAmount),
                additionalNotes,
            }));

            console.log({
                bidId: job._id,
                proposedPrice: parseFloat(bidAmount),
                additionalNotes,
            });
            
            setBidAmount('');
            setAdditionalNotes('');
            navigation.goBack();
        } catch (error) {
            console.error("Bid submission error:", error);
            Alert.alert("Error", error?.response?.data?.message || "Failed to place bid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'white' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust for your header height
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.card}>
                        <Title style={styles.title}>{job.serviceType}</Title>
    
                        <Paragraph style={styles.label}>Description</Paragraph>
                        <Text style={styles.text}>{job.description}</Text>
    
                        <Divider style={styles.divider} />
    
                        <Paragraph style={styles.label}>Budget</Paragraph>
                        <Text style={styles.budget}>Rs {job.budget}</Text>
    
                        <Divider style={styles.divider} />
    
                        {job.images?.length > 0 && (
                            <>
                                <Paragraph style={styles.label}>Images</Paragraph>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {job.images.map((uri, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri }}
                                            style={styles.image}
                                        />
                                    ))}
                                </ScrollView>
                                <Divider style={styles.divider} />
                            </>
                        )}
    
                        <Paragraph style={styles.label}>Add Note</Paragraph>
                        <TextInput
                            mode="outlined"
                            label="Additional Notes (optional)"
                            value={additionalNotes}
                            onChangeText={setAdditionalNotes}
                            multiline
                            style={styles.input}
                        />
    
                        <Paragraph style={styles.label}>Your Offer</Paragraph>
                        <TextInput
                            mode="outlined"
                            label="Enter your bid amount"
                            value={bidAmount}
                            onChangeText={setBidAmount}
                            keyboardType="numeric"
                            style={styles.input}
                        />
    
                        <Button
                            mode="contained"
                            onPress={handlePlaceBid}
                            disabled={loading || !bidAmount}
                            style={styles.bidButton}
                        >
                            {loading ? "Placing Bid..." : "Place Bid"}
                        </Button>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
    
    
};

export default JobDetails;

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: 'white',
    },
    
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        marginTop: 20,
        padding: 16,
        backgroundColor: 'white',
        flex: 1,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        color: '#374151',
    },
    text: {
        fontSize: 15,
        color: '#4B5563',
        marginTop: 4,
    },
    budget: {
        fontSize: 18,
        color: '#10B981',
        fontWeight: 'bold',
        marginTop: 4,
    },
    input: {
        marginTop: 8,
        marginBottom: 16,
    },
    bidButton: {
        borderRadius: 8,
        paddingVertical: 6,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    divider: {
        marginVertical: 12,
    },
});
