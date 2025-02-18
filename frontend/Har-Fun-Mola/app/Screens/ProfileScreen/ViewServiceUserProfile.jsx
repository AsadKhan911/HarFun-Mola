import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../../constants/Colors.ts';
import useFetchUserData from '../../../customHooks/Universal/getOppositeUserData.jsx';  // Import the custom hook

const ViewServiceUserProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { serviceUser } = route.params;
    const userId = serviceUser?._id; // Extract userId from serviceUser

    const { userData, loading, error } = useFetchUserData(userId);  // Call the hook with userId

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    const reviews = userData?.reviews || [];
    const emailBadgeText = userData?.isEmailVerified ? 'Email Verified' : 'Email Not Verified';

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.LIGHT_GRAY }}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Client Profile</Text>
            </View>

            {/* User Profile Info */}
            <View style={styles.card}>
                <View style={styles.innerContainer}>
                    <Image source={{ uri: userData?.profile?.profilePic }} style={styles.imgStyle} />
                    <Text style={styles.userName}>{userData?.fullName}</Text>
                    <Text style={styles.email}>{userData?.email}</Text>
                    <View style={styles.badgeContainer}>
                        <Ionicons
                            name={userData?.isEmailVerified ? 'checkmark-circle' : 'close-circle'}
                            size={18}
                            color={userData?.isEmailVerified ? 'green' : 'red'}
                        />
                        <Text style={[styles.badgeText, { color: userData?.isEmailVerified ? 'green' : 'red' }]}>{emailBadgeText}</Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person" size={20} color={Colors.PRIMARY} />
                        <Text style={styles.infoText}>{userData?.role}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="call" size={20} color={Colors.PRIMARY} />
                        <Text style={styles.infoText}>{userData?.phoneNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={20} color={Colors.PRIMARY} />
                        <Text style={styles.infoText}>{userData?.area}, {userData?.city}</Text>
                    </View>
                </View>
            </View>

            {/* Reviews Section */}
            <Text style={styles.reviewsHeader}>Reviews</Text>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
                {reviews.length === 0 ? (
                    <Text style={{ color: Colors.GRAY_TEXT, textAlign: "center" }}>No Reviews Yet</Text>
                ) : (
                    reviews.map((review) => (
                        <View key={review._id} style={styles.reviewCard}>
                            <Image
                                source={{ uri: review.userId?.profile?.profilePic || "https://via.placeholder.com/150" }}
                                style={styles.reviewPhoto}
                            />
                            <Text style={styles.reviewName}>{review.userId?.fullName || "Anonymous"}</Text>
                            <Text style={styles.reviewDescription}>{review.comment}</Text>
                            <View style={styles.starsContainer}>
                                {[...Array(5)].map((_, index) => (
                                    <Ionicons
                                        key={index}
                                        name={index < review.rating ? 'star' : 'star-outline'}
                                        size={16}
                                        color={Colors.PRIMARY}
                                    />
                                ))}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </ScrollView>
    );
};

export default ViewServiceUserProfile;

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.LIGHT_GRAY,
    },
    headerContainer: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 35,
        zIndex: 1,
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        textAlign: 'center',
    },
    card: {
        margin: 20,
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
    },
    innerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    userName: {
        fontSize: 22,
        fontFamily: 'outfit-bold',
        color: Colors.DARK_TEXT,
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        fontFamily: 'outfit-Medium',
        color: Colors.GRAY_TEXT,
        textAlign: 'center',
        marginBottom: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    badgeText: {
        marginLeft: 5,
        fontFamily: 'outfit-Medium',
        fontSize: 14,
    },
    infoContainer: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'outfit',
        color: Colors.DARK_TEXT,
    },
    reviewsHeader: {
        fontSize: 22,
        fontFamily: 'outfit-bold',
        color: Colors.DARK_TEXT,
        margin: 18,
    },
    reviewsScroll: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 20,
        marginLeft: 22
    },
    reviewCard: {
        width: 250,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        marginRight: 15,
    },
    reviewPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    reviewName: {
        fontSize: 16,
        fontFamily: 'outfit-bold',
        color: Colors.DARK_TEXT,
        marginBottom: 5,
    },
    reviewDescription: {
        fontSize: 14,
        fontFamily: 'outfit',
        color: Colors.GRAY_TEXT,
        textAlign: 'center',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    loader: {
        flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20
    },
    errorText: {
        color: "red", textAlign: "center", fontSize: 16, marginTop: 20
    },
});
