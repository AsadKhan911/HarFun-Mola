import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "../../../redux/biddingSlice.js";
import { BiddingModelBaseUrl } from "../../../URL/userBaseUrl";
import Colors from "../../../../constants/Colors";
import moment from "moment";

const { width: screenWidth } = Dimensions.get('window');

const RecentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentJobImages, setCurrentJobImages] = useState([]);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.bidding?.savedJobs || {});
  const user = useSelector((state) => state.auth?.user);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BiddingModelBaseUrl}/get-bid`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async (job) => {
    if (!user?._id) {
      Alert.alert("Login Required", "Please log in to save jobs.");
      return;
    }

    try {
      const response = await axios.post(`${BiddingModelBaseUrl}/saved-jobs`, {
        userId: user._id,
        jobId: job._id,
      });

      if (response.status === 201) {
        dispatch(toggleSaveJob(job));
      }
    } catch (error) {
      if (error.response?.status === 400) {
        Alert.alert("Already Saved", "This job is already saved.");
      } else {
        Alert.alert("Error", "Failed to save job. Try again later.");
      }
    }
  };

  const openImageModal = (images, index = 0) => {
    if (!images || images.length === 0) return;
    
    setCurrentJobImages(images);
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderImageThumbnails = (images) => {
    if (!images || images.length === 0) {
      return (
        <View style={styles.noImagesContainer}>
          <MaterialIcons name="image-not-supported" size={24} color="#95a5a6" />
          <Text style={styles.noImagesText}>No images available</Text>
        </View>
      );
    }

    const displayedImages = images.slice(0, 4);
    const remainingCount = images.length - displayedImages.length;

    return (
      <View style={styles.imagesContainer}>
        {displayedImages.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => openImageModal(images, index)}
            activeOpacity={0.8}
          >
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: image }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              {index === 3 && remainingCount > 0 && (
                <View style={styles.remainingCountOverlay}>
                  <Text style={styles.remainingCountText}>+{remainingCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isSaved = !!savedJobs[item._id];
    const postedDate = moment(item.createdAt).fromNow();

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("job-details", { job: item })}
        style={styles.jobItem}
      >
        <View style={styles.jobHeader}>
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="work" size={24} color="#fff" />
          </View>
          
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>{item.serviceType}</Text>
            <Text style={styles.jobClient}>{item.customerId?.fullName || "Unknown Client"}</Text>
            <Text style={styles.jobMeta}>
              <Text style={styles.jobRating}>4.9 ★</Text> • {postedDate}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => handleSaveJob(item)}
            style={styles.saveButton}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? Colors.PRIMARY : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.jobDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {renderImageThumbnails(item.images)}

        <View style={styles.jobFooter}>
          <View style={styles.skillPill}>
            <Text style={styles.skillText}>{item.serviceType}</Text>
          </View>
          <Text style={styles.jobPrice}>₨{item.budget}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Jobs</Text>
      
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image 
              source={require('../../../../assets/images/jobs.png')} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No recent jobs available</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchJobs();
        }}
      />

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContent}>
            <ScrollView 
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setSelectedImageIndex(index);
              }}
            >
              {currentJobImages.map((image, index) => (
                <View key={index} style={styles.fullImageContainer}>
                  <Image 
                    source={{ uri: image }} 
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.imagePagination}>
              {currentJobImages.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.paginationDot,
                    index === selectedImageIndex && styles.activeDot
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  jobItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  jobClient: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  jobMeta: {
    fontSize: 12,
    color: '#95a5a6',
  },
  jobRating: {
    color: Colors.PRIMARY,
  },
  saveButton: {
    padding: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillPill: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: Colors.PRIMARY,
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ecc71',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  // Image gallery styles
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 8,
  },
  imageWrapper: {
    width: (screenWidth - 32 - 24) / 4, // 32 padding, 24 gap
    height: (screenWidth - 32 - 24) / 4,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  remainingCountOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  noImagesText: {
    marginLeft: 8,
    color: '#95a5a6',
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  fullImageContainer: {
    width: screenWidth,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  imagePagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default RecentJobs;