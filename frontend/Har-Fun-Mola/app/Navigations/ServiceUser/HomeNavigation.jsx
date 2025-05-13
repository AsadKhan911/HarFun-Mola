//This navigation section is for when we click on category on home , it redirects to new screen.
import Home from '../../Screens/HomeScreen/HomeScreen.jsx'
import { createStackNavigator } from '@react-navigation/stack';
import BusinessListByCategoryScreen from '../../Screens/BusinessListByCategory/BusinessListByCategory.jsx';
import BusinessDetailsScreen from '../../Screens/BusinessDetailsScreen/BusinessDetailsScreen.jsx'
import ViewServiceProviderProfile from '../../Screens/ProfileScreen/ViewServiceProviderProfile.jsx';
import MinorBusinessList from '../../Screens/MinorListings/minorBusinessList.jsx';
import MinorIssuesList from '../../Screens/MinorListings/MinorIssuesList.jsx'
import ListingScreenMinor from '../../Screens/MinorListings/ListingScreenMinor.jsx';
import MinorDetailedListingScreen from '../../Screens/MinorListings/MinorDetailedListingScreen.jsx';

const Stack = createStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator 
    screenOptions={{
        headerShown:false
    }}>
        <Stack.Screen name='home-screen' component={Home}/>
        <Stack.Screen name='business-list' component={BusinessListByCategoryScreen}/>
        <Stack.Screen name='business-details' component={BusinessDetailsScreen}/> 
        <Stack.Screen name='view-provider-profile' component={ViewServiceProviderProfile}/> 

        {/* Minor Listings */}
        <Stack.Screen name='minor-business-list' component={MinorBusinessList}/> 
        <Stack.Screen name='minor-issues-list' component={MinorIssuesList}/> 
        <Stack.Screen name='minor-listings-screen' component={ListingScreenMinor}/> 
        <Stack.Screen name='minor-detailed-listing-screen' component={MinorDetailedListingScreen}/> 
    </Stack.Navigator>
  )
}

export default HomeNavigation