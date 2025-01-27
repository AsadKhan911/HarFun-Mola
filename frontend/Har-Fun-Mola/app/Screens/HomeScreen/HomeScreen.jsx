import { View, Text, Image, StyleSheet } from 'react-native';
import {Header} from '../HomeScreen/Header.jsx';
import {Slider} from '../HomeScreen/Slider.jsx';
import {Categories} from '../HomeScreen/Categories.jsx';
import {BusinessList} from '../HomeScreen/BusinessList.jsx';
import { ScrollView } from 'react-native-gesture-handler';

const Home = () => {
  return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* Header */}
        <Header />

        {/* Slider */}
        <View style={{ padding: 20 }}>
          <Slider />

          {/* Categories */}
          <Categories />

          {/* Business List */}
          <BusinessList />

        </View>
      </ScrollView>
  );
};

export default Home;





