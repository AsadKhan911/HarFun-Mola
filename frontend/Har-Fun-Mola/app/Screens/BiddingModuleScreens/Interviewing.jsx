import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  Image,
  RefreshControl
} from "react-native";
import Colors from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BiddingModelBaseUrl } from "../../URL/userBaseUrl";
import { useSelector } from "react-redux";

const Interviewing = () => {
  const userId = useSelector((store) => store.auth.user._id);
  const navigation = useNavigation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInterviewingOffers = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${BiddingModelBaseUrl}/get-interviewing-offers/${userId}`);
      const offers = response.data.offers;
      setOffers(offers || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      Alert.alert("Error", "Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInterviewingOffers();
  }, [userId]);

  const handlePress = (offer) => {
    navigation.navigate("interview-screen", { offer });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'Agreed': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Interviewing': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading your interviews...</Text>
      </View>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Interviews Scheduled</Text>
        <Text style={styles.emptyText}>When you have interviews with service providers, they'll appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchInterviewingOffers}
          colors={[Colors.PRIMARY]}
        />
      }
    >
      <Text style={styles.header}>Your Interviews</Text>
      
      {offers.map((offer) => (
        <TouchableOpacity
          key={offer._id}
          style={styles.card}
          onPress={() => handlePress(offer)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {offer.serviceProviderId?.fullName?.charAt(0) || 'P'}
              </Text>
            </View>
            <View style={styles.offerInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {offer.bidId?.serviceType || "Service"}
              </Text>
              <Text style={styles.providerName} numberOfLines={1}>
                {offer.serviceProviderId?.fullName || "Service Provider"}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(offer.status) }]}>
              <Text style={styles.statusText}>{offer.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Offer Price:</Text>
              <Text style={styles.detailValue}>Rs {offer.proposedPrice || "N/A"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Your Budget:</Text>
              <Text style={styles.detailValue}>Rs {offer.bidId?.budget || "N/A"}</Text>
            </View>
          </View>

          <Text style={styles.viewDetailsText}>Tap to view details →</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  offerInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    textAlign: 'right',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default Interviewing;