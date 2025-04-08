import { createStackNavigator } from '@react-navigation/stack';
import BiddingHome from '../../Screens/ServiceProvider/BiddingModule/BiddingHome.jsx'
import JobDetails from '../../Screens/ServiceProvider/BiddingModule/JobDetails.jsx';

const Stack = createStackNavigator();

const BiddingNavigationSP = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='job-home' component={BiddingHome}/>
      <Stack.Screen name='job-details' component={JobDetails}/>
    </Stack.Navigator>
  );
};

export default BiddingNavigationSP;