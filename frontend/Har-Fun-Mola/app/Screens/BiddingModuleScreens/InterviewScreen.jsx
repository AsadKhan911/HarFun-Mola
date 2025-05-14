import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { BiddingModelBaseUrl, PaymentBaseUrl } from "../../URL/userBaseUrl";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useSelector } from "react-redux";

const InterviewDetailsScreen = () => {
  const { offer } = useRoute().params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const userId = useSelector((state)=>state.auth.user._id)
  const senderName = offer?.serviceProviderId?.fullName
  const otherUserProfilePic = offer?.serviceProviderId?.profile?.profilePic
 console.log(otherUserProfilePic)

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleMessage = () => {
    if (!userId) {
      alert("Missing provider or user ID.");
      return;
    }
  
    navigation.navigate("message-provider", {
      otherUserIdis: userId,
      senderName: senderName,
      otherUserProfilePic: otherUserProfilePic
      
    });
  };

  const createPaymentIntent = async () => {
    const amountInPaisa = offer.proposedPrice * 100;

    try {
      const response = await axios.post(
        `${PaymentBaseUrl}/create-payment-intent`,
        {
          amount: amountInPaisa,
          currency: "pkr",
          userId: userId,
        }
      );

      if (response.status === 200) {
        setPaymentIntentId(response.data.paymentIntentId);

        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.clientSecret,
          returnURL: "myapp://stripe-redirect",
        });

        if (error) {
          console.error("Error initializing payment sheet:", error.message);
          Alert.alert("Payment Error", error.message);
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
      }
      return false;
    }
  };

  const handlePayment = async () => {
    const paymentInitialized = await createPaymentIntent();
    if (!paymentInitialized) return false;

    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert("Payment Failed", error.message);
      return false;
    }
    return true;
  };

  // const handleHireNow = async () => {
  //   Alert.alert(
  //     "Confirm Hire",
  //     "Do you want to officially hire this provider for the service?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Hire",
  //         onPress: async () => {
  //           setLoading(true);
  
  //           try {
  //             // Step 1: Handle payment
  //             const paymentSuccess = await handlePayment();
  //             if (!paymentSuccess) {
  //               setLoading(false);
  //               return;
  //             }
  
  //             // Step 2: Create the contract
  //             const response = await axios.post(`${BiddingModelBaseUrl}/hire-provider`, 
  //               {
  //                 offerId: offer._id,
  //                 agreedPrice: offer.proposedPrice,
  //                 contractTerms: "Standard contract terms",
  //                 paymentMethod: "CARD",
  //                 paymentIntentId: paymentIntentId,
  //                 paymentStatus: "Pending",
  //               }
  //             );
  
  //             // Step 3: Update contract status to "Agreed"
  //             await axios.put(`${BiddingModelBaseUrl}/update-contract-status/${offer.bidId._id}`, {
  //               status: "Agreed",
  //             });
  
  //             setLoading(false);
  //             Alert.alert("Success", "Provider hired successfully!", [
  //               { text: "OK", onPress: () => navigation.goBack() },
  //             ]);
  //           } catch (error) {
  //             setLoading(false);
  //             console.error("Error hiring provider:", error);
  //             Alert.alert("Error", "Failed to hire provider. Please try again.");
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleHireNow = async () => {
    Alert.alert(
      "Confirm Hire",
      "Do you want to officially hire this provider for the service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Hire",
          onPress: async () => {
            setLoading(true);
            try {
              console.log("Starting payment process...");
              
              // 1. Payment
              const paymentSuccess = await handlePayment();
              if (!paymentSuccess) {
                console.log("Payment failed or was cancelled");
                setLoading(false);
                return;
              }
              console.log("Payment successful, proceeding to hire...");
  
              // 2. Hire Provider
              const hireResponse = await axios.post(
                `${BiddingModelBaseUrl}/hire-provider`, 
                {
                  offerId: offer._id,
                  agreedPrice: offer.proposedPrice,
                  contractTerms: "Standard contract terms",
                  paymentMethod: "CARD",
                  paymentIntentId: paymentIntentId,
                  paymentStatus: "Pending",
                }
              );
  
              // 3. Update Contract Status
             
              const statusResponse = await axios.put(
                `${BiddingModelBaseUrl}/update-contract-status/${offer.bidId._id}`, 
                { status: "Agreed" }
              );
              
  
              setLoading(false);
              Alert.alert("Success", "Provider hired successfully!");
              navigation.goBack();
              
            } catch (error) {
              setLoading(false);
        
              Alert.alert(
                "Error Details", 
                `Failed to hire provider: ${error.response?.data?.message || error.message}`
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No offer details available.</Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey="pk_test_51QugNP4ar1n4jNltsbhPR9kEV43YDjI4RDrhltYb5YgjHo3WQGevNAPuKPeY8yoNqNgrEir6JfQLsIrPxs12gmAX00hDxdInIS">
      <View style={styles.container}>
        <Text style={styles.heading}>Interviewing</Text>
        <Text style={styles.subText}>Here are the provider and job details:</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Provider Name:</Text>
          <Text style={styles.value}>{offer.serviceProviderId.fullName}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{offer.serviceProviderId.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{offer.serviceProviderId.phoneNumber}</Text>

          <Text style={styles.label}>Offered Price:</Text>
          <Text style={styles.value}>${offer.proposedPrice}</Text>

          <Text style={styles.label}>Job Description:</Text>
          <Text style={styles.value}>{offer.bidId.description}</Text>

          <Text style={styles.label}>Contract Status:</Text>
          <Text style={styles.status}>{offer.status}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.hireButton} 
            onPress={handleHireNow}
            disabled={loading}
          >
            <Ionicons name="briefcase-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : "Hire Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </StripeProvider>
  );
};

export default InterviewDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '50%',
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
    marginTop: 18,
  },
  value: {
    fontSize: 15,
    color: "#222",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
  },
  hireButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});