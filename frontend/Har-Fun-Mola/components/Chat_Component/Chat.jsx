import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import { db } from '../../src/firebase/firebaseConfig.js';
import Colors from '../../constants/Colors.ts';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Image } from 'expo-image';

const ChatBox = ({ currentUserId, otherUserId, chatId, userName, onBack, otherUserProfilePic }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  const chatPath = `messages/${chatId}`;

  useEffect(() => {
    const messagesRef = ref(db, chatPath);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formatted = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      }));
      setMessages(formatted);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const messageRef = ref(db, chatPath);
    push(messageRef, {
      senderId: currentUserId,
      receiverId: otherUserId,
      message,
      timestamp: Date.now()
    });
    setMessage('');
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
      ]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>
            {userName}
          </Text>
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sent : styles.received,
        ]}>
          <Text style={isCurrentUser ? styles.sentText : styles.receivedText}>
            {item.message}
          </Text>
          <Text style={[
            styles.timestamp,
            isCurrentUser ? styles.sentTimestamp : styles.receivedTimestamp
          ]}>
            {moment(item.timestamp).format('h:mm A')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          {otherUserProfilePic ? (
            <View style={styles.profileImageWrapper}>
              <Image 
                source={{ uri: otherUserProfilePic }} 
                style={styles.profileImage}
                contentFit="cover"
              />
            </View>
          ) : (
            <View style={[styles.profileImageWrapper, { backgroundColor: Colors.LIGHT_BACKGROUND }]}>
              <Ionicons name="person" size={20} color={Colors.DARK_TEXT} />
            </View>
          )}
          <Text style={styles.headerTitle}>{userName}</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages.sort((a, b) => a.timestamp - b.timestamp)}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <Ionicons
              name="send"
              size={24}
              color={message.trim() === '' ? '#ccc' : Colors.PRIMARY}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.WHITE,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  profileImageWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    padding: 5,
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 24,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  messageContainer: {
    marginBottom: 15,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: Colors.PRIMARY,
    borderTopRightRadius: 4,
  },
  received: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.PRIMARY_LIGHT,
  },
  sentText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
  receivedText: {
    color: Colors.BLACK,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  sentTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  receivedTimestamp: {
    color: Colors.BLACK,
    textAlign: 'left',
  },
  senderName: {
    fontSize: 12,
    color: Colors.BLACK,
    marginBottom: 4,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.select({ ios: 25, android: 15 }),
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 25,
    fontSize: 16,
    color: Colors.GRAY,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default ChatBox;