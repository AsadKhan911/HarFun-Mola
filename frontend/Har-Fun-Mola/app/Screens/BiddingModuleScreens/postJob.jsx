import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, ScrollView, Text } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { BiddingModelBaseUrl } from '../../URL/userBaseUrl';
import { useSelector } from 'react-redux';

const PostJob = () => {
    const { control, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const { manipulateAsync, SaveFormat } = ImageManipulator;
    const { token } = useSelector((store) => store.auth.user)


    // Optimized compression function
    // const compressImage = async (imageUri) => {
    //     try {
    //         const manipResult = await ImageManipulator.manipulate(
    //             imageUri,
    //             [{ resize: { width: 640, height: 480 } }],  // Resize to desired dimensions
    //             {
    //                 format: ImageManipulator.SaveFormat.JPEG,  // Use the correct format enum
    //                 compress: 0.7,  // Apply compression, where 0 is maximum compression and 1 is the best quality
    //             }
    //         );
    //         return manipResult.uri;  // Return the URI of the compressed image
    //     } catch (error) {
    //         console.error("Compression error:", error);
    //         Alert.alert("Notice", "Image couldn't be optimized. Using original version.");
    //         return imageUri;  // Fallback to the original image URI
    //     }
    // };

    // const pickImages = async () => {
    //     // Request permissions
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== 'granted') {
    //         Alert.alert('Permission required', 'Please enable photo access in settings');
    //         return;
    //     }

    //     // Select images
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ['images'],
    //         allowsEditing: false,
    //         allowsMultipleSelection: true,
    //         selectionLimit: 5,
    //         quality: 0.8, // Initial quality reduction
    //     });

    //     if (!result.canceled) {
    //         setLoading(true);
    //         try {
    //             // Process images with progress feedback
    //             const processedImages = [];
    //             for (const asset of result.assets) {
    //                 const compressed = await compressImage(asset.uri);
    //                 processedImages.push(compressed);
    //             }
    //             setImages(processedImages);
    //         } catch (error) {
    //             Alert.alert("Error", "Failed to process images");
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(`${BiddingModelBaseUrl}/post-bid`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            Alert.alert("Success", "Job posted successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Title style={styles.title}>Create a Job</Title>

                <Controller
                    control={control}
                    name="serviceType"
                    rules={{ required: 'Service type is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Service Type"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    rules={{ required: 'Description is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Job Description"
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="budget"
                    rules={{ required: 'Budget is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                            label="Budget ($)"
                            mode="outlined"
                            keyboardType="numeric"
                            value={value}
                            onChangeText={onChange}
                            error={!!error}
                            style={styles.input}
                        />
                    )}
                />

                {/* <Button
                    icon="image"
                    mode="outlined"
                    onPress={() => pickImages(setImages)}
                    style={{ marginVertical: 10 }}
                >
                    Select Images
                </Button> */}

                {/* <ScrollView horizontal style={{ marginVertical: 10 }}>
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img }}
                            style={{ width: 80, height: 80, borderRadius: 8, marginRight: 10 }}
                        />
                    ))}
                </ScrollView> */}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Job"}
                </Button>
            </Card>
        </ScrollView>
    );
};

export default PostJob;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 20,
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
    },
});
