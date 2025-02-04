import { createStackNavigator } from '@react-navigation/stack';
import ServiceProviderBookings from '../../Screens/ServiceProvider/ServiceBookings/Bookings.jsx';
import DetailBookingPage from "../../Screens/ServiceProvider/ServiceBookings/DetailBookingPage";

const Stack = createStackNavigator();

const BookingNavigationSP = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='bookings-page' component={ServiceProviderBookings}/>
      <Stack.Screen name='detail-booking-page' component={DetailBookingPage}/>
    </Stack.Navigator>
  );
};

export default BookingNavigationSP;