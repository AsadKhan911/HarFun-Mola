import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image'
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { userBaseUrl } from '../../URL/userBaseUrl';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../src/firebase/firebaseConfig';
import { setUser } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';

const ServiceProviderDetails2 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params; // Access userData passed from the previous screen

    const dispatch = useDispatch()

    const [addressProof, setAddressProof] = useState('');
    const [addressDocument, setAddressDocument] = useState(null);
    const [cnicDocument, setCnicDocument] = useState(null);
    const [policeDocument, setPoliceDocument] = useState(null);
    const [loading, setLoading] = useState(false);

    const addressProofOptions = ['Utility Bill', 'Bank Statement', 'Driver’s License'];

    const pickDocument = async (setDocument) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission Denied', 'Permission to access camera roll is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDocument(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!addressProof || !addressDocument || !cnicDocument || !policeDocument) {
            Alert.alert('Error', 'All fields and documents are required');
            return;
        }

        setLoading(true);

        try {
            // Step 1: Register the user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;
            console.log("User registered in Firebase:", user.uid);

            // Step 2: Prepare form data for backend registration
            const registerFormData = new FormData();
            registerFormData.append('fullName', userData.fullName);
            registerFormData.append('email', userData.email);
            registerFormData.append('phoneNumber', userData.phoneNumber);
            registerFormData.append('password', userData.password);
            registerFormData.append('role', userData.role);
            registerFormData.append('city', userData.city);
            registerFormData.append('area', userData.area);
            registerFormData.append('latitude', userData.latitude); // Add latitude
            registerFormData.append('longitude', userData.longitude); // Add longitude
            registerFormData.append('firebaseUID', user.uid); // Use the Firebase UID from the created user
            registerFormData.append('availability', userData.availability);
            registerFormData.append('fullAddress', userData.fullAddress);
            registerFormData.append('experience', userData.experience);
            registerFormData.append('addressProof', addressProof);

            if (userData.selectedImage) {
                const fileName = userData.selectedImage.split('/').pop();
                const fileType = fileName.split('.').pop();

                registerFormData.append('file', {
                    uri: userData.selectedImage,
                    name: fileName,
                    type: `image/${fileType}`,
                });
            }

            // Step 3: Register the user in the backend
            const registerResponse = await axios.post(`${userBaseUrl}/register`, registerFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!registerResponse.data.success) {
                Alert.alert('Error', 'Failed to register user');
                return;
            }

            dispatch(setUser(registerResponse.data.newUser))

            // Step 4: Prepare form data for document upload
            const uploadDocsFormData = new FormData();
            uploadDocsFormData.append('addressProof', addressProof);
            uploadDocsFormData.append('addressDocument', {
                uri: addressDocument,
                name: 'addressDocument.jpg',
                type: 'image/jpeg',
            });
            uploadDocsFormData.append('cnicDocument', {
                uri: cnicDocument,
                name: 'cnicDocument.jpg',
                type: 'image/jpeg',
            });
            uploadDocsFormData.append('policeDocument', {
                uri: policeDocument,
                name: 'policeDocument.jpg',
                type: 'image/jpeg',
            });
            uploadDocsFormData.append('userId', registerResponse.data.newUser._id); // Use the user ID from the registration response

            // Step 5: Upload documents
            const uploadDocsResponse = await axios.post(`${userBaseUrl}/uploaddocs`, uploadDocsFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (uploadDocsResponse.data.success) {
                Alert.alert('Success', 'Account created successfully. Verify your email.');
                navigation.replace('EmailOTPScreen');
            } else {
                Alert.alert('Error', 'Failed to upload documents');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while creating the account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Verification & Background Check</Text>
                <Text style={styles.subtitle}>Please upload the required documents for verification</Text>

                {/* Address Proof Selection */}
                <View style={styles.inputContainer}>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.inputLabel}>Select Address Proof Type</Text>
                        <View style={styles.radioButtons}>
                            {addressProofOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.radioButton,
                                        addressProof === option && styles.selectedRadioButton,
                                    ]}
                                    onPress={() => setAddressProof(option)}
                                >
                                    <Text
                                        style={[
                                            styles.radioButtonText,
                                            addressProof === option && styles.selectedText,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Address Document Upload */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Upload Address Proof Document</Text>
                    <TouchableOpacity style={styles.documentPickerButton} onPress={() => pickDocument(setAddressDocument)}>
                        <Text style={styles.documentPickerText}>
                            {addressDocument ? 'Address Proof Document Selected' : 'Pick Address Proof Document'}
                        </Text>
                    </TouchableOpacity>
                    {addressDocument && (
                        <Image source={{ uri: addressDocument }} style={styles.previewImage} />
                    )}
                </View>

                {/* CNIC Document Upload */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Upload CNIC</Text>
                    <TouchableOpacity style={styles.documentPickerButton} onPress={() => pickDocument(setCnicDocument)}>
                        <Text style={styles.documentPickerText}>
                            {cnicDocument ? 'CNIC Document Selected' : 'Pick CNIC Document'}
                        </Text>
                    </TouchableOpacity>
                    {cnicDocument && (
                        <Image source={{ uri: cnicDocument }} style={styles.previewImage} />
                    )}
                </View>

                {/* Police Document Upload */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Upload Police Document</Text>
                    <TouchableOpacity style={styles.documentPickerButton} onPress={() => pickDocument(setPoliceDocument)}>
                        <Text style={styles.documentPickerText}>
                            {policeDocument ? 'Police Document Selected' : 'Pick Police Document'}
                        </Text>
                    </TouchableOpacity>
                    {policeDocument && (
                        <Image source={{ uri: policeDocument }} style={styles.previewImage} />
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>{loading ? 'Uploading...' : 'Submit'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 30,
        paddingTop: 55
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
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
        marginVertical: 5,
        marginHorizontal: 5,
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
        fontSize: 14,
    },
    selectedText: {
        color: '#fff',
    },
    documentPickerButton: {
        backgroundColor: Colors.LIGHT_GRAY,
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 8,
        width: '100%',
    },
    documentPickerText: {
        color: Colors.BLACK,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
        alignSelf: 'center',
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        marginTop: 15,
    },
    submitText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ServiceProviderDetails2;