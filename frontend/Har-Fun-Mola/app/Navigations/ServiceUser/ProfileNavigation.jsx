import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ViewProfile from '../../Screens/ProfileScreen/ViewProfile.jsx'
import Profile from '../../Screens/ProfileScreen/Profile.jsx'
import EditProfile from '../../Screens/ProfileScreen/EditProfile.jsx'

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
    </Stack.Navigator>
  )
}

export default ProfileNavigation