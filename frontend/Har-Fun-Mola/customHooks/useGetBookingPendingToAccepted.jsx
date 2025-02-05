// useBookingActions.js
import { useState } from "react";
import axios from "axios";
import { BookingBaseUrl } from "../app/URL/userBaseUrl.js";
import { useDispatch } from "react-redux";
import { setAllProviderBookings } from "../app/redux/bookingSlice.js";

export const useGetUpdateBookingStatus = (bookingId) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleAction = async (status) => {
        const statusText = status === "Reject" ? "Cancelled" : "Confirmed";

        try {
            setLoading(true);
            const response = await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, { status: statusText });
            if (response.status === 200) {
                // Refetch the bookings list after updating the status
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

    return { handleAction, loading };
};