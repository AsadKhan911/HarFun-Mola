import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    // If permission is denied, show alert with option to go to settings
    Alert.alert(
      'Location Permission Denied',
      'You have denied location access. To enable it, go to your device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),  // Opens device settings page
        },
      ]
    );
    return false;
  }

  // If permission is in another state, handle accordingly
  alert('Permission to access location was denied');
  return false;
};
