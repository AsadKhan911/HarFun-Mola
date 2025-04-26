import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import axios from 'axios';
import Colors from '../../../constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { AssistiveFixBaseUrl } from '../../URL/userBaseUrl';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChatPopup = ({ visible, onClose, iconPosition }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(visible ? 0 : 100))[0];
    const opacityAnim = useState(new Animated.Value(visible ? 1 : 0))[0];

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setIsKeyboardVisible(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
                setIsKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: visible ? 0 : 100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: visible ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [visible]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');

        try {
            const res = await axios.post(`${AssistiveFixBaseUrl}/chat`, {
                messages: updatedMessages,
            });

            let assistantMessage = { role: 'assistant', content: res.data.reply };
            
            // Assuming the assistant replies with a specific service name, suggest providers
            if (res.data.reply.toLowerCase().includes("fan motor repair")) {
                // Call your backend to fetch providers
                const providerRes = await axios.get(`${AssistiveFixBaseUrl}/providers?service=fan_motor_repair`);
                const providers = providerRes.data.providers;

                assistantMessage.content = `
                    We suggest these providers for Fan Motor Repair:
                    ${providers.map(provider => provider.name).join(', ')}
                `;
            }
            
            setMessages([...updatedMessages, assistantMessage]);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const calculateChatBoxBottom = () => {
        if (isKeyboardVisible) {
            return Math.max(SCREEN_HEIGHT - keyboardHeight - 450); // Ensure a minimum distance from the bottom
        }
        return iconPosition ? SCREEN_HEIGHT - iconPosition.y + 10 : 80;
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    style={[ 
                        styles.chatBox, 
                        {
                            bottom: calculateChatBoxBottom(),
                            transform: [{ translateY: slideAnim }],
                            opacity: opacityAnim,
                        }
                    ]}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                    >
                        {/* Title Section */}
                        <View style={styles.chatTitleContainer}>
                            <Text style={styles.chatTitle}>How can I help you?</Text>
                        </View>

                        <FlatList
                            data={messages}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item }) => (
                                <View style={item.role === 'user' ? styles.userMsg : styles.botMsg}>
                                    <Text style={styles.messageText}>{item.content}</Text>
                                </View>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Type your message..."
                                placeholderTextColor="#888"
                            />
                            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                                <Text style={styles.sendBtnText}>➤</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                    {!isKeyboardVisible && (
                        <View
                            style={[
                                styles.arrow,
                                {
                                    left: iconPosition ? iconPosition.x - 70 : SCREEN_WIDTH / 2 - 20,
                                    bottom: -10,
                                }
                            ]}
                        />
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

const App = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [iconPosition, setIconPosition] = useState(null);

    const handleIconPress = () => {
        const fixedX = SCREEN_WIDTH - 20 - 30;
        const fixedY = Dimensions.get('window').height - 20 - 30;

        setIconPosition({ x: fixedX, y: fixedY });
        setChatVisible(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.chatIcon} onPress={handleIconPress}>
                <Ionicons name="chatbubble-ellipses" size={30} color='white' />
            </TouchableOpacity>

            <ChatPopup
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
                iconPosition={iconPosition}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chatTitleContainer: {
        marginBottom: 15,  // Add space between the title and the messages
        alignItems: 'center',
    },
    chatTitle: {
        fontSize: 24,
        fontFamily: 'outfit-Bold',
        color: Colors.PRIMARY,  // Set the title color to match your theme
        textAlign: 'center',
        marginTop: -20,  // Adjusting the title's position if needed
        borderBottomWidth: 2,  // Thickness of the bottom border
        borderBottomColor: Colors.PRIMARY,  // Set the bottom border color to match your theme
        paddingBottom: 8,  // Add some space between the text and border
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#6A0DAD',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    chatIconText: {
        fontSize: 30,
        color: '#A78BFA',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    chatBox: {
        position: 'absolute',
        backgroundColor: '#fff',
        height: '60%',
        marginBottom: 112,
        width: SCREEN_WIDTH - 60,
        alignSelf: 'flex-end',
        borderRadius: 24,
        padding: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
        position: 'absolute',
    },
    userMsg: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.PRIMARY,
        padding: 12,
        marginVertical: 6,
        borderRadius: 16,
        maxWidth: '80%',
    },
    botMsg: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.GRAY,
        color: Colors.BLACK,
        padding: 12,
        marginVertical: 6,
        borderRadius: 16,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: Colors.WHITE,
        fontWeight: '400',
        lineHeight: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#F2F2F7',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 8,
    },
    sendBtn: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnText: {
        fontSize: 20,
        color: '#fff',
    },
    closeBtn: {
        position: 'absolute',
        top: 5,
        right: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtnText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default App;
