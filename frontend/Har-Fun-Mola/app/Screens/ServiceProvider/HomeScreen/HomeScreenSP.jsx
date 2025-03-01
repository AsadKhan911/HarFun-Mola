import { View } from 'react-native';
import Header from '../../ServiceProvider/HomeScreen/Header.jsx';
import { Slider } from '../../ServiceProvider/HomeScreen/Slider.jsx';
import Items from '../../ServiceProvider/HomeScreen/Items.jsx'
// import {Categories} from '../HomeScreen/Categories.jsx';
// import {BusinessList} from '../HomeScreen/BusinessList.jsx';
import { ScrollView } from 'react-native-gesture-handler';

const Home = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white'  }}>

      {/* Header */}
      <Header />

      {/* Grid Items */}
      <Items />

      {/* Slider */}
      <View style={{ padding: 20 , marginTop: 0 }}>
        <Slider />

        {/* Business List */}
        {/* <BusinessList /> */}

      </View>
    </ScrollView>
  );
};

export default Home;





