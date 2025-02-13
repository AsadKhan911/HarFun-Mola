import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Colors from "../../../constants/Colors";
import { fetchProviderLocation } from "../../../utils/fetchProviderLocation.js";
import { fetchUserLocation } from "../../../utils/fetchUserLocation.js";
import { useRoute } from '@react-navigation/native';

const ServiceUserMapView = () => {
  const route = useRoute();
  const { providerUid, userUid } = route.params;

  console.log("Provider ID:", providerUid);
  console.log("User ID:", userUid);

  const [providerLocation, setProviderLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (providerUid && userUid) {
      const providerCallback = (location) => {
        console.log("Provider Location:", location);
        setProviderLocation(location);
        updateRegion(location, userLocation); // Update map region
      };

      const userCallback = (location) => {
        console.log("User Location:", location);
        setUserLocation(location);
        updateRegion(providerLocation, location); // Update map region
      };

      // Fetch live locations from Firebase
      fetchProviderLocation(providerUid, providerCallback);
      fetchUserLocation(userUid, userCallback);
    }
  }, [providerUid, userUid]);

  // Function to update the map region dynamically
  const updateRegion = (providerLoc, userLoc) => {
    if (providerLoc && userLoc) {
      const midLatitude = (providerLoc.latitude + userLoc.latitude) / 2;
      const midLongitude = (providerLoc.longitude + userLoc.longitude) / 2;

      setRegion({
        latitude: midLatitude,
        longitude: midLongitude,
        latitudeDelta: Math.abs(providerLoc.latitude - userLoc.latitude) + 0.05,
        longitudeDelta: Math.abs(providerLoc.longitude - userLoc.longitude) + 0.05,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Now updates dynamically based on both locations
      >
        {/* Show provider's location */}
        {providerLocation && (
          <Marker
            coordinate={providerLocation}
            title="Service Provider"
            pinColor="blue"
          />
        )}

        {/* Show user's location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            pinColor="red"
          />
        )}

        {/* Draw polyline between provider and user */}
        {providerLocation && userLocation && (
          <Polyline
            coordinates={[providerLocation, userLocation]}
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

// import React, { useState, useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import Colors from "../../../constants/Colors";
// import { fetchProviderLocation } from "../../../utils/fetchProviderLocation.js"; // Import the function
// import { fetchUserLocation } from "../../../utils/fetchUserLocation.js"; // Import the function
// import { useRoute } from '@react-navigation/native'; // Use the route hook for accessing params

// const ServiceUserMapView = () => {

//   // Get providerUid from route params
//   const route = useRoute();
//   const { providerUid , userUid } = route.params;

//   console.log("Map wale ma id ",providerUid)

//   const [providerLocation, setProviderLocation] = useState({
//     latitude: 40, // Default latitude (Example: NYC)
//     longitude: -74, // Default longitude
//   });
//   const [userLocation, setUserLocation] = useState({
//     latitude: 40, // Default latitude (Example: NYC)
//     longitude: -74, // Default longitude
//   });

//   useEffect(() => {
//     if (providerUid && userUid) {
//       const locationCallback = (location) => {
//         setProviderLocation({
//           latitude: location.latitude,
//           longitude: location.longitude,
//         });
//       };

//       const locationCallback = (location) => {
//         setUserLocation({
//           latitude: location.latitude,
//           longitude: location.longitude,
//         });
//       };

//       // Fetch live location updates from Firebase
//       fetchProviderLocation(providerUid, locationCallback);
//     }
//   }, [providerUid , userUid]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: providerLocation.latitude,
//           longitude: providerLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={providerLocation}
//           title="Service Provider"
//           description="This is the service provider's location"
//         />
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.WHITE,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

// export default ServiceUserMapView;
