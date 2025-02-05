import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";

// Badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#FFA500"; // Orange (Pending)
    case "Confirmed":
      return "#4CAF50"; // Green (Confirmed)
    case "in-progress":
      return "#4A90E2"; // Green (Ongoing)
    case "Completed":
      return "#2196F3"; // Blue (Completed)
    case "Cancelled":
      return "#D32F2F"; // Red (Cancelled)
    default:
      return "#757575"; // Grey (Unknown)
  }
};

const BookingListItem = ({ booking }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: booking?.service?.created_by?.profile?.profilePic }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{booking?.service?.serviceName}</Text>
        <Text style={styles.providerName}>{booking?.service?.created_by?.fullName}</Text>

        <Text style={styles.detail}>
          <FontAwesome6 name="location-dot" size={16} color={Colors.PRIMARY} /> {booking?.address}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking?.status) }]}>
          <Text style={styles.statusText}>{booking?.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: "outfit-Bold",
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.DARK_GRAY,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "outfit-Medium",
    color: Colors.WHITE,
  },
});

export default BookingListItem;
