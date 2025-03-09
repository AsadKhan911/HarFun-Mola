import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const MinorIssuesList = () => {
  const route = useRoute();
  const { predefinedIssues, serviceName } = route.params; // ✅ Correct way to extract params
  const navigation = useNavigation();

  // Calculate item width for grid layout
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 40) / 2; // 40 = paddingHorizontal (20 + 20)

  return (
    <View style={styles.container}>
      {/* Back Button and Category Name */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
        <Text style={styles.categoryName}>{serviceName}</Text>
      </TouchableOpacity>

      {/* Grid View for Issues */}
      <FlatList
        key={2} // Forces re-render when numColumns changes
        data={predefinedIssues}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Display 2 items per row
        renderItem={({ item }) => (
          <View style={[styles.issueContainer, { width: itemWidth }]}>
            <Image source={item?.icon} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.issueText}>{item.issueName}</Text>
              <Text style={styles.issueDescription}>{item.description}</Text>
            </View>
          </View>
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
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    marginTop:20,
    marginBottom: 25,
  },
  categoryName: {
    fontSize: 25,
    fontFamily: 'outfit-medium',
  },
  issueContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 10,
    margin: 5, // Add margin for spacing between items
    alignItems: 'center', // Center content horizontally
    shadowColor: '#000', // Add shadow for a card-like effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  image: {
    width: '100%', // Take full width of the container
    height: 100, // Fixed height for the image
    borderRadius: 10,
    marginBottom: 10, // Space between image and text
   resizeMode:'contain'
  },
  textContainer: {
    width: '100%', // Take full width of the container
    alignItems: 'center', // Center text horizontally
  },
  issueText: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginBottom: 5,
    textAlign: 'center', // Center text
  },
  issueDescription: {
    fontSize: 13,
    fontFamily: 'outfit-medium',
    color: Colors.GRAY,
    textAlign: 'center', // Center text
  },
  listContainer: {
    paddingBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: '70%',
  },
});

// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { useRoute } from '@react-navigation/native';
// import { Image } from 'expo-image';
// import Colors from '../../../constants/Colors';
// import { useSelector } from 'react-redux';
// import { TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from 'expo-router';
// import { FlatList } from 'react-native-gesture-handler';

// const MinorIssuesList = () => {
//   const route = useRoute();
//   const { predefinedIssues, serviceName } = route.params; // ✅ Correct way to extract params

//   const navigation = useNavigation()

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Ionicons name="arrow-back-outline" size={30} color="black" />
//         <Text style={styles.categoryName}>{serviceName}</Text>
//       </TouchableOpacity>
//       <FlatList
//         data={predefinedIssues}
//         keyExtractor={(item, index) => index.toString()} // Ensure unique keys
//         renderItem={({ item }) => (
//           <View style={styles.issueContainer}>
//             <Image source={item?.icon} style={styles.image} />
//             <View style={styles.textContainer}>
//               <Text style={styles.issueText}>{item.issueName}</Text>
//               <Text style={styles.issueDescription}>{item.description}</Text>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={<Text style={styles.noDataText}>No Issues Available!</Text>} // Handles empty list
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false} // Hide scroll indicator
//       />
//     </View>
//   );
// };

// export default MinorIssuesList;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.LIGHT_GRAY,
//     flex: 1,
//     padding: 20
//   },
//   backButton: {
//     display: 'flex',
//     flexDirection: 'row',
//     gap: 10,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//     paddingVertical: 40,
//     marginBottom: -10
//   },
//   categoryName: {
//     fontSize: 25,
//     fontFamily: 'outfit-medium',
//   },
//   issueContainer: {
//     backgroundColor: Colors.WHITE,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   textContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   issueText: {
//     fontSize: 17,
//     fontFamily: 'outfit',
//     marginBottom: 5,
//   },
//   issueDescription: {
//     fontSize: 13,
//     color: 'gray',
//   },
//   noDataText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: Colors.GRAY,
//     textAlign: "center",
//     marginTop: '70%',
//   },
// });