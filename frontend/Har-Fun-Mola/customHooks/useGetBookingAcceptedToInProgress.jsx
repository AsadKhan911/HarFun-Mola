import { useState } from 'react';
import axios from 'axios';
import { BookingBaseUrl } from '../app/URL/userBaseUrl.js'; 
import { useDispatch } from 'react-redux';
import { setAllProviderBookings } from '../app/redux/bookingSlice.js'; // Adjust path as needed

const useGetBookingAcceptedToInProgress = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const updateBookingStatus = async (bookingId, statusText) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, { status: statusText });
      
      if (response.status === 200) {
        const bookingsResponse = await axios.get(`${BookingBaseUrl}/getproviderbookings`);
        dispatch(setAllProviderBookings(bookingsResponse.data.bookings));

        return { success: true, message: `Booking has been ${statusText.toLowerCase()}.` };
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      return { success: false, message: "Failed to update booking. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  return { updateBookingStatus, loading };
};

export default useGetBookingAcceptedToInProgress;
