import { BookingBaseUrl } from "@/app/URL/userBaseUrl.js"
import { setAllBookings } from "../app/redux/bookingSlice.js"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetUserBooking = ({ selectedTab }) => {

    const { allBookings } = useSelector((store) => store.bookings);
    const { token } = useSelector((store) => store.auth.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                dispatch(setAllBookings([]));
                console.log("test")
                const res = await axios.get(`${BookingBaseUrl}/get`, { withCredentials: true } , {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      }
                });
                if (res.data.success) {
                    dispatch(setAllBookings(res.data.bookings));
                }
                
            } catch (error) {
                console.log("Error fetching Bookings:", error);
            }
        };
        fetchAllBookings();
    }, [dispatch , selectedTab]); 
    
}

export default useGetUserBooking
