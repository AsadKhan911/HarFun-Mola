import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '@/constants/Colors';

const ServiceProviderDetails1 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params; // Access userData passed from the first screen

    const [availability, setAvailability] = useState([]); // Array to store selected days
    const [fullAddress, setFullAddress] = useState('');
    const [experience, setExperience] = useState('');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDaySelection = (day) => {
        if (availability.includes(day)) {
            // If the day is already selected, remove it
            setAvailability(availability.filter((d) => d !== day));
        } else {
            // If the day is not selected, add it
            setAvailability([...availability, day]);
        }
    };

    const handleNext = () => {
        if (availability.length === 0 || !fullAddress || !experience) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        // Combine userData from the first screen with new fields from this screen
        const combinedData = {
            ...userData, // Fields from the first screen
            availability: availability.join(', '), // Convert array to a comma-separated string
            fullAddress,
            experience: parseInt(experience, 10), // Convert experience to a number
        };

        // Navigate to the next screen with the combined data
        navigation.navigate('service-provider-signup-details-2', {
            userData: combinedData,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Service Provider Details</Text>
                <Text style={styles.subtitle}>Please provide the following details</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select Available Service Days</Text>
                    <View style={styles.radioButtons}>
                        {daysOfWeek.map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.radioButton,
                                    availability.includes(day) && styles.selectedRadioButton,
                                ]}
                                onPress={() => handleDaySelection(day)}
                            >
                                <Text
                                    style={[
                                        styles.radioButtonText,
                                        availability.includes(day) && styles.selectedText,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        placeholder="Full Address"
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={fullAddress}
                        onChangeText={(text) => setFullAddress(text)}
                    />
                    <TextInput
                        placeholder="Experience (in years)"
                        keyboardType="numeric"
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={experience}
                        onChangeText={(text) => setExperience(text)}
                    />
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextText}>Next</Text>
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
        paddingTop:50
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
    input: {
        backgroundColor: '#FFFFFF',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        fontSize: 16,
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
    nextButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        marginTop: 15,
    },
    nextText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ServiceProviderDetails1;