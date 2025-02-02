import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors.ts';

// Latest Business
export const BusinessListItemSmall = ({ business }) => {
    return (
        <View style={styles.container}>
            <Image source={business?.images} style={styles.image} /> {/* No .url */}
            <View style={styles.infoContainer}>
                <Text style={{ fontSize: 17, fontFamily: 'outfit-medium' }}>{business?.name}</Text>
                <Text style={{ fontSize: 13, fontFamily: 'outfit', color: Colors.GRAY }}>
                    {business?.contactPerson}
                </Text>
                <Text style={styles.cateogryText}>
                    {business?.category}
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
    }
});
