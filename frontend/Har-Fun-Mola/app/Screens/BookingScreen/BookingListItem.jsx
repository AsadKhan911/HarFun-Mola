import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from 'expo-router';

const BookingListItem = ({ booking }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => Alert.alert("Booking selected:", booking?.service?.serviceName)}
        >
            <Image
                source={{ uri: booking?.service?.created_by?.profile?.profilePic }}
                style={styles.image}
            />

            <View style={styles.subContainer}>
                <Text style={{ fontFamily: 'outfit', color: Colors.GRAY, marginBottom:4 }}>{booking?.service?.created_by?.fullName}</Text>
                <Text style={{ fontFamily: 'outfit-bold', fontSize: 19, marginBottom:4 }}>{booking?.service?.serviceName}</Text>
                
                <Text style={{ fontFamily: 'outfit', color: Colors.GRAY, fontSize: 16, marginBottom:4 }}>
                    <FontAwesome6
                        name="location-dot"
                        size={20}
                        color={Colors.PRIMARY}
                        style={{ marginRight: 20 }}
                    />{" "}
                    {booking?.address}
                </Text>
                <View style={styles.roleBadgeContainer}>
                    <Text style={styles.roleBadge}>{booking?.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    subContainer: {
        flex: 1,
        marginLeft: 15,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    contactPerson: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        fontSize: 14,
    },
    serviceName: {
        fontFamily: 'outfit-bold',
        fontSize: 19,
        color: Colors.BLACK,
        marginVertical: 2,
    },
    price: {
        fontFamily: 'outfit-Medium',
        fontSize: 16,
        color: Colors.BLACK,
        marginVertical: 2,
    },
    location: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        fontSize: 14,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 10,
    },
    roleBadgeContainer: {
        backgroundColor: '#FFA726', // Light background for the badge
        borderRadius: 5,
        paddingHorizontal: 10, // Sufficient padding for text
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        alignSelf: 'flex-start', // Keeps it aligned to the content and parent
    },
    roleBadge: {
        fontSize: 14,
        color: Colors.WHITE, // Text color
        fontFamily: 'outfit-Medium',
        textAlign: 'center',
    },
    
});

export default BookingListItem;
