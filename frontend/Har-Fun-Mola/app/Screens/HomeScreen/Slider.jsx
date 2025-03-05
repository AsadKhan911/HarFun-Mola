import { View, StyleSheet, FlatList } from 'react-native';
import {Image} from 'expo-image'
import {Heading} from '../../../components/Heading.jsx';

export const Slider = () => {
  // Hardcoded slider data
  const sliderData = [
    {
      id: '1',
      image: require('../../../assets/images/Slider1.png'),
    },
    {
      id: '2',
      image: require('../../../assets/images/Slider2.png'),
    }
  ];

  return (
    <View>
      <Heading text="Offer For You" />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={sliderData}
        renderItem={({ item, index }) => {
          // Ensure you return JSX from the renderItem function
          return (
            <View style={{ marginRight: 20 }}>
              <Image
                source={item?.image} 
                style={styles.sliderImage} 
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id} // Ensure each item has a unique key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading:{
      fontSize:20,
      fontFamily:'outfit-medium',
      marginBottom:20,
  },
  sliderImage:{
      width:250,
      height:150,
      borderRadius:20,
      resizeMode:'stretch'
  }
})
