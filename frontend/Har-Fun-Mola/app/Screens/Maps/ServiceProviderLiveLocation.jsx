import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../../constants/Colors'

const ServiceProviderLiveLocation = () => {
    return (
        <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Service Provider Location</Text>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>📍 Map View</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontFamily: 'outfit-Bold',
        fontSize: 18,
        color: Colors.DARK_GRAY,
        marginBottom: 16,
    },
    mapContainer: {
        backgroundColor: Colors.WHITE,
        padding: 16,
        borderRadius: 16,
        shadowColor: Colors.BLACK,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
        alignItems: "center",
    },
    mapPlaceholder: {
        width: "100%",
        height: 150,
        backgroundColor: Colors.LIGHT_GRAY,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    mapText: {
        fontSize: 16,
        fontFamily: "outfit-Bold",
        color: Colors.DARK_GRAY,
    },
})

export default ServiceProviderLiveLocation