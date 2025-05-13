import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import axios from 'axios';
import Colors from '../../../../constants/Colors.ts';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MinorServicesBaseUrl } from '../../../URL/userBaseUrl.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

const SubmitMinorListing = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { pricingData, selectedServices, providerId, categoryName } = params;

  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [diagnosticPrice, setDiagnosticPrice] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_PLACES_API_KEY = 'AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk';

  const created_by = providerId;

  // Create a summary of selected services and issues
  const serviceSummary = selectedServices.map(service => {
    const serviceIssues = pricingData.filter(item => item.serviceId === service._id);
    return {
      serviceName: service.serviceName,
      issues: serviceIssues.map(issue => ({
        issueName: issue.issueName,
        price: issue.price
      }))
    };
  });

  const handleGoBackToPricing = () => {
    navigation.navigate('predefined-issues-pricing', {
      initialPricing: pricingData, // Pass as initialPricing instead
      selectedServices,
      providerId,
      categoryName
    });
  };

  // Generate predefined time slots
  const generateTimeSlots = () => {
    const times = [];
    for (let i = 8; i <= 20; i += 2) {
      const hour = i > 12 ? i - 12 : i;
      const period = i >= 12 ? "PM" : "AM";
      times.push({ time: `${hour}:00 ${period}` });
    }
    setTimeList(times);
  };

  React.useEffect(() => {
    generateTimeSlots();
  }, []);

  const handleSubmit = async () => {
    if (!description || !city || !location || !diagnosticPrice || timeSlots.length === 0) {
      Alert.alert("Validation Error", "Please fill all the fields.");
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert("Missing Field", "Please select a valid location from the suggestions.");
      return;
    }

    const serviceIds = selectedServices.map(service => service._id);
    const issuesMapping = {};
    const pricePerIssue = [];

    pricingData.forEach(item => {
      if (!issuesMapping[item.serviceId]) {
        issuesMapping[item.serviceId] = [];
      }
      issuesMapping[item.serviceId].push(item._id);
      pricePerIssue.push({
        issueId: item._id,
        price: Number(item.price)
      });
    });

    try {
      setIsLoading(true);
      const response = await axios.post(`${MinorServicesBaseUrl}/submit-minor-listing`, {
        serviceIds,
        issues: issuesMapping,
        pricePerIssue,
        created_by,
        description,
        city,
        location,
        latitude,
        longitude,
        diagnosticPrice: Number(diagnosticPrice),
        categoryName,
        timeSlots: timeSlots
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (response.data.success) {
        Alert.alert('Success', 'Listing posted successfully!');
        navigation.navigate('home-screen');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to create listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (index, city) => {
    setCity(city);
    setLocation('');
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
            <Text style={styles.title}>Finalize Listing in {categoryName}</Text>

            {/* Service Summary Section */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Pricing Summary</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleGoBackToPricing}
                >
                  <Text style={styles.editButtonText}>Edit Prices</Text>
                </TouchableOpacity>
              </View>

              {serviceSummary.map((service, sIndex) => (
                <View key={`service-${sIndex}`} style={styles.serviceContainer}>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  {service.issues.map((issue, iIndex) => (
                    <View key={`issue-${sIndex}-${iIndex}`} style={styles.issueRow}>
                      <Text style={styles.issueName}>{issue.issueName}</Text>
                      <Text style={styles.issuePrice}>Rs. {issue.price}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholderTextColor={Colors.GRAY}
              />

              <TextInput
                placeholder="Diagnostic Price"
                style={styles.input}
                keyboardType="numeric"
                value={diagnosticPrice}
                onChangeText={setDiagnosticPrice}
                placeholderTextColor={Colors.GRAY}
              />

              {/* City Selection */}
              <View style={{ marginTop: 10 }}>
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
                  onPress={(data, details = null) => {
                    if (details?.geometry?.location) {
                      const { lat, lng } = details.geometry.location;
                      setLocation(data.description);
                      setLatitude(lat);
                      setLongitude(lng);
                    }
                  }}
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en',
                    types: 'geocode',
                    components: 'country:PK',
                  }}
                  styles={{
                    textInput: styles.input,
                    listView: styles.suggestionsBox,
                  }}
                />
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

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.postButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.WHITE} />
                ) : (
                  <Text style={styles.postButtonText}>Submit Listing</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
  dropdownStylecity: {
    marginTop: 20,
    marginLeft: -10,
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
  dropdownItemText: {
    fontSize: 15,
    color: Colors.BLACK,
    padding: 10,
    backgroundColor: Colors.WHITE
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
  postButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  postButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold'
  },
  disabledButton: {
    backgroundColor: Colors.PRIMARY_LIGHT
  },
  goBackContainer: {
    position: "absolute",
    top: 50,
    left: 35
  },
  inputContainer: {
    marginBottom: 15
  },
  suggestionsBox: {
    backgroundColor: Colors.WHITE,
    marginTop: 5,
    borderRadius: 5,
    elevation: 3
  },
  summaryCard: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
    paddingBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'outfit-Bold',
    color: Colors.PRIMARY,
  },
  editButton: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'outfit-SemiBold',
    color: Colors.PRIMARY,
  },
  serviceContainer: {
    marginBottom: 15,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'outfit-Bold',
    color: Colors.BLACK,
    marginBottom: 8,
  },
  issueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderRadius: 6,
    marginBottom: 5,
  },
  issueName: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.BLACK,
    flex: 2,
  },
  issuePrice: {
    fontSize: 14,
    fontFamily: 'outfit-SemiBold',
    color: Colors.PRIMARY,
    textAlign: 'right',
    flex: 1,
  },
});

export default SubmitMinorListing;