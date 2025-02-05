import { useState } from "react";
import axios from "axios";
import { BookingBaseUrl } from "../../app/URL/userBaseUrl.js";
import { useDispatch, useSelector } from "react-redux";
import { setAllBookings } from "../../app/redux/bookingSlice.js";

 const useGetCancelOrder = (bookingId) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const allBookings = useSelector(state => state.bookings.allBookings); // Get current bookings from Redux

    const handleAction = async (status) => {
        const statusText = status === "Reject" ? "Cancelled" : "Confirmed";

        try {
            setLoading(true);
            const response = await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, { status: statusText });

            if (response.status === 200) {
                // Remove the canceled booking from the state immediately
                const updatedBookings = allBookings.filter(booking => booking._id !== bookingId);
                dispatch(setAllBookings(updatedBookings));

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

export default useGetCancelOrder;