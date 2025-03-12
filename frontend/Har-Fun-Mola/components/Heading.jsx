import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Heading = ({ text, isViewAll = false, onViewAllPress, viewAllText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{text}</Text>
      {isViewAll && (
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={{ marginBottom: 20 }}>{viewAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginBottom: 20,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});