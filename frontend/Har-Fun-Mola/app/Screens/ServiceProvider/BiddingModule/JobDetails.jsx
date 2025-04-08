import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Divider, Text } from 'react-native-paper';

const JobDetails = ({ route }) => {
    const { job } = route.params; // Pass job data via navigation route
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePlaceBid = () => {
        setLoading(true);
        // TODO: Add API call to place bid
        setTimeout(() => {
            setLoading(false);
            alert("Bid placed successfully!");
        }, 1500);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Title style={styles.title}>{job.serviceType}</Title>
                <Paragraph style={styles.label}>Description</Paragraph>
                <Text style={styles.text}>{job.description}</Text>

                <Divider style={styles.divider} />

                <Paragraph style={styles.label}>Budget</Paragraph>
                <Text style={styles.budget}>${job.budget}</Text>

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
    );
};

export default JobDetails;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F8FAFC',
        flex:1
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
