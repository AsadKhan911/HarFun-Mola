import { createStackNavigator } from '@react-navigation/stack';
import ServiceProviderBookings from '../../Screens/ServiceProvider/ServiceBookings/Bookings.jsx';
import DetailBookingPage from "../../Screens/ServiceProvider/ServiceBookings/DetailBookingPage";
import ActiveDetailsBookingPage from '../../Screens/ServiceProvider/ServiceBookings/ActiveDetailsBookingPage.jsx';
import CompletedDetailsBookingPage from '../../Screens/ServiceProvider/ServiceBookings/CompletedDetailsBookingPage.jsx';
import CancelledDetailsBookingPage from '../../Screens/ServiceProvider/ServiceBookings/CancelledDetailsBookingPage.jsx';
import Profile from '../../Screens/ProfileScreen/Profile.jsx';

const Stack = createStackNavigator();

const BookingNavigationSP = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='bookings-page' component={ServiceProviderBookings}/>
      <Stack.Screen name='pending-detail-booking-page' component={DetailBookingPage}/>
      <Stack.Screen name='active-detail-booking-page' component={ActiveDetailsBookingPage}/>
      <Stack.Screen name='completed-detail-booking-page' component={CompletedDetailsBookingPage}/>
      <Stack.Screen name='cancelled-detail-booking-page' component={CancelledDetailsBookingPage}/>
      <Stack.Screen name='final-page' component={Profile}/>
    </Stack.Navigator>
  );
};

export default BookingNavigationSP;