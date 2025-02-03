import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,
    ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker';
import { MajorListingsBaseUrl } from '../../../URL/userBaseUrl.js';
import Colors from '../../../../constants/Colors.ts';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For delete icon

const PostMajorListings = () => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    // const [selectedCity, setSelectedCity] = useState('');
    const [areas, setAreas] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [loadingAreas, setLoadingAreas] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState([]); // Dates unavailable for work
    const [timeSlots, setTimeSlots] = useState([]); // Available time slots
    const [timeList, setTimeList] = useState([]); // Predefined time slots

    const { user } = useSelector(store => store.auth);
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

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
    

    useEffect(() => {
        generateTimeSlots();
    }, []);

    // Fetch areas from GeoNames API
    const fetchAreas = async (cityName) => {
        setLoadingAreas(true);
        try {
            const response = await axios.get('http://api.geonames.org/searchJSON', {
                params: {
                    q: cityName,
                    fcode: 'PPLX',
                    maxRows: 600,
                    countryCode: 'PK',
                    username: 'Asadkhan911',
                },
            });

            if (response.data.geonames && response.data.geonames.length > 0) {
                const areaNames = response.data.geonames.map(area => area.toponymName || area.name);
                setAreas(areaNames);
                setFilteredAreas(areaNames);
            } else {
                setAreas([]);
                setFilteredAreas([]);
                Alert.alert('No Areas Found', `No areas found for ${cityName}.`);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
            Alert.alert('Error', 'Failed to fetch areas.');
        } finally {
            setLoadingAreas(false);
        }
    };

    // Handle city selection and fetch areas
    const handleCitySelect = (index, city) => {
        setCity(city);
        fetchAreas(city);
    };

    // Handle area search with dropdown
    const handleAreaChange = (query) => {
        setLocation(query);

        if (query.length > 1) {
            const filtered = areas.filter(area =>
                area.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredAreas(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    // Handle area selection
    const handleAreaSelect = (area) => {
        setLocation(area);
        setShowSuggestions(false);
    };

    // Handle form submission
    const handlePostListing = async () => {
        if (!serviceName || !description || !price || !city || !location || timeSlots.length === 0) {
            Alert.alert('Error', 'Please fill all the fields and add at least one time slot.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${MajorListingsBaseUrl}/post`, {
                serviceName,
                description,
                price: Number(price),
                city,
                location,
                categoryId,
                unavailableDates, // Send unavailable dates
                timeSlots // Send available time slots
            }, {
                headers: { 'Content-Type': 'application/json' }
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
                    <View style={styles.container}>
                        <Text style={styles.title}>Post in {categoryName}</Text>

                        <View style={styles.card}>
                            <TextInput
                                style={styles.input}
                                placeholder="Service Name"
                                value={serviceName}
                                onChangeText={setServiceName}
                                placeholderTextColor={Colors.GRAY}
                            />

                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                placeholderTextColor={Colors.GRAY}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Price"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholderTextColor={Colors.GRAY}
                            />

                            {/* City Selection */}
                            <ModalDropdown
                                options={['Rawalpindi', 'Lahore', 'Karachi']}
                                defaultValue={user?.city || 'Select City'}
                                onSelect={handleCitySelect}
                                style={styles.inputDropdown}
                                textStyle={styles.dropdownText}
                                dropdownStyle={styles.dropdownStyle}
                            />

                            {/* Searchable Area Input */}
                            <TextInput
                                style={styles.input}
                                placeholder="Area"
                                value={location}
                                onChangeText={handleAreaChange}
                                placeholderTextColor={Colors.GRAY}
                            />

                            {/* Custom Dropdown for Area Suggestions */}
                            {showSuggestions && (
                                <FlatList
                                    data={filteredAreas}
                                    keyExtractor={(item, index) => index.toString()}
                                    style={styles.suggestionsBox}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.suggestionItem} onPress={() => handleAreaSelect(item)}>
                                            <Text>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}

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
    scrollContainer: { flexGrow: 1, backgroundColor: Colors.WHITE, paddingBottom: 20 },
    container: { marginTop: '25%', flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    card: { backgroundColor: Colors.WHITE, padding: 20, borderRadius: 12, elevation: 5 },
    input: { backgroundColor: Colors.LIGHT_GRAY, padding: 14, borderRadius: 10, fontSize: 16, marginBottom: 10 },
    textArea: { height: 100, textAlignVertical: 'top' },
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
        elevation: 2,
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
        elevation: 5,
    },
    section: { marginBottom: 20 },
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
    disabledButton: { backgroundColor: Colors.GRAY },
});

export default PostMajorListings;