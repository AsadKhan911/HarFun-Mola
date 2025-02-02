//This navigation section is for when we click on category on home , it redirects to new screen.
import Home from '../../Screens/ServiceProvider/HomeScreen/HomeScreenSP.jsx'
import { createStackNavigator } from '@react-navigation/stack';
import MajorCategory from '../../Screens/ServiceProvider/MajorCategory/MajorCategory.jsx'
import PostMajorListings from '../../Screens/ServiceProvider/MajorListings/PostMajorListings.jsx'

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
    </Stack.Navigator>
  )
}

export default HomeNavigationSP