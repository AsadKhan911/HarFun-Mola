// useGetFetchBookingDetails.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Alert } from "react-native";
import { setSingleBooking } from "../app/redux/bookingSlice";
import { BookingBaseUrl } from "../app/URL/userBaseUrl";

const useGetFetchBookingDetails = (bookingId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${BookingBaseUrl}/getBooking/${bookingId}`);
        dispatch(setSingleBooking(response.data.booking)); // Dispatch the booking data to Redux
      } catch (error) {
        console.error("Error fetching booking details:", error);
        Alert.alert("Error", "Failed to fetch booking details. Please try again.");
      }
    };

    fetchBookingDetails();
  }, [bookingId, dispatch]);
};

export default useGetFetchBookingDetails;