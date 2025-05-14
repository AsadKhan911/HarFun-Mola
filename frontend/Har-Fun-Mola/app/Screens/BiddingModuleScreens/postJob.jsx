import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Alert, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setJobDetails } from '../../redux/biddingSlice.js';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';

const PostJob = () => {
    const dispatch = useDispatch();
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

            dispatch(setJobDetails(data));
            Alert.alert("Success", "Job posted successfully! You can view the job in 'My Jobs' Section");
            reset();
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView 
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create New Job</Text>
                    <Text style={styles.headerSubtitle}>Fill in the details to find the right professional</Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Service Type */}
                    <Text style={styles.label}>Service Type</Text>
                    <Controller
                        control={control}
                        name="serviceType"
                        rules={{ required: 'Service type is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View>
                                <TextInput
                                    placeholder="e.g. Plumbing, Electrical, Cleaning"
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </View>
                        )}
                    />

                    {/* Description */}
                    <Text style={styles.label}>Job Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        rules={{ required: 'Description is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View>
                                <TextInput
                                    placeholder="Describe your job in detail..."
                                    style={[styles.input, styles.textArea]}
                                    multiline
                                    numberOfLines={4}
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </View>
                        )}
                    />

                    {/* Budget */}
                    <Text style={styles.label}>Budget (PKR)</Text>
                    <Controller
                        control={control}
                        name="budget"
                        rules={{ required: 'Budget is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View>
                                <View style={styles.currencyInput}>
                                    
                                    <TextInput
                                        placeholder="Rs/_"
                                        style={[styles.input, { paddingLeft: 30 }]}
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </View>
                        )}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? "Posting Job..." : "Post Job"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#2d3436',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    currencyInput: {
        position: 'relative',
    },
    currencySymbol: {
        position: 'absolute',
        left: 15,
        top: 15,
        fontSize: 16,
        color: '#2d3436',
        zIndex: 1,
    },
    submitButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        padding: 16,
        marginTop: 25,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 5,
    },
});

export default PostJob;