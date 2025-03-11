import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,
    ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {Image} from 'expo-image'
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker';
import { MajorListingsBaseUrl } from '../../../URL/userBaseUrl.js';
import Colors from '../../../../constants/Colors.ts';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For delete icon
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const PostMajorListings = () => {
    const [selectedService, setSelectedService] = useState("");
    const [pricingOptions, setPricingOptions] = useState([]);
    const [predefinedServices, setPredefinedServices] = useState({});
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState([]); // Dates unavailable for work
    const [timeSlots, setTimeSlots] = useState([]); // Available time slots
    const [timeList, setTimeList] = useState([]); // Predefined time slots
    const [selectedImage, setSelectedImage] = useState(null);

    const GOOGLE_PLACES_API_KEY = 'AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk'; // Replace with your API key

    const { user } = useSelector(store => store.auth);
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

    // Function to pick an image
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // Generate predefined time slots
    const generateTimeSlots = () => {
        const times = [];

        for (let i = 8; i <= 20; i += 2) { // Increment by 2 to create a 2-hour gap
            const hour = i > 12 ? i - 12 : i; // Convert 24-hour format to 12-hour
            const period = i >= 12 ? "PM" : "AM"; // Determine AM/PM

            times.push({ time: `${hour}:00 ${period}` });
        }

        setTimeList(times);
    };

    //fetch predefined services
    const fetchPredefinedServices = async () => {
        try {
            const response = await axios.get(`${MajorListingsBaseUrl}/getlisting/${categoryId}`);
            if (response.data.predefinedServices) {
                const services = {};
                response.data.predefinedServices.forEach(service => {
                    services[service.serviceName] = service.pricingOptions;
                });
                setPredefinedServices(services);
            }
        } catch (error) {
            console.error('Error fetching predefined services:', error);
        }
    };

    useEffect(() => {
        generateTimeSlots();
        fetchPredefinedServices();
    }, []);

    // Handle city selection and fetch areas
    const handleCitySelect = (index, city) => {
        setCity(city);
        setLocation('')
    };


    // Handle form submission
    const handlePostListing = async () => {

        // Check each field and show an alert if missing
        if (!selectedService) {
            Alert.alert('Missing Field', 'Please select a service.');
            return;
        }
        if (!description) {
            Alert.alert('Missing Field', 'Please enter a description.');
            return;
        }
        if (pricingOptions.length === 0) {
            Alert.alert('Missing Field', 'Please add at least one pricing option.');
            return;
        }
        if (!city) {
            Alert.alert('Missing Field', 'Please select a city.');
            return;
        }
        if (!location) {
            Alert.alert('Missing Field', 'Please enter a location.');
            return;
        }
        if (timeSlots.length === 0) {
            Alert.alert('Missing Field', 'Please select at least one available time slot.');
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            // Append text fields
            formData.append('serviceName', selectedService);
            formData.append('description', description);
            formData.append('city', city);
            formData.append('location', location);
            formData.append('categoryId', categoryId);

            // Append pricing options
            pricingOptions.forEach((option, index) => {
                formData.append(`pricingOptions[${index}][label]`, option.label);
                formData.append(`pricingOptions[${index}][price]`, option.price);
            });

            // Append unavailable dates
            unavailableDates.forEach((date, index) => {
                formData.append(`unavailableDates[${index}]`, date.toISOString());
            });

            // Append available time slots
            timeSlots.forEach((slot, index) => {
                formData.append(`timeSlots[${index}]`, slot);
            });

            // Append image if selected
            if (selectedImage) {
                const fileName = selectedImage.split('/').pop();
                const fileType = fileName.split('.').pop();

                formData.append('file', {
                    uri: selectedImage,
                    name: fileName,
                    type: `image/${fileType}`,
                });
            }

            const response = await axios.post(`${MajorListingsBaseUrl}/post`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'Listing posted successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error('Error posting listing:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Go Back Icon */}
                    <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color={Colors.BLACK} />
                    </TouchableOpacity>

                    <View style={styles.container}>
                        <Text style={styles.title}>Post your listing in {categoryName}</Text>

                        {/* Image Picker Box */}
                        <View style={styles.imagePickerContainer}>
                            {/* Always show the TouchableOpacity, but make it transparent when an image is selected */}
                            <TouchableOpacity
                                style={[
                                    styles.imagePickerButton,
                                    selectedImage && styles.imagePickerButtonTransparent // Make button transparent when image is selected
                                ]}
                                onPress={pickImage}
                            >
                                <Text style={[
                                    styles.imagePickerText,
                                    selectedImage && styles.imagePickerTextHidden // Hide text when image is selected
                                ]}>
                                    <Text style={{ textAlign: "center", fontWeight: "bold", display: "block" }}>
                                        Select Listing Image
                                    </Text>
                                    {"\n"} (Recommended Size: 800 x 600 pixels)
                                </Text>


                            </TouchableOpacity>

                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.selectedImage}
                                />
                            )}
                        </View>


                        <View style={styles.card}>
                            <ModalDropdown
                                options={Object.keys(predefinedServices)}
                                defaultValue="Select Service"
                                onSelect={(index, value) => {
                                    console.log("Selected Service:", value);
                                    setSelectedService(value);
                                    setPricingOptions(predefinedServices[value]);
                                }}
                                style={styles.inputDropdown}
                                textStyle={styles.dropdownText}
                                dropdownStyle={styles.dropdownStyle}
                                dropdownTextStyle={styles.dropdownItemText}
                            />


                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                placeholderTextColor={Colors.GRAY}
                            />


                            {pricingOptions.length > 0 && (
                                <View style={styles.containerPrices}>
                                    <Text style={styles.sectionTitlePrices}>Set Your Prices</Text>
                                    {pricingOptions.map((option, index) => (
                                        <View key={index} style={styles.priceRowPrices}>
                                            <Text style={styles.priceLabelPrices}>{option.label}:</Text>
                                            <TextInput
                                                style={styles.inputPrices}
                                                placeholder="Price in pkr"
                                                placeholderTextColor="#999"
                                                keyboardType="numeric"
                                                value={pricingOptions[index].price}
                                                onChangeText={(text) => {
                                                    const updatedPrices = [...pricingOptions];
                                                    updatedPrices[index].price = text;
                                                    setPricingOptions(updatedPrices);
                                                }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            )}



                            {/* City Selection */}

                            <View style={{ marginTop: 20 }}>
                                <ModalDropdown
                                    options={['Rawalpindi', 'Lahore', 'Karachi']}
                                    defaultValue={'Select City'}
                                    onSelect={handleCitySelect}
                                    style={styles.inputDropdown}
                                    textStyle={styles.dropdownText}
                                    dropdownStyle={styles.dropdownStylecity}
                                      dropdownTextStyle={styles.dropdownItemText}
                                />
                            </View>

                            {/* Searchable Area Input */}
                            <View style={styles.inputContainer}>
                                <GooglePlacesAutocomplete
                                    placeholder="Search Area"
                                    minLength={2}
                                    fetchDetails={true}
                                    onPress={(data, details) => {
                                        setLocation(data.description); // Set selected area
                                    }}
                                    query={{
                                        key: GOOGLE_PLACES_API_KEY,
                                        language: 'en',
                                        types: 'geocode', // Fetch places related to location
                                        components: `country:PK`, // Restrict search to Pakistan
                                    }}
                                    styles={{
                                        textInput: styles.input,
                                        listView: styles.suggestionsBox,
                                    }}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Select Unavailable Dates</Text>

                            {/* Calendar Picker for Unavailable Dates */}
                            <CalendarPicker
                                onDateChange={(date) => {
                                    // Toggle unavailable dates
                                    const isAlreadyUnavailable = unavailableDates.some(d => d.toDateString() === date.toDateString());
                                    if (isAlreadyUnavailable) {
                                        setUnavailableDates(unavailableDates.filter(d => d.toDateString() !== date.toDateString()));
                                    } else {
                                        setUnavailableDates([...unavailableDates, date]);
                                    }
                                }}
                                width={340}
                                minDate={Date.now()}
                                todayBackgroundColor={Colors.BLACK}
                                todayTextStyle={{ color: Colors.WHITE }}
                                selectedDayColor={Colors.PRIMARY}
                                selectedDayTextColor={Colors.WHITE}
                                selectedDates={unavailableDates} // Highlight unavailable dates
                            />

                            {/* Display Selected Unavailable Dates */}
                            <View style={styles.timeSlotBadgesContainer}>
                                {unavailableDates.map((date, index) => (
                                    <View key={index} style={styles.timeSlotBadge}>
                                        <Text style={styles.timeSlotBadgeText}>
                                            {new Date(date).toLocaleDateString()}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setUnavailableDates(unavailableDates.filter((_, i) => i !== index));
                                            }}
                                            style={styles.deleteButton}
                                        >
                                            <Icon name="close" size={16} color={Colors.WHITE} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            {/* Time Slot Picker */}
                            <Text style={styles.sectionTitle}>Select Available Time Slots</Text>

                            <View style={styles.section}>
                                <FlatList
                                    data={timeList}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.timeSlot,
                                                timeSlots.includes(item.time) && styles.selectedTimeSlot
                                            ]}
                                            onPress={() => {
                                                // Toggle time slots
                                                const isAlreadySelected = timeSlots.includes(item.time);
                                                if (isAlreadySelected) {
                                                    setTimeSlots(timeSlots.filter(time => time !== item.time));
                                                } else {
                                                    setTimeSlots([...timeSlots, item.time]);
                                                }
                                            }}
                                        >
                                            <Text
                                                style={
                                                    timeSlots.includes(item.time)
                                                        ? styles.selectedTimeText
                                                        : styles.unSelectedTimeText
                                                }
                                            >
                                                {item.time}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>

                            {/* Post Listing Button */}
                            <TouchableOpacity
                                style={[styles.postButton, isLoading && styles.disabledButton]}
                                onPress={handlePostListing}
                                disabled={isLoading}
                            >
                                <Text style={styles.postButtonText}>
                                    {isLoading ? <ActivityIndicator /> : 'Post Listing'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: Colors.WHITE, paddingBottom: 0, paddingTop: -60 },
    container: { marginTop: '20%', flex: 1, padding: 20 },
    title: { fontSize: 24, fontFamily: 'outfit-Bold', textAlign: 'center', marginBottom: 20 },
    card: { backgroundColor: Colors.WHITE, padding: 20, borderRadius: 12, elevation: 5 },
    input: { backgroundColor: Colors.LIGHT_GRAY, padding: 14, borderRadius: 10, fontSize: 16, marginBottom: 10 },
    textArea: { height: 100, textAlignVertical: 'top' },
    inputDropdown: {
        height: 50,
        
       
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 15,
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
        paddingVertical: 12,
        backgroundColor: Colors.PRIMARY_LIGHT,
        elevation: 2,
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    dropdownStyle: {
        marginTop:20,
        marginLeft:-10,
        width: 348,
        height: 193,
        borderRadius: 0,
        backgroundColor: Colors.WHITE,
        borderColor: Colors.GRAY,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    dropdownItemText: {
        fontSize: 15, 
        color: Colors.BLACK, 
        padding: 10, 
        backgroundColor:Colors.WHITE
    },
    dropdownStylecity:{
        marginTop:20,
        marginLeft:-10,
        width: 348,
        height: 120,
        borderRadius: 0,
        backgroundColor: Colors.WHITE,
        borderColor: Colors.GRAY,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    section: { 
        marginBottom: 20 
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'outfit-Bold',
        marginBottom: 10,
        marginTop: 20,
        marginBottom: 30
    },
    timeSlot: {
        padding: 10,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    selectedTimeSlot: {
        backgroundColor: Colors.PRIMARY,
    },
    selectedTimeText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
    unSelectedTimeText: {
        color: Colors.GRAY,
    },
    timeSlotBadgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    timeSlotBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    timeSlotBadgeText: {
        color: Colors.WHITE,
        fontSize: 14,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: Colors.RED,
        borderRadius: 10,
        padding: 4,
    },
    postButton: { backgroundColor: Colors.PRIMARY, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    postButtonText: { color: Colors.WHITE, fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: Colors.PRIMARY_LIGHT },
    containerPrices: {
        padding: 20,
        backgroundColor: Colors.PRIMARY_LIGHT, // Light background for contrast
        borderRadius: 10,
        elevation: 2, // Shadow effect for better visibility
    },
    sectionTitlePrices: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333', // Dark color for better readability
    },
    priceRowPrices: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3, // Android shadow
    },
    
    priceLabelPrices: {
        width: 168, 
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        textAlign: 'left',
    },
    
    inputPrices: {
        flex: 1, // Take up remaining space dynamically
        marginLeft: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        color: '#333',
        fontSize: 15,
    },
    imagePickerContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically and horizontally
        marginVertical: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 200, // Set a fixed height for the container
        width: '100%', // Make the container full width
        position: 'relative', // For positioning the image absolutely
        overflow: 'hidden', // Ensure the image doesn't overflow the container
    },

    imagePickerButton: {
        position: 'absolute', // Position the button absolutely
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Ensure the button is on top of the image
        backgroundColor: 'transparent', // Default background
    },

    imagePickerButtonHidden: {
        display: 'none', // Hide the button when an image is selected
    },

    imagePickerButtonTransparent: {
        backgroundColor: 'transparent', // Make the button transparent when an image is selected
    },

    imagePickerText: {
        color: Colors.GRAY,
        fontWeight: 'bold',
    },

    selectedImage: {
        width: '100%', // Make the image take the full width of the container
        height: '100%', // Make the image take the full height of the container
        borderRadius: 10,
        resizeMode: 'cover', // Ensure the image covers the entire container
        position: 'absolute', // Position the image absolutely within the container
        top: 0,
        left: 0,
    },

    imagePickerTextHidden: {
        display: 'none', // Hide the text when an image is selected
    },
    goBackContainer: {
        position: "absolute",
        top: 50,
        left: 35
    },
});

export default PostMajorListings;