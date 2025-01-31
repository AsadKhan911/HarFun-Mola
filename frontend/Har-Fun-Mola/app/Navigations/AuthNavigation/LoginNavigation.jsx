import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../Screens/LoginScreen/Login.jsx'; // Import Login Screen
import StarterScreen from '../../Screens/LoginScreen/StarterScreen.jsx'
import Signup from '../../Screens/LoginScreen/Signup.jsx'
import EmailOTPScreen from '../../Screens/LoginScreen/EmailOTPScreen.jsx'
import TabNavigation from '../ServiceUser/TabNavigation.jsx';
import { useSelector } from 'react-redux';
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
            </Stack.Navigator>
           
    );
}
