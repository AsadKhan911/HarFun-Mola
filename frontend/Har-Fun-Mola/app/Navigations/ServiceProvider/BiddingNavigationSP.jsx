import { createStackNavigator } from '@react-navigation/stack';
import BiddingHome from '../../Screens/ServiceProvider/BiddingModule/BiddingHome.jsx'
import JobDetails from '../../Screens/ServiceProvider/BiddingModule/JobDetails.jsx';
import detailedProposal from '../../Screens/ServiceProvider/BiddingModule/detailedProposal.jsx';
import detailedAgreedProposal from '../../Screens/ServiceProvider/BiddingModule/detailedAgreedProposal.jsx';
import StartJob from '../../Screens/ServiceProvider/BiddingModule/StartJob.jsx';

const Stack = createStackNavigator();

const BiddingNavigationSP = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='job-home' component={BiddingHome}/>
      <Stack.Screen name='job-details' component={JobDetails}/>
      <Stack.Screen name='detailed-proposal' component={detailedProposal}/>
      <Stack.Screen name='detailed-agreed-proposal' component={detailedAgreedProposal}/>
      <Stack.Screen name='start-job' component={StartJob}/>
    </Stack.Navigator>
  );
};

export default BiddingNavigationSP;