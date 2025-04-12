import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleSaveJob } from "../../../redux/biddingSlice";
import Colors from "../../../../constants/Colors";

const SavedJobs = () => {
  const dispatch = useDispatch();

  // Get saved jobs object from Redux
  const savedJobsObject = useSelector((state) => state.bidding.savedJobs || {});
  
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
          <TouchableOpacity onPress={() => dispatch(toggleSaveJob(item))}>
            <Ionicons name="bookmark" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.postedBy}>
          Posted by: {item.customerId?.fullName || "Unknown"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {savedJobsObject.length === 0 ? (
        <Text style={styles.emptyText}>No saved jobs yet.</Text>
      ) : (
        <FlatList
          data={savedJobsObject}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Colors.BLACK,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  postedBy: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 50,
  },
});

export default SavedJobs;
