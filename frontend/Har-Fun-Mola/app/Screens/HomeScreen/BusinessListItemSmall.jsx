import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Colors from '../../../constants/Colors.ts';

// Latest Business Item
export const BusinessListItemSmall = ({ business }) => {
    return (
        <View style={styles.container}>
            {/* If image exists, show it; otherwise show a placeholder */}
            <Image
                source={business?.Listingpicture || require('../../../assets/images/abd.jpg')}
                style={styles.image}
            />

            <View style={styles.infoContainer}>
                <Text style={{ fontSize: 17, fontFamily: 'outfit-medium' }}>
                    {business?.serviceName || 'Unnamed Service'}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'outfit', color: Colors.GRAY }}>
                    {business?.created_by?.fullName || 'Unknown Provider'}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'outfit', color: Colors.GRAY }}>
                    {business?.location
                        ? business.location.replace(/,/g, '').split(' ').slice(0, 3).join(' ')
                        : 'Unknown Provider'}
                </Text>

                <Text style={styles.cateogryText}>
                    {business?.category?.name || 'General'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
    },
    infoContainer: {
        padding: 7,
        display: 'flex',
        gap: 3,
    },
    image: {
        width: 190,
        height: 130,
        borderRadius: 10,
    },
    cateogryText: {
        fontSize: 10,
        fontFamily: 'outfit',
        padding: 3,
        color: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY_LIGHT,
        borderRadius: 5,
        alignSelf: 'flex-start',
        paddingHorizontal: 5,
    },
});
