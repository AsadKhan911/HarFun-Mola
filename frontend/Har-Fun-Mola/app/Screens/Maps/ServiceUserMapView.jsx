import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Colors from "../../../constants/Colors";
import { fetchProviderLocation } from "../../../utils/fetchProviderLocation.js";
import { fetchUserLocation } from "../../../utils/fetchUserLocation.js";
import { useRoute } from '@react-navigation/native';
import polyline from "polyline";

const GOOGLE_MAPS_API_KEY = "AIzaSyBt8hQFcT_LFuwCYQKs-pHE_MqUXJeZgpk"; // 🔴 Replace with your API Key

const ServiceUserMapView = () => {
  const route = useRoute();
  const { providerUid, userUid } = route.params;

  const [providerLocation, setProviderLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Stores Google Maps route

  useEffect(() => {
    if (providerUid && userUid) {
      const providerCallback = (location) => {
        setProviderLocation(location);
        updateRegion(location, userLocation);
        if (userLocation) getRoute(location, userLocation); // Fetch route if user location is set
      };

      const userCallback = (location) => {
        setUserLocation(location);
        updateRegion(providerLocation, location);
        if (providerLocation) getRoute(providerLocation, location); // Fetch route if provider location is set
      };

      fetchProviderLocation(providerUid, providerCallback);
      fetchUserLocation(userUid, userCallback);
    }
  }, [providerUid, userUid]);

  // Update the map region dynamically
  const updateRegion = (providerLoc, userLoc) => {
    if (providerLoc && userLoc) {
      const midLatitude = (providerLoc.latitude + userLoc.latitude) / 2;
      const midLongitude = (providerLoc.longitude + userLoc.longitude) / 2;

      setRegion({
        latitude: midLatitude,
        longitude: midLongitude,
        latitudeDelta: Math.abs(providerLoc.latitude - userLoc.latitude) + 0.02,
        longitudeDelta: Math.abs(providerLoc.longitude - userLoc.longitude) + 0.02,
      });
    }
  };

  // Fetch route from Google Directions API
  const getRoute = async (providerLoc, userLoc) => {
    const origin = `${providerLoc.latitude},${providerLoc.longitude}`;
    const destination = `${userLoc.latitude},${userLoc.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Google API Response:", data); // 🔴 Debugging

      if (data.routes.length) {
        const points = data.routes[0].overview_polyline?.points; // 🔴 Ensure `overview_polyline` exists
        if (!points) {
          console.error("No polyline found in response");
          return;
        }

        const decodedCoordinates = decodePolyline(points);
        setRouteCoordinates(decodedCoordinates);
      } else {
        console.error("No routes found:", data.status);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };


  // Function to decode Google Maps polyline
  const decodePolyline = (encoded) => {
    return polyline.decode(encoded).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  };


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        region={region}
      >
        {/* Service Provider Marker */}
        {providerLocation && (
          <Marker
            coordinate={providerLocation}
            title="Service Provider"
            pinColor="blue"
          />
        )}

        {/* User Marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            pinColor="red"
          />
        )}

        {/* Route from Google Maps */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default ServiceUserMapView;
