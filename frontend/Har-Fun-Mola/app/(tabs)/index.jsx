// import React from 'react';
import LoginNavigation from '../Navigations/AuthNavigation/LoginNavigation.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import TabNavigation from '../Navigations/ServiceUser/TabNavigation.jsx'
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from '../redux/store.js'; // Make sure the path to your store is correct
import { PersistGate } from 'redux-persist/integration/react';
import { requestLocationPermission } from '../../utils/locationPermission.js';  // Update the path if necessary


const Index = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const getData = async () => {
    const data = await AsyncStorage.getItem('jwt_token')
    console.log("token " + data)
    if (data) {
      setIsLoggedIn(false)
    }
    console.log(isLoggedIn)
  }

  useEffect(() => {
    getData()
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews",
      "Text strings must be rendered within a <Text> component.",
      "Request failed with status code 400",
      "Request failed with status code 404",
      "No bookings found for this service provider."
    ]);

    // Request location permission when app starts
    requestLocationPermission();
  }, [])

  const [fontsLoaded] = useFonts({
    'outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
    'outfit-Medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
  })


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {isLoggedIn ? <TabNavigation /> : <LoginNavigation />}
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default Index;


//isloading ko false b krna h remember