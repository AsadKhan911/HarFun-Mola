import { Booking } from "../../models/MajorListings/booking.js";

export const getActiveBookings = async (req, res) => {
  try {
    const activeBookings = await Booking.find({ status: "In-Progress" })
      .populate("user", "name email") // Optional: populate user details
      .populate("service", "title category"); // Optional: populate service details

    res.status(200).json({
      success: true,
      count: activeBookings.length,
      bookings: activeBookings,
    });
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching active bookings",
    });
  }
};
