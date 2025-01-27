import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { userBaseUrl } from '../../URL/userBaseUrl.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice.js'; // Import the Redux action

const Signup = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); // Initialize dispatch to call Redux actions

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Service User');
    const [city, setCity] = useState('Rawalpindi');
    const [area, setArea] = useState('');

    const handleSignup = async () => {
        try {
            // Validate input fields
            if (!fullName || !email || !phoneNumber || !password || !area) {
                Alert.alert('Error', 'All fields are required');
                return;
            }

            const data = {
                fullName,
                email,
                phoneNumber,
                password,
                role,
                city,
                area,
            };

            // Send signup data to backend
            const response = await axios.post(`${userBaseUrl}/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle success
            if (response.data.success) {
                Alert.alert(response.data.message, 'Verify your email');

                // Save user data to Redux
                dispatch(setUser(response.data.newUser)); // Save the user in Redux

                navigation.push('EmailOTPScreen'); // Redirect to OTP verification screen
            } else {
                Alert.alert('Signup Failed', response.data.message);
            }
        } catch (error) {
            console.error('Signup Error:', error);
            if (error.response && error.response.data) {
                Alert.alert('Error', error.response.data.message || 'An error occurred while signing up');
            } else {
                Alert.alert('Error', 'An unknown error occurred');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
            keyboardVerticalOffset={60} // Offset for better placement
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    {/* Logo Section */}
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/images/logohmtr.png')} style={styles.logo} />
                    </View>

                    {/* Signup Title */}
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Create your account to get started</Text>

                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            placeholderTextColor="#aaa"
                            value={fullName}
                            onChangeText={(text) => setFullName(text)}
                        />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            style={styles.input}
                            placeholderTextColor="#aaa"
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#aaa"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <TextInput
                            placeholder="Area"
                            style={styles.input}
                            placeholderTextColor="#aaa"
                            value={area}
                            onChangeText={(text) => setArea(text)}
                        />

                        {/* Role Selector */}
                        <View style={styles.radioButtons}>
                            <Text style={styles.inputLabel}>Role</Text>
                            <TouchableOpacity
                                style={[styles.radioButton, role === 'Service User' && styles.selectedRadioButton]}
                                onPress={() => setRole('Service User')}
                            >
                                <Text style={[styles.radioButtonText, role === 'Service User' && styles.selectedText]}>
                                    Service User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, role === 'Service Provider' && styles.selectedRadioButton]}
                                onPress={() => setRole('Service Provider')}
                            >
                                <Text style={[styles.radioButtonText, role === 'Service Provider' && styles.selectedText]}>
                                    Service Provider
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* City Selector */}
                        <View style={styles.radioButtons}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TouchableOpacity
                                style={[styles.radioButton, city === 'Rawalpindi' && styles.selectedRadioButton]}
                                onPress={() => setCity('Rawalpindi')}
                            >
                                <Text style={[styles.radioButtonText, city === 'Rawalpindi' && styles.selectedText]}>
                                    Rawalpindi
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, city === 'Lahore' && styles.selectedRadioButton]}
                                onPress={() => setCity('Lahore')}
                            >
                                <Text style={[styles.radioButtonText, city === 'Lahore' && styles.selectedText]}>
                                    Lahore
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, city === 'Karachi' && styles.selectedRadioButton]}
                                onPress={() => setCity('Karachi')}
                            >
                                <Text style={[styles.radioButtonText, city === 'Karachi' && styles.selectedText]}>
                                    Karachi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Already have an account? Login */}
                    <TouchableOpacity>
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                            <Text onPress={() => navigation.replace('Login')} style={styles.loginLink}>
                                Login
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 30,
    },
    logoContainer: {
        marginTop: 40, // Moved logo slightly higher
        marginBottom: 15, // Reduced bottom margin to save space
    },
    logo: {
        width: 200, // Adjusted size to fit better
        height: 200,
        marginBottom:-50,
        resizeMode: 'contain', // Ensures proper scaling
    },
    title: {
        fontSize: 20, // Slightly reduced font size
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10, // Reduced bottom margin
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20, // Reduced margin for compactness
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8, // Slightly smaller radius for compact design
        padding: 12,
        marginVertical: 8, // Reduced vertical spacing
        fontSize: 16,
    },
    inputLabel: {
        fontSize: 14, // Reduced font size
        fontWeight: 'bold',
        marginTop: 8,
        color: Colors.BLACK,
    },
    radioButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        width: '100%',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5, // Added vertical margin for spacing
        marginHorizontal: 5, // Reduced horizontal spacing
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    selectedRadioButton: {
        backgroundColor: Colors.PRIMARY,
    },
    radioButtonText: {
        color: '#000',
        fontSize: 14, // Reduced font size
    },
    selectedText: {
        color: '#fff',
    },
    signupButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        marginTop: 15, // Added margin for spacing
    },
    signupText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#444',
        marginTop: 15, // Reduced top margin
        textAlign: 'center',
    },
    loginLink: {
        color: '#000',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20, // Added padding for better alignment
    },
});


export default Signup;