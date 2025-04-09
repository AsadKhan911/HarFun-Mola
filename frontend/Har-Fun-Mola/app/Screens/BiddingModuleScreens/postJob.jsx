import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; // Import dispatch and useSelector
import { setJobDetails } from '../../redux/biddingSlice.js'; // Import the action
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';

const PostJob = () => {
    const dispatch = useDispatch(); // To dispatch actions
    const { control, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((store) => store.auth.user);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(`${BiddingModelBaseUrl}/post-bid`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Store the job details in Redux
            dispatch(setJobDetails(data)); // Save the job details to Redux
            Alert.alert("Success", "Job posted successfully!");
            reset(); // Reset the form after successful submission
            
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Title style={styles.title}>Create a Job</Title>

                <Controller
                    control={control}
                    name="serviceType"
                    rules={{ required: 'Service type is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Service Type"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    rules={{ required: 'Description is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Job Description"
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="budget"
                    rules={{ required: 'Budget is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Budget ($)"
                            mode="outlined"
                            keyboardType="numeric"
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Job"}
                </Button>
            </Card>
        </ScrollView>
    );
};

export default PostJob;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 20,
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
    },
});
