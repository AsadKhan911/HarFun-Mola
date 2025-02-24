import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../../constants/Colors.ts'; // Your color constants
import { useSelector } from 'react-redux';
import { userBaseUrl } from '../../URL/userBaseUrl.js';

const EmailOTPScreen = () => {
    //Getting email and name from redux
    const email = useSelector(state => state.auth.user?.email); // Get the email from Redux
    const fullName = useSelector(state => state.auth.user?.fullName); // Get fullName from Redux
    const role = useSelector(state => state.auth.user?.role); // Get fullName from Redux

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // Timer state for countdown (in seconds)
    const [resendEnabled, setResendEnabled] = useState(false); // To control "Resend OTP" button
    const navigation = useNavigation();

    // Timer countdown logic
    useEffect(() => {
        if (timer === 0) {
            setResendEnabled(true); // Enable resend button when timer hits 0
            return;
        }

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        // Cleanup interval when the component is unmounted or timer reaches 0
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerifyOtp = async () => {
        console.log("handleVerifyOtp function triggered");
        if (!code) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${userBaseUrl}/verifyemail`, { "code": code }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                    
                    if (role === "Service Provider") {
                        navigation.replace('stripe-onboarding-link'); // Use replace instead of navigate
                    } else {
                        navigation.replace('Login'); 
                    }
                }
             else {
                Alert.alert('Incorrect OTP', response.data.message);
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email || !fullName) {
            Alert.alert('Error', 'Missing user information.');
            return;
        }

        // setLoading(true); // Set loading state to true when starting the request
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        try {
            // Sending the request to the backend API to resend OTP
            const response = await axios.post(`${userBaseUrl}/resend`, {
                email,
                verificationCode,
                fullName,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'OTP has been sent to your email again.');
                setTimer(30); // Reset timer for resend
                setResendEnabled(false); // Disable resend until timer hits 0
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error('Resend OTP Error:', error);
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false); // Stop loading state after request completes
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.title}>Email Verification</Text>
                        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter OTP"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={code}
                            onChangeText={(text) => setCode(text)}
                        />

                        <Text style={styles.timerText}>
                            {timer > 0 ? `Time remaining: ${timer}s` : 'Time is up! You can resend OTP now.'}
                        </Text>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Verifying...' : 'Verify'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, !resendEnabled && styles.buttonDisabled]}
                            onPress={handleResendOtp}
                            disabled={!resendEnabled}
                        >
                            <Text style={styles.buttonText}>
                                Resend OTP
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.WHITE, // Set background color to white for the whole screen
    },
    inner: {
        width: '100%',
        paddingBottom: 20, // Ensure there's padding at the bottom to avoid keyboard overlap
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        margin: 'auto',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
});

export default EmailOTPScreen;
