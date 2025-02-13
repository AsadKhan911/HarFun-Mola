// fetchLocation.js
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase/firebaseConfig.js"; // Assuming you already have Firebase setup

export const fetchProviderLocation = (providerId, callback) => {
  const locationRef = ref(db, `serviceProviders/${providerId}/location`);

  onValue(locationRef, (snapshot) => {
    const location = snapshot.val();
    console.log("Fetched location from Firebase:", location);
    if (location) {
      callback(location);
    }
  });
};
