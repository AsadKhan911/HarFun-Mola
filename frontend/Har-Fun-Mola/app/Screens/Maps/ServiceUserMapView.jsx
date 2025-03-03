import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import polyline from "polyline";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { fetchProviderLocation } from "../../../utils/fetchProviderLocation";
import Colors from "../../../constants/Colors";

const GOOGLE_MAPS_API_KEY = "AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk"; // Replace with your API key

const ServiceUserMapView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerUid, userUid, longitude, latitude } = route.params;

  const [providerLocation, setProviderLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({ latitude, longitude });
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    if (providerUid) {
      const providerCallback = (location) => {
        setProviderLocation(location);
        updateRegion(location, userLocation);
        if (userLocation) getRoute(location, userLocation);
      };

      fetchProviderLocation(providerUid, providerCallback);
    }
  }, [providerUid, userLocation]);

  const updateRegion = (providerLoc, userLoc) => {
    if (providerLoc && userLoc) {
      setRegion({
        latitude: (providerLoc.latitude + userLoc.latitude) / 2,
        longitude: (providerLoc.longitude + userLoc.longitude) / 2,
        latitudeDelta: Math.abs(providerLoc.latitude - userLoc.latitude) + 0.02,
        longitudeDelta: Math.abs(providerLoc.longitude - userLoc.longitude) + 0.02,
      });
    }
  };

  const getRoute = async (providerLoc, userLoc) => {
    const origin = `${providerLoc.latitude},${providerLoc.longitude}`;
    const destination = `${userLoc.latitude},${userLoc.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Google API Response:", data); // Debugging

      if (data.status !== "OK") {
        console.error("Google API Error:", data.status);
        return;
      }

      if (data.routes.length === 0) {
        console.warn("No route found");
        return;
      }

      const points = data.routes[0].overview_polyline?.points;
      if (!points) {
        console.error("No polyline found in response");
        return;
      }

      const decodedCoordinates = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      console.log("Decoded Route Coordinates:", decodedCoordinates);
      setRouteCoordinates(decodedCoordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const openGoogleMaps = () => {
    if (!userLocation || !providerLocation) {
      Alert.alert("Location Error", "User or Provider location is missing.");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${providerLocation.latitude},${providerLocation.longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={40} color="#007AFF" />
      </TouchableOpacity>

      <MapView style={styles.map} followsUserLocation region={region}>
        {/* Service Provider Marker */}
        {providerLocation && (
          <Marker coordinate={providerLocation} title="Service Provider">
            <View style={styles.markerContainer}>
              <Ionicons name="pin" size={15} color="white" />
            </View>
          </Marker>
        )}

        {/* User Marker */}
        {userLocation && (
          <Marker coordinate={userLocation} title="You">
            <View style={[styles.markerContainer, { backgroundColor: "#FF3B30" }]}>
              <Ionicons name="person-circle" size={15} color="white" />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={5} />
        )}
      </MapView>

      {/* Open in Google Maps Button */}
      <TouchableOpacity style={styles.openMapsButton} onPress={openGoogleMaps}>
        <Ionicons name="logo-google" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  markerContainer: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  openMapsButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#1E88E5",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  icon: { marginRight: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ServiceUserMapView;
