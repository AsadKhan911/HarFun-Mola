import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';  
import { FlatList } from 'react-native-gesture-handler';
import BusinessListItem from '../BusinessListByCategory/BusinessListItem.jsx';
import Colors from '@/constants/Colors';
import { MajorListingsBaseUrl } from '../../URL/userBaseUrl.js';

const BusinessListByCategoryScreen = () => {
  const navigation = useNavigation();
  const param = useRoute().params;
  const [businessList, setBusinessList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Fetch business list by category name
  const getBusinessByCategory = async () => {
    try {
      const response = await axios.get(`${MajorListingsBaseUrl}/getlisting/${param.categoryId}`);
      setBusinessList(response.data.listings);  // Assuming the response contains a 'listings' key
      setIsLoading(false); // Set loading to false once data is received
    } catch (error) {
      console.error("Error fetching business list by category:", error);
      setIsLoading(false); // Set loading to false even in case of error
    }
  };

  useEffect(() => {
    if (param?.categoryName) {
      getBusinessByCategory();
    }
  }, [param]);

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
        <Text style={styles.categoryName}>{param.categoryName}</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.spinner} />
      ) : businessList.length > 0 ? (
        <FlatList
          data={businessList}
          style={styles.flatList}
          renderItem={({ item }) => <BusinessListItem business={item} />}
        />
      ) : (
        <Text style={styles.NAtext}>No Service Available Right Now!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1, // Ensures the view takes up the full screen
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.LIGHT_GRAY, // Make sure this is the desired color
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 25,
    fontFamily: 'outfit-medium',
  },
  flatList: {
    marginTop: 15,
  },
  NAtext: {
    fontFamily: 'outfit-medium',
    color: Colors.GRAY,
    fontSize: 20,
    textAlign: 'center',
    margin:'auto'
  },
  spinner: {
    flex: 1, // Ensures the spinner is centered
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BusinessListByCategoryScreen;