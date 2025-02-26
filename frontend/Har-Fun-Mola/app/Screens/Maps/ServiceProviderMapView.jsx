import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert, Linking } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchProviderLocation } from "../../../utils/fetchProviderLocation";
import polyline from "polyline";

const GOOGLE_MAPS_API_KEY = "AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk"; // Replace with your API key

const ServiceProviderMapView = () => {
  const [region, setRegion] = useState(null);
  const [providerLocation, setProviderLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userLocation, providerUid } = route.params;

  useEffect(() => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }

    if (providerUid) {
      fetchProviderLocation(providerUid, (location) => {
        setProviderLocation(location);
      });
    }
  }, [userLocation, providerUid]);

  useEffect(() => {
    if (userLocation && providerLocation) {
      getRouteDirections(userLocation, providerLocation);
    }
  }, [userLocation, providerLocation]);

  // Fetch route from Google Maps API
  const getRouteDirections = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const routeCoordinates = points.map(([latitude, longitude]) => ({ latitude, longitude }));
        setRouteCoords(routeCoordinates);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Open Google Maps with Directions
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
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* User Marker */}
          {userLocation && <Marker coordinate={userLocation} title="User Location" pinColor="red" />}

          {/* Service Provider Marker */}
          {providerLocation && (
            <Marker coordinate={providerLocation} title="Service Provider" pinColor="blue" />
          )}

          {/* Draw Route Path */}
          {routeCoords.length > 0 && (
            <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
          )}
        </MapView>
      )}

      {/* Open in Google Maps Button */}
      <TouchableOpacity style={styles.openMapsButton} onPress={openGoogleMaps}>
        <Ionicons name="logo-google" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Open with Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  openMapsButton: {
    position: "absolute",
    bottom: 20, // Centered at the bottom
    alignSelf: "center", // Centers the button horizontally
    backgroundColor: "#4285F4", // Google Blue
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceProviderMapView;
