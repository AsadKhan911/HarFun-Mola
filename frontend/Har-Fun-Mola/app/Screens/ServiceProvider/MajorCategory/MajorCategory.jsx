import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {Image} from 'expo-image'
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CategoryBaseUrl } from '../../../URL/userBaseUrl.js';
import { Card } from 'react-native-paper';
import Colors from '../../../../constants/Colors.ts';

// Icon Mapping for Categories
const iconMap = {
  "Cleaning": require('../../../../assets/images/mop.png'),
  "Handy": require('../../../../assets/images/support.png'),
  "Painting": require('../../../../assets/images/paintbrush.png'),
  "Delivery": require('../../../../assets/images/cargo-truck.png'),
  "Gardening": require('../../../../assets/images/gardening.png'),
  "Moving": require('../../../../assets/images/moving.png'),
  "Pool": require('../../../../assets/images/pool.png'),
  "Roofing" :require('../../../../assets/images/roof.png'),
  "PetCare" :require('../../../../assets/images/pet.png'),
  "Fitness" :require('../../../../assets/images/fitness.png'),
  "Photography" :require('../../../../assets/images/photography.png'),
  "Tutoring" :require('../../../../assets/images/tutoring.png'),
  // Add more categories as needed
};

export const ProviderCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${CategoryBaseUrl}/getcategory`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Category</Text>
      <FlatList
        data={categories}
        numColumns={2} // Grid Layout
        renderItem={({ item }) =>
          item && (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() =>
                navigation.push('post-major-listings', {
                  categoryId: item._id,
                  categoryName: item.name
                })
              }
            >
              <Card style={styles.card}>
                <View style={styles.iconContainer}>
                  <Image source={iconMap[item.name]} style={styles.icon} />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </Card>
            </TouchableOpacity>
          )
        }
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE, // White background
    padding: 20,
    paddingTop: 50
  },
  heading: {
    fontSize: 24,
    fontFamily: 'outfit-Medium',
    textAlign: 'center',
    marginBottom: 25,
    color: Colors.BLACK,
  },
  cardContainer: {
    flex: 1,
    margin: 12,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    elevation: 5, // Better shadow effect
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 18,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'outfit',
    color: Colors.DARK_GRAY,
  },
});

export default ProviderCategories;
