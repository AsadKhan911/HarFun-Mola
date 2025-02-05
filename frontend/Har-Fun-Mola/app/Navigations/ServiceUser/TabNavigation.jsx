import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../../constants/Colors.ts';
import HomeNavigation from '../ServiceUser/HomeNavigation.jsx';
import ProfileNavigation from '../ServiceUser/ProfileNavigation.jsx';
import BookingNavigationUser from '../ServiceUser/BookingNavigation.jsx'
import HomeNavigationSP from '../ServiceProvider/HomeNavigationSP.jsx';
import BookingNavigationSP from '../ServiceProvider/BookingNavigationSP.jsx'
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    const { user } = useSelector(store => store.auth);
    if (!user) return null;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.PRIMARY, // Active tab color (e.g., white or your desired color)
                tabBarInactiveTintColor: Colors.GRAY,  // Inactive tab color
                tabBarStyle: {
                    backgroundColor: Colors.WHITE, // Set the background color of the tab bar
                },
            }}
        >
            {user.role === 'Service User' ? (
                <>
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
                        component={BookingNavigationUser}
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
                </>
            ) : (
                <>
                    <Tab.Screen
                        name="home"
                        component={HomeNavigationSP}
                        options={{
                            tabBarLabel: ({ color }) => (
                                <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>HomeSP</Text>
                            ),
                            tabBarIcon: ({ color, size }) => (
                                <Entypo name="home" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="booking"
                        component={BookingNavigationSP}
                        options={{
                            tabBarLabel: ({ color }) => (
                                <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>BookingSP</Text>
                            ),
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="book" size={size} color={color} />
                            ),
                        }}
                    />
                    {/* <Tab.Screen
                        name="bookings"
                        component={Booking}
                        options={{
                            tabBarLabel: ({ color }) => (
                                <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>Messages</Text>
                            ),
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="book" size={size} color={color} />
                            ),
                        }}
                    /> */}
                    <Tab.Screen
                        name="tab-profile"
                        component={ProfileNavigation}
                        options={{
                            tabBarLabel: ({ color }) => (
                                <Text style={{ color: color, fontSize: 12, marginTop: -1 }}>ProfileSP</Text>
                            ),
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="user" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            )}
        </Tab.Navigator>
    );
};

export default TabNavigation;
