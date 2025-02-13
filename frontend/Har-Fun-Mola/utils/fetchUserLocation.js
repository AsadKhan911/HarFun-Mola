// fetchLocation.js
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase/firebaseConfig.js"; // Assuming you already have Firebase setup

export const fetchUserLocation = (userId, callback) => {
  const locationRef = ref(db, `serviceUsers/${userId}/location`);

  onValue(locationRef, (snapshot) => {
    const location = snapshot.val();
    console.log("Fetched User location from Firebase:", location);
    if (location) {
      callback(location);
    }
  });
};

