import { Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../constants/Colors.ts';
import HomeNavigation from '../Navigations/HomeNavigation.jsx';
import ProfileNavigation from '../Navigations/ProfileNavigation.jsx'
import Booking from '../Screens/BookingScreen/Booking.jsx';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.PRIMARY,  // Active tab color (e.g., white or your desired color)
                tabBarInactiveTintColor: Colors.GRAY,  // Inactive tab color
                tabBarStyle: {
                    backgroundColor: Colors.WHITE, // Set the background color of the tab bar
                },
            }}
        >
            <Tab.Screen
                name="home"
                component={HomeNavigation}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>Home</Text>
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="booking"
                component={Booking}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>Booking</Text>
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="book" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="tab-profile"
                component={ProfileNavigation}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>Profile</Text>
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;
