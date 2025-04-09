import { createStackNavigator } from '@react-navigation/stack';
import  ServiceUserHome  from '../../Screens/BiddingModuleScreens/ServiceUserHome';
import  EditJob  from '../../Screens/BiddingModuleScreens/EditJob';
import ViewBids from '../../Screens/BiddingModuleScreens/ViewBids';

const Stack = createStackNavigator();

const JobNavigation = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='job-home' component={ServiceUserHome}/>
      <Stack.Screen name='edit-job' component={EditJob}/>
    </Stack.Navigator>
  );
};

export default JobNavigation;