import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading } from '../../../components/Heading.jsx';
import { useSelector } from 'react-redux';
import { BusinessListItemSmall } from '../HomeScreen/BusinessListItemSmall.jsx';
import Colors from '../../../constants/Colors.ts';
import { IntelliServeBaseUrl } from '../../URL/userBaseUrl.js';

export const BusinessList = () => {
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId  = useSelector(store => store.auth.user._id);

  useEffect(() => {
    fetchBusinessList();
  }, []);

  const fetchBusinessList = async () => {
    try {
      const response = await fetch(`${IntelliServeBaseUrl}/recommendations/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setBusinessList(data.recommendedServices || []);
      } else {
        console.error('Failed to fetch recommended services:', data.message);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 20 }} />;
  }

  if (!businessList.length) {
    return (
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Heading text="Recommended Businesses" />
        <Text style={{ marginTop: 10, color: Colors.GRAY, fontFamily: 'outfit' }}>
          No recommendations available.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      <Heading text="Recommended Services" isViewAll={true} />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={businessList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginRight: 10 }}>
            <BusinessListItemSmall business={item} />
          </View>
        )}
      />
    </View>
  );
};
