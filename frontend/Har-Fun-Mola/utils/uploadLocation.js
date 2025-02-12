import { database, ref, set } from "../../src/firebase/firebaseConfig.js";

export const uploadProviderLocation = async (providerId, coords) => {
  const locationRef = ref(database, `locations/${providerId}`);
  await set(locationRef, {
    latitude: coords.latitude,
    longitude: coords.longitude,
    timestamp: Date.now(),
  });
};
