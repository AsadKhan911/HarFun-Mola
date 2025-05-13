import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import Colors from '../../../constants/Colors';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';

const MinorIssuesList = () => {
  const route = useRoute();
  const { predefinedIssues, serviceName, serviceId, categoryId } = route.params;

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
        <Text style={styles.categoryName}>{serviceName}</Text>
      </TouchableOpacity>
      <FlatList
        data={predefinedIssues}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.issueContainer}
            onPress={() =>
              navigation.push('minor-listings-screen', {
                issueId: item._id,       // Pass issueId
                issueName: item.issueName, // Pass issueName
                serviceId: serviceId,    // Pass serviceId from previous screen
                categoryId: categoryId   // Pass categoryId from previous screen
              })
            }
          >
            <Image source={item?.icon} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.issueText}>{item.issueName}</Text>
              <Text style={styles.issueDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>No Issues Available!</Text>}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MinorIssuesList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY,
    flex: 1,
    padding: 20
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: -10
  },
  categoryName: {
    fontSize: 25,
    fontFamily: 'outfit-medium',
  },
  issueContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  issueText: {
    fontSize: 17,
    fontFamily: 'outfit',
    marginBottom: 5,
  },
  issueDescription: {
    fontSize: 13,
    color: 'gray',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: '70%',
  },
});