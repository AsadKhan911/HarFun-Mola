import * as Location from 'expo-location';
import { ref, set } from 'firebase/database';
import { db } from '../src/firebase/firebaseConfig.js';

let locationWatch = null;

 const startLocationUpdates = (userId) => {
  if (locationWatch) {
    console.log("Location updates already started.");
    return; // Prevent starting another location watch if already active
  }
  console.log("Starting location updates for user:", userId);
  // Start location updates
  locationWatch = Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // Updates every 5 seconds
    },
    async (location) => {
      try {
        console.log("Fetched user's Location:", location.coords);
        const locationRef = ref(db, `serviceUsers/${userId}/location`);
        await set(locationRef, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log('Location written to Firebase for user:', location.coords);
      } catch (error) {
        console.error("Error updating location to Firebase:", error);
      }
    }
  );
};

export const stopLocationUpdates = () => {
  if (locationWatch) {
    locationWatch.remove(); // Correct method to stop location updates
    console.log("Location updates stopped.");
  } else {
    console.log("No active location watch to stop.");
  }
};

export default startLocationUpdates

