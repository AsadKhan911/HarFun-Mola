import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';


const StarterScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}> {/* Add a container style */}
            <Image
                source={require('../../../assets/images/login.png')}
                style={styles.imgStyle}
            />
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
        flex: 1, // Ensures it fills the entire screen
        backgroundColor: Colors.WHITE, // Set your desired background color
    },
    imgStyle: {
        width: 230,
        height: 450,
        marginTop: 70,
        borderWidth: 4,
        borderColor: Colors.BLACK,
        borderRadius: 20,
        alignSelf: 'center',
    },
    subContainer: {
        width: '100%',
        backgroundColor: Colors.PRIMARY,
        height: '70%',
        marginTop: -20,
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