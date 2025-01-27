import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ViewProfile from '../Screens/ProfileScreen/ViewProfile.jsx'
import Profile from '../Screens/ProfileScreen/Profile.jsx'
import EditProfile from '../Screens/ProfileScreen/EditProfile.jsx'
import Login from '../Screens/LoginScreen/Login.jsx';

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator 
    screenOptions={{
        headerShown:false
    }}>
        <Stack.Screen name='profile' component={Profile}/>
        <Stack.Screen name='view-profile' component={ViewProfile}/>
        <Stack.Screen name='edit-profile' component={EditProfile}/>
        <Stack.Screen name='Login' component={Login}/>
    </Stack.Navigator>
  )
}

export default ProfileNavigation