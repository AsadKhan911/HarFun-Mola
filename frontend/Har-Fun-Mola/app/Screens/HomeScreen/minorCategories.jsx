import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {Image} from 'expo-image'
import { useEffect, useState } from 'react';
import {Heading} from '../../../components/Heading.jsx';
import Colors from '../../../constants/Colors.ts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MinorCategoryBaseUrl } from '../../URL/userBaseUrl.js';

// Create a mapping of category names to image assets
const iconMap = {
  "Electricity": require('../../../assets/images/electronics.png'),
  "Plumbing": require('../../../assets/images/plumber.png'),
  "HVAC": require('../../../assets/images/hvac.png'),
  "Automobile": require('../../../assets/images/automobile.png'),
  // Add more categories as needed
};

export const MinorCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories from your API
    getCategories();
  }, []);

  // Function to fetch categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`${MinorCategoryBaseUrl}/getcategory`);
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
    <View style={{ marginTop: 15 }}>
      <Heading text="Minor Categories" isViewAll={true} />
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={({ item }) =>
          item && (
            <TouchableOpacity
              style={styles.container}
              onPress={() =>
                navigation.push('minor-business-list', {
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
    marginTop:5
  },
});