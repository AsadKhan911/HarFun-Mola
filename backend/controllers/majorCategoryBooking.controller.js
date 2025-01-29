//UNDER WORK , BECUASE OF .populate() not fetching created_by and returning null instead.

import { Booking } from "../models/MajorListings/booking.js"; // Importing the Booking model
import { serviceListings } from "../models/MajorListings/servicesListings.js"; // Importing the serviceListings model
import { User } from "../models/User/user.js"; // Importing the User model

export const getAllBookings = async (req, res) => {
  const userId = req.id; // Assuming userId is passed as a URL parameter
  
  try {
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "service", // Populates the `service` field in Booking
        select: "serviceName price created_by location", // Include these fields from `majorListing`
        populate: { // Nested population for `created_by`
          path: "created_by",
          select: "profile fullName" // The field in `majorListing` referencing `user`
        },
      })
      .populate("user", "fullName email") // Populates the `user` field in Booking
      .sort({ createdAt: -1 }); // Sort by latest booking

    // If no bookings found
    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "An error occurred while fetching bookings.", error });
  }
};


export const BookServiceListingByListingId = async (req, res) => {
    try {
        const { serviceListingId } = req.params; // Service listing ID from the URL parameter
        const { date, timeSlot, address, instructions, userId } = req.body; // Request body data

        // Fetch the service listing from the database and populate the provider's data
        const service = await serviceListings
            .findById(serviceListingId).populate('category', 'name').populate('created_by', 'fullName email').exec();

        // console.log("Service:", service);
        // console.log("Created By:", service?.created_by?.fullName);

        if (!service) {
            return res.status(404).json({ message: "Service listing not found" });
        }

        // Fetch the user making the booking
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new booking record
        const newBooking = new Booking({
            service: service._id,
            user: user._id,
            date,
            timeSlot,
            address,
            instructions,
            created_by:service?.created_by
        });

        // Save the new booking
        await newBooking.save();

        // Respond with the booking details, including provider info populated from the service listing
        res.status(201).json({
            message: "Booking created successfully",
            bookingDetails: {
              serviceSelected: service.serviceName,
              providerName: service.created_by?.fullName || "Unknown Provider",
              providerPhone: service.created_by?.phoneNumber || "N/A",
              providerEmail: service.created_by?.email || "N/A",
              priceConfirmation: service.price,
              date: newBooking.date,
              timeSlot: newBooking.timeSlot,
              address: newBooking.address,
              userName: user.fullName,
              userPhone: user.phoneNumber,
              userEmail: user.email,
              instructions: newBooking.instructions,
              status: newBooking.status,
            }          
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}