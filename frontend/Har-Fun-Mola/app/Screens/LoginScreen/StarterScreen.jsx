import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {Image} from 'expo-image'
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';


const StarterScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <View style={styles.imageWrapper}> {/* Wrap the image to control its position */}
            <Image
                source={require('../../../assets/images/login.png')}
                style={styles.imgStyle}
            />
        </View>
        <View style={styles.subContainer}>
            <Text style={{ fontSize: 27, color: Colors.WHITE, textAlign: 'center' }}>
                Let's Find
                <Text style={{ fontWeight: 'bold' }}> Professional Cleaning and Repairing </Text>
                Services
            </Text>
            <Text style={{ fontSize: 17, color: Colors.WHITE, textAlign: 'center', marginTop: 15 }}>
                Best app to find services near you which deliver you a Professional service
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.replace('Login')}
            >
                <Text style={{ textAlign: 'center', fontSize: 17, color: Colors.PRIMARY }}>
                    Let's Get Started
                </Text>
            </TouchableOpacity>
        </View>
    </View>
    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.WHITE,
        alignItems: 'center', 
    },
    imageWrapper: {
        marginTop: 110, // Moves the image down without affecting the entire screen
        marginBottom:-20
    },
    imgStyle: {
        width: 230,
        height: 450,
        borderWidth: 4,
        borderColor: Colors.BLACK,
        borderRadius: 20,
        marginTop:60,
        alignSelf: 'center',
    },
    subContainer: {
        width: '100%',
        backgroundColor: Colors.PRIMARY,
        height: '70%',
        marginTop: 16,  // Keeps the subContainer where you want
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 20,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 99,
        marginTop: 30,
    },
});


export default StarterScreen;