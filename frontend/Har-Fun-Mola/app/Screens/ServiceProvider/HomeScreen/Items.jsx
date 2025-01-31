import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../../../../constants/Colors.ts';

const Items = () => {
  // Menu items
  const menuItems = [
    { id: 1, title: 'Transfer Funds', icon: 'send' },
    { id: 2, title: 'Pay Bills', icon: 'file-text-o' },
    { id: 3, title: 'Mobile Load', icon: 'university' },
    { id: 4, title: 'Manage Raast ID', icon: 'id-card-o' },
    { id: 5, title: 'Roshan Account', icon: 'university' },
    { id: 6, title: 'Manage Beneficiaries', icon: 'users' },
    { id: 7, title: 'Manage Cards', icon: 'credit-card' },
    { id: 8, title: 'More', icon: 'ellipsis-h' },
  ];

  return (
    <View style={styles.container}>
      {/* Render menu items */}
      <View style={styles.gridContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name={item.icon} size={35} color={Colors.WHITE} />
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
    marginTop:30,
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
    backgroundColor: Colors.BLACK, // Placeholder background color
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
