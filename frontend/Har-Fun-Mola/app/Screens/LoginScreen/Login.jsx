import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userBaseUrl } from '../../URL/userBaseUrl.js'
import { useDispatch, useSelector } from "react-redux"
import { setUser } from '../../redux/authSlice.js'

const Login = () => {

  const navigation = useNavigation();
  // const [loading,setLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Service User'); // Default role
  const [loading, setLoading] = useState(false);

  
  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Email Missing", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Password Missing", "Please enter your password.");
      return;
    }
    if (!role) {
      Alert.alert("Role Missing", "Please select your role.");
      return;
    }

    try {
      setLoading(true)
      const data = { email, password, role }; //"email" : email , "password" : password
      const response = await axios.post(`${userBaseUrl}/login`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {   //response.data.success
        Alert.alert("Logged in successful")
        dispatch(setUser(response.data.user)) // Corrected line
        const { token } = response.data;

        // Store JWT token in AsyncStorage
        await AsyncStorage.setItem('jwt_token', token);

        //  Configure Axios Interceptor to include token
        /*After the login, for every other API request (like fetching user data, updating the profile, etc.),
         the token is automatically included in the request headers */
        axios.interceptors.request.use(
          async (config) => {
            const storedToken = await AsyncStorage.getItem('jwt_token');
            if (storedToken) {
              config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );
  
        navigation.replace('home-tab'); //navigate to home.
        // navigation.navigate(HomeNavigation , { screen: 'home-screen' });

      }

      else {
        Alert.alert("Login error", "We are facing some issue for log you in.");
      }
    } catch (error) {
      // console.error("Login error:", error);
      Alert.alert("Login Failed", "Incorrect email, password or role.");
    } finally {
      setLoading(false)
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logohmtr.png')}
            style={styles.logo}
          />
        </View>

        {/* Welcome Section */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Sign in to schedule, track, and manage home services.</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#aaa"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Role Radio Buttons */}
          <View style={styles.radioButtons}>
            <Text style={styles.inputLabel}>Role</Text>
            {/* Service User */}
            <TouchableOpacity
              style={[styles.radioButton, role === 'Service User' && styles.selectedRadioButton]}
              onPress={() => setRole('Service User')}
            >
              <Text style={[styles.radioButtonText, role === 'Service User' && styles.selectedText]}>
                Service User
              </Text>
            </TouchableOpacity>

            {/* Service Provider */}
            <TouchableOpacity
              style={[styles.radioButton, role === 'Service Provider' && styles.selectedRadioButton]}
              onPress={() => setRole('Service Provider')}
            >
              <Text style={[styles.radioButtonText, role === 'Service Provider' && styles.selectedText]}>
                Service Provider
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginText}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <Text style={styles.orText}>Or authorize with</Text>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png',
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Signup')}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.WHITE,
      alignItems: 'center',
      padding: 20,
    },
    logoContainer: {
      marginTop: 20, // Reduced top margin to move the logo closer to the top
      marginBottom: 10, // Reduced bottom margin to save space
      alignItems: 'center', // Center the logo horizontally
    },
    logo: {
      width: 200, // Adjusted size for better fit
      height: 200,
      marginBottom:-50,
      resizeMode: 'contain', // Ensures the image scales proportionally
    },
    title: {
      fontSize: 22,
      fontFamily: 'outfit-Bold',
      color: '#000',
      textAlign: 'center',
      marginTop: 10, // Added some space between the logo and title
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'outfit',
      textAlign: 'center',
      marginVertical: 10,
      marginBottom: 20, // Reduced margin to save space
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginVertical: 8, // Reduced vertical spacing
      fontSize: 16,
    },
    passwordContainer: {
      position: 'relative',
    },
    radioButtons: {
      marginTop: 15, // Reduced spacing
      width: '100%',
      alignItems: 'flex-start',
    },
    inputLabel: {
      fontSize: 18,
      color: '#444',
      marginBottom: 5,
      fontFamily: 'outfit-Bold',
      marginLeft: 2,
    },
    radioButton: {
      paddingVertical: 10, // Reduced padding
      paddingHorizontal: 20,
      marginVertical: 5, // Reduced spacing
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      width: '100%',
    },
    selectedRadioButton: {
      backgroundColor: Colors.PRIMARY_LIGHT,
    },
    radioButtonText: {
      fontSize: 16,
      color: '#000',
    },
    selectedText: {
      color: 'black',
    },
    loginButton: {
      backgroundColor: Colors.PRIMARY,
      paddingVertical: 10, // Reduced padding
      width: '100%',
      borderRadius: 10,
      marginTop: 10,
    },
    loginText: {
      color: Colors.WHITE,
      textAlign: 'center',
      fontFamily: 'outfit-Bold',
      fontSize: 16,
    },
    orText: {
      color: '#888',
      marginVertical: 15, // Reduced margin
      fontFamily: 'outfit',
    },
    socialContainer: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 20, // Reduced bottom margin
    },
    socialButton: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      justifyContent: 'center', 
      borderRadius: 10,
      paddingVertical: 10, // Reduced padding
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      flex: 1,
      marginHorizontal: 5,
    },
    socialIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    socialText: {
      color: '#000',
      fontSize: 15,
    },
    forgotPassword: {
      color: '#444',
      textDecorationLine: 'underline',
      fontFamily: 'outfit',
      marginVertical: 5, // Reduced margin
    },
    signupText: {
      color: '#444',
      marginTop: 5,
      fontFamily: 'outfit',
    },
    signupLink: {
      color: '#000',
      fontFamily: 'outfit-Bold',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: 10, // Reduced bottom padding
    },
  });

export default Login;