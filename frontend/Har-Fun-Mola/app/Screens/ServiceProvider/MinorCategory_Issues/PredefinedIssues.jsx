import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import Colors from '../../../../constants/Colors.ts';
import { useSelector } from 'react-redux';

const PredefinedIssues = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { selectedServices, categoryName } = route.params;
    const providerId = useSelector(state => state.auth.user._id);

    const [selectedIssues, setSelectedIssues] = useState([]);

    const toggleIssueSelection = (issue) => {
        setSelectedIssues((prevSelected) => {
            const exists = prevSelected.some((item) => item._id === issue._id);
            if (exists) {
                return prevSelected.filter((item) => item._id !== issue._id);
            } else {
                return [...prevSelected, issue];
            }
        });
    };

    const handleNext = () => {
        navigation.navigate('predefined-issues-pricing', {
          selectedIssues,
          selectedServices, // Pass all selected services
          providerId,
          categoryName
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Select Issues</Text>
            {selectedServices.map((service) => (
                <View key={service._id} style={styles.serviceBlock}>
                    <Text style={styles.serviceName}>{service.serviceName}</Text>
                    {service.predefinedIssues && service.predefinedIssues.length > 0 ? (
                        service.predefinedIssues.map((issue) => (
                            <CheckBox
                                key={issue._id}
                                title={issue.issueName}
                                checked={selectedIssues.some((i) => i._id === issue._id)}
                                onPress={() => toggleIssueSelection(issue)}
                                checkedColor={Colors.PRIMARY}
                                containerStyle={styles.checkbox}
                                textStyle={styles.checkboxText}
                            />
                        ))
                    ) : (
                        <Text style={styles.noIssueText}>No issues listed for this service.</Text>
                    )}

                </View>
            ))}

            <TouchableOpacity
                style={[
                    styles.nextButton,
                    selectedIssues.length === 0 && styles.disabledButton
                ]}
                disabled={selectedIssues.length === 0}
                onPress={handleNext}
            >
                <Text style={styles.buttonText}>
                    Next {selectedIssues.length > 0 ? `(${selectedIssues.length})` : ''}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        marginTop: 35,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    serviceBlock: {
        marginBottom: 25,
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 5,
    },
    checkboxText: {
        fontSize: 16,
        color: '#555',
    },
    noIssueText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#999',
    },
    nextButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PredefinedIssues;
