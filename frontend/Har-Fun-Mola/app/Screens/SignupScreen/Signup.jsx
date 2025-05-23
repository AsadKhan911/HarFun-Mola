import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'; // Import Image Picker
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { userBaseUrl } from '../../URL/userBaseUrl.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice.js';
import { ActivityIndicator } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../src/firebase/firebaseConfig.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => uuidv4();

const GOOGLE_API_KEY = 'AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk';
const Signup = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Service User');
    const [city, setCity] = useState('Rawalpindi');
    const [area, setArea] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordFeedback, setPasswordFeedback] = useState('');
    const [passwordFeedbackColor, setPasswordFeedbackColor] = useState('red');

    const getCityCoordinates = (city) => {
        const cityCoordinates = {
            Rawalpindi: "33.6844,73.0479",
            Lahore: "31.5204,74.3587",
            Karachi: "24.8607,67.0011",
        };
        return cityCoordinates[city] || "31.5204,74.3587"; // Default to Lahore
    };
    
    const handleAreaSelect = (data, details = null) => {
        if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            setArea(data.description);
            setLatitude(lat);
            setLongitude(lng);
        } else {
            setArea(data.description);
            setLatitude(null);
            setLongitude(null);
        }
    };

    const checkPasswordStrength = (password) => {
        const lengthCondition = password.length >= 8;
        const upperCaseCondition = /[A-Z]/.test(password);
        const specialCharCondition = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = '';
        let feedback = '';
        let color = 'red';
        if (lengthCondition && upperCaseCondition && specialCharCondition) {
            strength = 'Strong';
            feedback = 'Password Strong';
            color = 'green';

        } else if (lengthCondition && (upperCaseCondition || specialCharCondition)) {
            strength = 'Medium';
            feedback = 'Not too strong: add special characters and uppercase letters.';
            color = 'orange';

        } else {
            strength = 'Weak';
            feedback = 'Password should be at least 8 characters long, include uppercase letters and special characters.';
            color = 'red';
        }

        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
        setPasswordFeedbackColor(color);


        if (strength === 'Weak') {
            setPasswordFeedback('Password should be at least 8 characters long, include uppercase letters and special characters.');
        } else if (strength === 'Medium') {
            setPasswordFeedback('add special characters and uppercase letters.');
        } else if (strength === 'Strong') {
            setPasswordFeedback('Password Strong');
        } else {
            setPasswordFeedback('');
        }
    };


    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission Denied', 'Permission to access camera roll is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSignup = async () => {
        try {
            console.log("Auth object before signup:", auth);

            if (!auth) {
                console.error("Firebase Auth is not initialized!");
                return;
            }

            if (!fullName || !email || !phoneNumber || !password || !area || !role) {
                Alert.alert('Error', 'All fields are required');
                return;
            }

            setLoading(true);

            if (role === "Service User") {
                // Step 1: Create user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User registered in Firebase:", user.uid);

                // Step 2: Prepare form data for your backend
                const formData = new FormData();
                formData.append('fullName', fullName);
                formData.append('email', email);
                formData.append('phoneNumber', phoneNumber);
                formData.append('password', password);
                formData.append('role', role);
                formData.append('city', city);
                formData.append('area', area);
                formData.append('latitude', latitude);
                formData.append('longitude', longitude);
                formData.append('firebaseUID', user.uid);

                if (selectedImage) {
                    const fileName = selectedImage.split('/').pop();
                    const fileType = fileName.split('.').pop();

                    formData.append('file', {
                        uri: selectedImage,
                        name: fileName,
                        type: `image/${fileType}`,
                    });
                }

                // Step 3: Send data to your backend
                const response = await axios.post(`${userBaseUrl}/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    Alert.alert(response.data.message, 'Verify your email');
                    dispatch(setUser(response.data.newUser));
                    navigation.push('EmailOTPScreen');
                } else {
                    Alert.alert('Signup Failed', response.data.message);
                }
            } else if (role === "Service Provider") {
                // For Service Provider, navigate to service-provider-signup-details-1 with entered details
                navigation.navigate('service-provider-signup-details-1', {
                    userData: {
                        fullName,
                        email,
                        phoneNumber,
                        password,
                        role,
                        city,
                        area,
                        latitude,  // Pass the coordinates
                        longitude, // Pass the coordinates
                        selectedImage, // Pass the selected image URI
                    },
                });
            }
        } catch (error) {
            console.error('Signup Error:', error);

            // Handle Firebase-specific errors
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'This email is already in use.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Invalid email address.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Error', 'Password should be at least 6 characters.');
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/images/logohmtr.png')} style={styles.logo} />
                    </View>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Create your account to get started</Text>

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
                            onChangeText={(text) => {
                                setPassword(text);
                                checkPasswordStrength(text); // Check password strength as the user types
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {password && (
                            <View style={styles.passwordStrengthContainer}>
                                {passwordFeedback ? (
                                    <Text style={[styles.passwordFeedback, { color: passwordFeedbackColor }]}>
                                        {passwordFeedback}
                                    </Text>
                                ) : null}
                            </View>
                        )}

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

                        <Text style={styles.inputLabel}>Area</Text>
                        <GooglePlacesAutocomplete
                            placeholder="Search Area"
                            minLength={2}
                            fetchDetails={true}
                            onPress={handleAreaSelect}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                                components: 'country:pk',
                                location: getCityCoordinates(city),
                                radius: 10000,
                            }}
                            styles={{ textInput: styles.input }}
                        />


                        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                            <Text style={styles.imagePickerText}>
                                Pick a Profile Picture
                            </Text>
                        </TouchableOpacity>
                        {selectedImage && (
                            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                        )}
                    </View>

                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.signupText}>{loading ? <ActivityIndicator /> : "Sign Up"}</Text>
                    </TouchableOpacity>

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
    // Same styles as before
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
        marginBottom: -50,
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
        flexDirection: 'row', // Ensure the button content (text and indicator) are in a row
        justifyContent: 'center', // Centers the content horizontally
        alignItems: 'center', // Centers the content vertically
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
    imagePickerButton: {
        backgroundColor: '#ddd',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    imagePickerText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
        alignSelf: 'center',
    },
    passwordStrengthContainer: { marginTop: 5, marginBottom: 10, marginLeft: 5, width: '100%' },
    passwordStrengthText: { fontSize: 14, fontWeight: 'bold' },
    weak: { color: 'red' },
    medium: { color: 'orange' },
    strong: { color: 'green' },
    passwordFeedback: { fontSize: 13, fontFamily: 'outfit-Medium' },
});

export default Signup;
