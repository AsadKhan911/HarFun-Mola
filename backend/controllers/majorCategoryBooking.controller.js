//UNDER WORK , BECUASE OF .populate() not fetching created_by and returning null instead.

import { Booking } from "../models/MajorListings/booking.js"; // Importing the Booking model
import { serviceListings } from "../models/MajorListings/servicesListings.js"; // Importing the serviceListings model
import { User } from "../models/User/user.js"; // Importing the User model
import { BookingAcceptedEmail } from '../middlewares/EmailFunctions/BookingAccepted.js'
import { BookingRejectedEmail } from '../middlewares/EmailFunctions/BookingAccepted.js'
import { sendBookingPendingEmail } from '../middlewares/EmailFunctions/MajorBookingCreate.js'

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
      const { serviceListingId } = req.params;
      const { date, timeSlot, address, instructions, userId } = req.body;

      const formattedDate = new Date(date).toISOString().split("T")[0];

      const service = await serviceListings
          .findById(serviceListingId)
          .populate("category", "name")
          .populate("created_by", "fullName email")
          .exec();

      if (!service) {
          return res.status(404).json({ message: "Service listing not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const newBooking = new Booking({
          service: service._id,
          user: user._id,
          date: formattedDate,
          timeSlot,
          address,
          instructions,
          created_by: service?.created_by,
      });

      await newBooking.save();

      // Call the email function
      await sendBookingPendingEmail(user, service, {
          date: formattedDate,
          timeSlot,
          address,
      });

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
          },
      });

  } catch (error) {
      console.error("Error processing booking:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

//SERVICE PROVIDER CONTROLLERS

export const getServiceProviderBookings = async (req, res) => {
  const providerId = req.id;

  try {
    // Find all services posted by this provider
    const providerServices = await serviceListings.find({ created_by: providerId }).select("_id serviceName");

    if (!providerServices.length) {
      return res.status(404).json({ message: "No services found for this provider." });
    }

    // Get all bookings for these services
    const bookings = await Booking.find({ service: { $in: providerServices.map(service => service._id) } })
      .populate({
        path: "service",
        select: "serviceName location price", // Service details like name, location, price
        populate: {
          path: "created_by", // Populate the provider who posted the service
          select: "fullName profile"
        },
      })
      .populate({
        path: "user", // Customer details who made the booking
        select: "fullName email city area phoneNumber"
      })
      .sort({ createdAt: -1 }); // Sort by the most recent booking first

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for your services." });
    }

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings for provider:", error);
    res.status(500).json({ message: "An error occurred while fetching bookings for your services.", error });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.params;

    // Ensure we are comparing only the date (ignoring time)
    const formattedDate = new Date(date).toISOString().split("T")[0];

    console.log("Service ID:", serviceId); // Debugging
    console.log("Formatted Date for Query:", formattedDate); // Debugging

    const bookings = await Booking.find({
      service: serviceId, // Use `service` instead of `serviceId`
      date: formattedDate, // Compare only the date part
    });

    console.log("Fetched Bookings:", bookings); // Debugging

    const bookedSlots = bookings.map(booking => booking.timeSlot); // Ensure this is an array of strings
    res.status(200).json({ bookedSlots });

    console.log("Final Booked Slots:", bookedSlots); // Debugging

  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// controllers/bookingController.js

export const getBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "service",
        select: "serviceName price created_by location",
        populate: {
          path: "created_by",
          select: "fullName profile",
        },
      })
      .populate("user", "fullName email phoneNumber area city profile");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "An error occurred while fetching booking details.", error });
  }
};


// export const updateBookingStatus = async (req, res) => {
//   const { bookingId } = req.params;
//   const { status } = req.body;

//   try {
//     let updateData = { status, updatedAt: Date.now() };



//     // If the booking status is being updated to "Confirmed" (Accepted), generate an order number
//     if (status === "Confirmed") {
//        // Random order number
//        const orderNumber = `HFM-${Math.floor(1000 + Math.random() * 9000)}`; // HFM-xxxx format
//       // Random order number
//       updateData = { ...updateData, orderNumber }; // Add the order number to the update data
//     }

//     // Find and update the booking, populating necessary fields
//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       updateData,
//       { new: true }
//     )
//     .populate({
//       path: "service",
//       populate: { path: "created_by", model: "user" } // Fetch the provider inside service using `created_by`
//     })
//     .populate("user"); // Fetch the user who made the booking

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found." });
//     }

//     // Extract user and provider details
//     const serviceUser = booking.user;  // The user who booked the service
//     const serviceProvider = booking.service.created_by;  // The provider of the service (using `created_by`)

//     // Send email notifications if booking is confirmed
//     if (status === "Confirmed") {
//       await BookingAcceptedEmail(serviceUser, serviceProvider, booking);
//     }

//     if (status === "Cancelled") {
//       await BookingRejectedEmail(serviceUser, serviceProvider, booking);
//     }

//     res.status(200).json({
//       success: true,
//       message: `Booking status updated to ${status}.`,
//       booking,
//     });
//   } catch (error) {
//     console.error("Error updating booking status:", error);
//     res.status(500).json({ message: "An error occurred while updating the booking status.", error });
//   }
// };

export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    let updateData = { status, updatedAt: Date.now() };

    // If the booking status is being updated to "Confirmed" (Accepted), generate an order number
    if (status === "Confirmed") {
      const orderNumber = `HFM-${Math.floor(1000 + Math.random() * 9000)}`; // HFM-xxxx format
      updateData = { ...updateData, orderNumber }; // Add the order number to the update data
    }

    // If the booking status is being updated to "In-Progress", set the startTime
    if (status === "In-Progress") {
      updateData = { ...updateData, startTime: Date.now() };
    }

    // Find and update the booking, populating necessary fields
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    )
    .populate({
      path: "service",
      populate: { path: "created_by", model: "user" } // Fetch the provider inside service using `created_by`
    })
    .populate("user"); // Fetch the user who made the booking

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Extract user and provider details
    const serviceUser = booking.user;  // The user who booked the service
    const serviceProvider = booking.service.created_by;  // The provider of the service (using `created_by`)

    // Send email notifications if booking is confirmed
    if (status === "Confirmed") {
      await BookingAcceptedEmail(serviceUser, serviceProvider, booking);
    }

    if (status === "Cancelled") {
      await BookingRejectedEmail(serviceUser, serviceProvider, booking);
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "An error occurred while updating the booking status.", error });
  }
};