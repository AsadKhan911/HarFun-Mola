import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { database } from "../firebaseConfig"; 
import { ref, set } from "firebase/database";

const useLiveLocation = (providerId) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (location) => {
          setLocation(location.coords);

          // Update live location in Firebase
          const locationRef = ref(database, `liveLocations/${providerId}`);
          set(locationRef, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
          });
        }
      );
    };

    startTracking();
  }, []);

  return location;
};

export default useLiveLocation;
