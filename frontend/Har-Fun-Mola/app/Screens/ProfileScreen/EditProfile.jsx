import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { userBaseUrl } from '../../URL/userBaseUrl.js';
import { setUser } from '../../redux/authSlice.js';
import ModalDropdown from 'react-native-modal-dropdown';

const EditProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading , setLoading ] = useState(false)

    const { fullName, email, phoneNumber, profilePic, profile, area, city, token } = useSelector(
        (state) => state?.auth?.user || {}
    );

    const [formData, setFormData] = useState({
        fullName: fullName || '',
        phoneNumber: phoneNumber || '',
        bio: profile.bio || '',
        city: city || '',
        area: area || '',
        profilePic: profilePic || '',
    });

    const [selectedImage, setSelectedImage] = useState(profilePic); // Store selected profile picture

    const handleInputChange = (name, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission required', 'Permission to access camera roll is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Set the selected image URI
        }
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('area', formData.area);

        if (selectedImage) {
            const fileName = selectedImage.split('/').pop();
            const fileType = fileName.split('.').pop();

            formDataToSend.append('file', {
                uri: selectedImage,
                name: fileName,
                type: `image/${fileType}`,
            });
        }

        try {
            setLoading(true)
            const response = await axios.put(`${userBaseUrl}/profile/update`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Ensure proper headers for file upload
                },
            });

            if (response.data.success) {
                dispatch(setUser(response.data.updatedUser));
                Alert.alert('Profile updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error updating profile', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error updating profile', 'An error occurred while updating your profile.');
        }
        finally{
            setLoading(false)
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.LIGHT_GRAY }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Edit Profile</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image 
                                source={selectedImage ? { uri: selectedImage } : {uri:profile?.profilePic}}
                                style={styles.imgStyle}
                            />
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Change Profile Picture</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChangeText={(value) => handleInputChange('fullName', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChangeText={(value) => handleInputChange('phoneNumber', value)}
                            keyboardType="phone-pad"
                        />

                        <ModalDropdown
                            options={['Rawalpindi', 'Lahore', 'Karachi']}
                            defaultValue={formData.city}
                            onSelect={(index, value) => handleInputChange('city', value)}
                            style={styles.inputDropdown}
                            textStyle={styles.dropdownText}
                            dropdownStyle={styles.dropdownStyle}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Area"
                            value={formData.area}
                            onChangeText={(value) => handleInputChange('area', value)}
                        />

                        <TextInput
                            style={styles.textArea}
                            placeholder="About Me"
                            value={formData.bio}
                            onChangeText={(value) => handleInputChange('bio', value)}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{!loading ? "Save Changes" :  <ActivityIndicator color="white"/>}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 62,
        zIndex: 1,
    },
    headerText: {
        fontSize: 30,
        marginTop:20,
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        textAlign: 'center',
    },
    card: {
        margin: 20,
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
    },
    innerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    formContainer: {
        marginTop: 10,
    },
    input: {
        height: 50,
        borderColor: Colors.GRAY,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 15,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
    },
    inputDropdown: {
        height: 50,
        borderColor: Colors.GRAY,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 15,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
        paddingVertical: 12,
        backgroundColor: Colors.PRIMARY_LIGHT,
        elevation: 2, // Adding subtle shadow for depth
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    dropdownStyle: {
        width: 340,
        height: 100,
        borderRadius: 0,
        backgroundColor: Colors.WHITE,
        borderColor: Colors.GRAY,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5, // Adds a soft shadow when the dropdown is visible
    },
    textArea: {
        height: 100,
        borderColor: Colors.GRAY,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingTop: 10,
        marginBottom: 15,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.DARK_TEXT,
    },
    saveButton: {
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 18,
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        textTransform: 'uppercase',
    },
    changePhotoText: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'outfit',
        color: Colors.PRIMARY,
    },
});

export default EditProfile;
