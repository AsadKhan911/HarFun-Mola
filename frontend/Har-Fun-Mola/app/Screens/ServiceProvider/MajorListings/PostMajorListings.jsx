import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,
    ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { MajorListingsBaseUrl } from '../../../URL/userBaseUrl.js';
import Colors from '../../../../constants/Colors.ts';
import { useSelector } from 'react-redux';

const PostMajorListings = () => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [areas, setAreas] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { user } = useSelector(store => store.auth);
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

    // Fetch areas from GeoNames API
    const fetchAreas = async (cityName) => {
        setLoadingAreas(true);
        try {
            const response = await axios.get(`http://api.geonames.org/searchJSON`, {
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
        if (!serviceName || !description || !price || !city || !location) {
            Alert.alert('Error', 'Please fill all the fields before posting.');
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
    inputContainer: { flexDirection: 'row', alignItems: 'center' },
    searchIcon: { marginRight: 8 },
    suggestionsBox: { maxHeight: 150, backgroundColor: Colors.WHITE, borderRadius: 8, elevation: 3 },
    suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_LIGHT },
    postButton: { backgroundColor: Colors.PRIMARY, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    postButtonText: { color: Colors.WHITE, fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: Colors.GRAY },
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
});

export default PostMajorListings;
