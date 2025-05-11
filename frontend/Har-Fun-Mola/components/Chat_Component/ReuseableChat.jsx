import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ChatBox from './Chat';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const MessageProviderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { otherUserIdis, senderName, otherUserProfilePic } = route.params;

  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?._id;
  const otherUserId = otherUserIdis;

  if (!currentUserId || !otherUserIdis) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Invalid chat setup</Text>
        <Text style={styles.errorSubText}>Missing user information</Text>
      </SafeAreaView>
    );
  }

  const chatId = [currentUserId, otherUserId].sort().join('_');

  return (
    <SafeAreaView style={styles.container}>
      <ChatBox
        currentUserId={currentUserId}
        otherUserId={otherUserIdis}
        chatId={chatId}
        userName={senderName}
        otherUserProfilePic={otherUserProfilePic}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default MessageProviderScreen;