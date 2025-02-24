import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { useSelector } from "react-redux";

const StripeLinkScreen = () => {

    const StripeLink = useSelector((store)=>store.auth.user.onboardingLink)
  
  

  const handleOnboarding = () => {
    Linking.openURL(StripeLink);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Welcome to Stripe Onboarding</Text>
        <Text style={styles.description}>
          Set up your payment account with Stripe in a few easy steps to continue with HarFunMola.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleOnboarding}>
          <Text style={styles.buttonText}>Start Onboarding</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#635BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:'center'
  },
});

export default StripeLinkScreen;




