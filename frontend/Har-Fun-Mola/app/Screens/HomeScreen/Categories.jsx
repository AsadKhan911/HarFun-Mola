import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {Image} from 'expo-image'
import { useEffect, useState } from 'react';
import {Heading} from '../../../components/Heading.jsx';
import Colors from '../../../constants/Colors.ts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CategoryBaseUrl } from '../../URL/userBaseUrl.js';

// Create a mapping of category names to image assets
const iconMap = {
  "Cleaning": require('../../../assets/images/mop.png'),
  "Handy": require('../../../assets/images/support.png'),
  "Painting": require('../../../assets/images/paintbrush.png'),
  "Delivery": require('../../../assets/images/cargo-truck.png'),
  // Add more categories as needed
};

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories from your API
    getCategories();
  }, []);

  // Function to fetch categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`${CategoryBaseUrl}/getcategory`);
      if (response.data.success) {
        setCategories(response.data.categories); // Set categories data from API
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Heading text="Major Categories" isViewAll={true} />
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={({ item }) =>
          item && (
            <TouchableOpacity
              style={styles.container}
              onPress={() =>
                navigation.push('business-list', {
                  categoryId: item._id, //Send category id
                   categoryName:item.name //Send category name
                })
              }
            >
              <View style={styles.iconContainer}>
                <Image
                  source={iconMap[item.name]} // Access the image based on category name
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <Text style={{ fontFamily: 'outfit-medium', margin: 5 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )
        }
        keyExtractor={(item) => item._id} // Ensure each item has a unique key, using _id from MongoDB
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 17,
    borderRadius: 99,
  },
});