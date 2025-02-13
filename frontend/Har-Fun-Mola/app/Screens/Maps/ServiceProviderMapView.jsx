import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchUserLocation } from '../../../utils/fetchUserLocation';
import { Ionicons } from '@expo/vector-icons';

const ServiceProviderMapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const navigation = useNavigation();
  
  const route = useRoute();
  const { userUid } = route.params;

  useEffect(() => {
    if (userUid) {
      const userCallback = (location) => {
        setUserLocation(location);
        updateRegion(location);
      };
      fetchUserLocation(userUid, userCallback);
    }
  }, [userUid]);

  const updateRegion = (userLoc) => {
    if (userLoc) {
      setRegion({
        latitude: userLoc.latitude,
        longitude: userLoc.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
      </TouchableOpacity>

      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {userLocation && (
            <Marker coordinate={userLocation} title="User Location" pinColor="red" />
          )}
        </MapView>
      )}
    </View>
  );
};

export default ServiceProviderMapView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});
