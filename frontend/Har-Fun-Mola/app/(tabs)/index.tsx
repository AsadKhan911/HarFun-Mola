// import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store.js'; // Make sure the path to your store is correct
import LoginNavigation from '../Navigations/LoginNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
// import HomeNavigation from '../Navigations/HomeNavigation.jsx'
import { useFonts } from 'expo-font';
import TabNavigation from '../Navigations/TabNavigation.jsx'
import { LogBox } from 'react-native';

const Index = () => {
  
  const [isLoggedIn , setIsLoggedIn] = useState(false)
  const getData = async () => {
    const data = await AsyncStorage.getItem('jwt_token')
    console.log("token " +  data)
    if(data)
    {
      setIsLoggedIn(false)
    }
    console.log(isLoggedIn)
  }

    useEffect(()=>{
      getData()
      LogBox.ignoreLogs([
        "VirtualizedLists should never be nested inside plain ScrollViews",
        "Text strings must be rendered within a <Text> component.",
        "AxiosError: Request failed with status code 400"
      ]);
    },[])

    const [fontsLoaded] = useFonts({
      'outfit-Bold' : require('../../assets/fonts/Outfit-Bold.ttf'),
      'outfit-Medium' : require('../../assets/fonts/Outfit-Medium.ttf'),
      'outfit' : require('../../assets/fonts/Outfit-Regular.ttf'),
    })

  
  return (
    <Provider store={store}>
      {isLoggedIn  ? <TabNavigation /> :  <LoginNavigation />  }
    </Provider>
  );
}

export default Index;


//isloading ko false b krna h remember