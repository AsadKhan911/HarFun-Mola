import { View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading } from '../../../components/Heading.jsx';
import { BusinessListItemSmall } from '../HomeScreen/BusinessListItemSmall.jsx';

export const BusinessList = () => {
  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    // Set hardcoded business data
    getBusinessList();
  }, []);

  // Hardcoded business data
  const getBusinessList = () => {
    const mockData = [
      {
        id: '1',
        name: 'No More Pests',
        contactPerson: 'Zain Waheed',
        images: require('../../../assets/images/pestcontrol.jpg'), // Use require()
        category: 'Home Cleaning',
      },
      {
        id: '2',
        name: 'Alpha Cleaning Services',
        contactPerson: 'Iqra Altaaf',
        images: require('../../../assets/images/housecleaning.jpg'), // Use require()
        category: 'Cleaning',
      },
      
      {
        id: '3',
        name: 'Handy Pro Services',
        contactPerson: 'Abdullah Jan',
        images: require('../../../assets/images/handy.webp'), // Use require()
        category: 'Handy',
      },
      {
        id: '4',
        name: 'Car Washer',
        contactPerson: 'Zain Waheed',
        images: require('../../../assets/images/carwasher.jpg'), // Use require()
        category: 'Automobile Care',
      },
    ];
    setBusinessList(mockData);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Heading text="Latest Business" isViewAll={true} />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={businessList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginRight: 0 }}>
            <BusinessListItemSmall business={item} />
          </View>
        )}
      />
    </View>
  );
};
