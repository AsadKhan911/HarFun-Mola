import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllMinorListingsByCategory } from "../../redux/listingsSlice";
import { MinorServicesBaseUrl } from "../../URL/userBaseUrl";
import Colors from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const ServiceListScreen = ({ route }) => {
    const { categoryId, categoryName } = route.params;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { minorListingsByCategory } = useSelector((state) => state.listing);
    const [dataUpdated, setDataUpdated] = useState(false);

    const navigation = useNavigation()

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            dispatch(setAllMinorListingsByCategory([]));
    
            try {
                const response = await axios.get(
                    `${MinorServicesBaseUrl}/get-minor-service-by-category/${categoryId}`
                );
    
                const services = response.data?.services || [];
    
                dispatch(setAllMinorListingsByCategory(services));
            } catch (error) {
                console.log("Error fetching services:", error);
                dispatch(setAllMinorListingsByCategory([]));
            } finally {
                setLoading(false);
                setDataUpdated((prev) => !prev);
            }
        };
    
        fetchServices();
    }, [categoryId, dispatch]);
    

    const renderService = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.push('minor-issues-list', {
                predefinedIssues: item?.predefinedIssues,
                serviceName: item?.serviceName,
                serviceId: item?._id,  // Add serviceId
                categoryId: categoryId  // Pass the categoryId from route.params
            })}
            activeOpacity={0.7}
        >
            <Image source={item.serviceIcon} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text style={styles.serviceDescription}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.rootContainer}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back-outline" size={30} color="black" />
                    <Text style={styles.categoryName}>{categoryName}</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator color={Colors.PRIMARY} size="large" style={styles.loader} />
                ) : minorListingsByCategory.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No Services Available Right Now!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={minorListingsByCategory}
                        extraData={dataUpdated}
                        keyExtractor={(item) => item._id}
                        renderItem={renderService}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.LIGHT_GRAY, // Set background color for the root view
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        marginTop: 60
    },
    backButton: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 25,
        fontFamily: 'outfit-medium',
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        paddingVertical: 15,
        marginTop: 10
    },
    card: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        flexDirection: "row", // Align items horizontally
        alignItems: "center", // Center items vertically
    },
    image: {
        width: 80, // Smaller image width
        height: 80, // Smaller image height
        borderRadius: 10,
        marginRight: 10, // Add space between image and text
    },
    textContainer: {
        flex: 1, // Take up remaining space
        justifyContent: "center", // Center text vertically
    },
    serviceName: {
        fontSize: 20,
        fontFamily: "outfit-Bold",
        marginBottom: 5, // Add space between name and description
    },
    serviceDescription: {
        fontSize: 13,
        fontFamily: "outfit-medium",
        color: Colors.GRAY,
        marginBottom: 4
    },
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    noDataText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.GRAY,
        textAlign: "center",
        marginTop: 10,
    },
});

export default ServiceListScreen;