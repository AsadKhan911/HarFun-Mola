import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 
import Colors from '../../../../constants/Colors.ts';

const Items = () => {
  const navigation = useNavigation();

  // Menu items with navigation targets
  const menuItems = [
    { id: 1, title: 'Major Listings', icon: 'send', screen: 'major-category' },
    { id: 2, title: 'Minor Listings', icon: 'file-text-o', screen: 'minor-category' },
    { id: 3, title: 'View Jobs', icon: 'university', screen: 'JobsScreen' },
    { id: 4, title: 'Reviews', icon: 'id-card-o', screen: 'ReviewsScreen' },
    { id: 5, title: 'Payment', icon: 'university', screen: 'PaymentScreen' },
    { id: 6, title: 'Orders', icon: 'users', screen: 'OrdersScreen' },
    { id: 7, title: 'Manage Cards', icon: 'credit-card', screen: 'ManageCardsScreen' },
    { id: 8, title: 'More', icon: 'ellipsis-h', screen: 'MoreOptionsScreen' },
  ];

  return (
    <View style={styles.container}>
      {/* Render menu items */}
      <View style={styles.gridContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => navigation.push(item.screen)} // Navigate to the respective screen
          >
            <View style={styles.iconContainer}>
              <FontAwesome name={item.icon} size={35} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '22%', // Adjust for 4 items per row
    alignItems: 'center',
    marginBottom: 30, // Add extra margin for spacing between text and items
  },
  iconContainer: {
    backgroundColor: Colors.WHITE, // Placeholder background color
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 8, // Space between the box and text
  },
});


export default Items;
