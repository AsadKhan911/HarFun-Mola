import Booking from "../../Screens/BookingScreen/Booking";
import { createStackNavigator } from '@react-navigation/stack';
import userPendingOrderDetailed from '../../Screens/BookingScreen/PendingOrderDetailed.jsx'
import userConfirmedOrderDetailed from '../../Screens/BookingScreen/ConfirmedOrderDetailed.jsx'
import userInProgressOrderDetailed from '../../Screens/BookingScreen/InProgressOrderDetailed.jsx'
import userCompletedOrderDetailed from '../../Screens/BookingScreen/CompletedOrderDetailed.jsx'
import userCancelledOrderDetailed from '../../Screens/BookingScreen/CancelledOrderDetailed.jsx'

const Stack = createStackNavigator();

const BookingNavigation = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='bookings-page' component={Booking}/>
      <Stack.Screen name='user-order-pending-screen' component={userPendingOrderDetailed}/>
      <Stack.Screen name='user-order-confirmed-screen' component={userConfirmedOrderDetailed}/>
      <Stack.Screen name='user-order-inprogress-screen' component={userInProgressOrderDetailed}/>
      <Stack.Screen name='user-order-completed-screen' component={userCompletedOrderDetailed}/>
      <Stack.Screen name='user-order-cancelled-screen' component={userCancelledOrderDetailed}/>
    </Stack.Navigator>
  );
};

export default BookingNavigation;