import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../Screens/LoginScreen/Login.jsx'; // Import Login Screen
import StarterScreen from '../../Screens/LoginScreen/StarterScreen.jsx'
import Signup from '../../Screens/SignupScreen/Signup.jsx'
import EmailOTPScreen from '../../Screens/LoginScreen/EmailOTPScreen.jsx'
import TabNavigation from '../ServiceUser/TabNavigation.jsx';
import { useSelector } from 'react-redux';
import serviceProviderDetails1 from '../../Screens/SignupScreen/SignupScreenSP1.jsx'
import serviceProviderDetails2 from '../../Screens/SignupScreen/SignupScreenSP2.jsx'
// import Home from '../Screens/HomeScreen/HomeScreen.jsx';

const Stack = createNativeStackNavigator();

export default function LoginNavigation() {

    const { user } = useSelector(store => store.auth);
    return (
       
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="StarterScreen" component={StarterScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="EmailOTPScreen" component={EmailOTPScreen} />
                <Stack.Screen name="home-tab" component={TabNavigation} />
                <Stack.Screen name="service-provider-signup-details-1" component={serviceProviderDetails1} />
                <Stack.Screen name="service-provider-signup-details-2" component={serviceProviderDetails2} /> 
            </Stack.Navigator>
           
    );
}
