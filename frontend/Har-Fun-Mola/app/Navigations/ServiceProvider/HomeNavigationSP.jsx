//This navigation section is for when we click on category on home , it redirects to new screen.
import Home from '../../Screens/ServiceProvider/HomeScreen/HomeScreenSP.jsx'
import { createStackNavigator } from '@react-navigation/stack';
import MajorCategory from '../../Screens/ServiceProvider/MajorCategory/MajorCategory.jsx'
import PostMajorListings from '../../Screens/ServiceProvider/MajorListings/PostMajorListings.jsx'
import CompletedDetailsBookingPage from '../../Screens/ServiceProvider/ServiceBookings/CompletedDetailsBookingPage.jsx'
import MinorCategory from '../../Screens/ServiceProvider/MinorCategory_Issues/MinorCategory.jsx';
import {MinorServices} from '../../Screens/ServiceProvider/MinorCategory_Issues/MinorServices.jsx';
import PredefinedIssues from '../../Screens/ServiceProvider/MinorCategory_Issues/PredefinedIssues.jsx';
import PricingPredefinedIssues from '../../Screens/ServiceProvider/MinorCategory_Issues/PricingPredefinedIssues.jsx';
import submitMinorListing from '../../Screens/ServiceProvider/MinorCategory_Issues/submitMinorListing.jsx';
import Reviews from '../../Screens/ServiceProvider/HomeScreen/Reviews.jsx';
import Payments from '../../Screens/ServiceProvider/HomeScreen/Payments.jsx';
import ManageCards from '../../Screens/ServiceProvider/HomeScreen/ManageCards.jsx';

const Stack = createStackNavigator();

const HomeNavigationSP = () => {
  return (
    <Stack.Navigator 
    screenOptions={{
        headerShown:false
    }}>
       <Stack.Screen name='home-screen' component={Home}/>
       <Stack.Screen name='major-category' component={MajorCategory}/> 
       <Stack.Screen name='post-major-listings' component={PostMajorListings}/>  
       <Stack.Screen name='completed-booking' component={CompletedDetailsBookingPage}/>  
       <Stack.Screen name='reviews' component={Reviews}/>  
       <Stack.Screen name='payments' component={Payments}/>  
       <Stack.Screen name='manage-cards' component={ManageCards}/>  

       {/* Minor Listings Module Route */}
       <Stack.Screen name='minor-category' component={MinorCategory}/>  
       <Stack.Screen name='minor-services' component={MinorServices}/> 
       <Stack.Screen name="predefined-issues" component={PredefinedIssues} />
       <Stack.Screen name="predefined-issues-pricing" component={PricingPredefinedIssues} />
       <Stack.Screen name="submit-minor-listing" component={submitMinorListing} />
       <Stack.Screen name="see-jobs" component={submitMinorListing} />
 
    </Stack.Navigator>
  )
}

export default HomeNavigationSP