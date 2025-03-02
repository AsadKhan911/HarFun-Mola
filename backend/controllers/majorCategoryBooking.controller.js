//UNDER WORK , BECUASE OF .populate() not fetching created_by and returning null instead.

import { Booking } from "../models/MajorListings/booking.js"; // Importing the Booking model
import { serviceListings } from "../models/MajorListings/servicesListings.js"; // Importing the serviceListings model
import { User } from "../models/User/user.js"; // Importing the User model
import { BookingAcceptedEmail } from '../middlewares/EmailFunctions/BookingAccepted.js'
import { BookingRejectedEmail } from '../middlewares/EmailFunctions/BookingAccepted.js'
import { sendBookingPendingEmail } from '../middlewares/EmailFunctions/MajorBookingCreate.js'
import { BookingInProgressEmail } from "../middlewares/EmailFunctions/BookingInProgress.js";
import { BookingCompletedEmail } from "../middlewares/EmailFunctions/BookingCompleted.js";

export const getAllBookings = async (req, res) => {
  const userId = req.id; // Assuming userId is passed as a URL parameter
  try {
    console.log("User ID:", userId); // Debugging
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "service", 
        select: "serviceName price created_by location", 
        populate: { 
          path: "created_by",
          select: "profile fullName firebaseUID" 
        },
      })
      .populate("user", "fullName email firebaseUID")
      .sort({ createdAt: -1 }); 

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

//Get all service provider bookings
export const getAllBookingsForServiceProvider = async (req, res) => {

  const serviceProviderId = req.id;
  try {

    // Step 1: Find all services (majorListings) created by the service provider
    const services = await serviceListings.find({ created_by: serviceProviderId }).select("_id");
    const serviceIds = services.map(service => service._id); // Extract service IDs

    // Step 2: Find bookings for those services
    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate({
        path: "service",
        select: "serviceName price location", 
      })
      .populate("user", "fullName email phoneNumber") // Populate the user who made the booking
      .sort({ createdAt: -1 }); // Sort by latest booking

    // If no bookings found
    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this service provider." });
    }

    // Return the bookings
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings for service provider:", error);
    res.status(500).json({ message: "An error occurred while fetching bookings.", error });
  }
};


// export const BookServiceListingByListingId = async (req, res) => {
//   try {
//     const { serviceListingId } = req.params;
//     const { date, timeSlot, address, latitude, longitude, instructions, userId, paymentMethod, paymentIntentId, paymentStatus } = req.body;

//     console.log("📥 Booking Request Received:", req.body);

//     if (!date || !timeSlot || !address || !latitude || !longitude || !userId || !paymentMethod) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const formattedDate = new Date(date).toISOString().split("T")[0];

//     const service = await serviceListings
//       .findById(serviceListingId)
//       .populate("category", "name")
//       .populate("created_by", "fullName email")
//       .exec();

//     if (!service) {
//       return res.status(404).json({ message: "Service listing not found" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newBooking = new Booking({
//       service: service._id,
//       user: user._id,
//       date: formattedDate,
//       timeSlot,
//       address,
//       latitude,
//       longitude,
//       instructions,
//       created_by: service?.created_by,
//       paymentMethod,
//       paymentIntentId: paymentMethod === "CARD" ? paymentIntentId : null,
//       paymentStatus: paymentMethod === "CARD" ? "Pending" : "Completed", // COD is auto "Completed"
//     });

//     await newBooking.save();

//     // Call the email function
//     await sendBookingPendingEmail(user, service, {
//       date: formattedDate,
//       timeSlot,
//       address,
//     });

//     res.status(201).json({
//       message: "Booking created successfully",
//       bookingDetails: {
//         serviceSelected: service.serviceName,
//         providerName: service.created_by?.fullName || "Unknown Provider",
//         providerPhone: service.created_by?.phoneNumber || "N/A",
//         providerEmail: service.created_by?.email || "N/A",
//         priceConfirmation: service.price,
//         date: newBooking.date,
//         timeSlot: newBooking.timeSlot,
//         address: newBooking.address,
//         latitude: newBooking.latitude,
//         longitude: newBooking.longitude,
//         userName: user.fullName,
//         userPhone: user.phoneNumber,
//         userEmail: user.email,
//         instructions: newBooking.instructions,
//         status: newBooking.status,
//         paymentMethod: newBooking.paymentMethod,
//         paymentStatus: newBooking.paymentStatus,
//         paymentIntentId: newBooking.paymentIntentId,
//       },
//     });

//   } catch (error) {
//     console.error("Error processing booking:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const BookServiceListingByListingId = async (req, res) => {
  try {
    const { serviceListingId } = req.params;
    const { date, timeSlot, address, latitude, longitude, instructions, userId, paymentMethod, paymentIntentId, paymentStatus, selectedPricingOption } = req.body;

    console.log("📥 Booking Request Received:", req.body);

    if (!date || !timeSlot || !address || !latitude || !longitude || !userId || !paymentMethod || !selectedPricingOption) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
      latitude,
      longitude,
      instructions,
      created_by: service?.created_by,
      paymentMethod,
      paymentIntentId: paymentMethod === "CARD" ? paymentIntentId : null,
      paymentStatus: paymentMethod === "CARD" ? "Pending" : "Completed", // COD is auto "Completed"
      selectedPricingOption, // Include the selected pricing option
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
        priceConfirmation: selectedPricingOption.price, // Use the selected pricing option's price
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        address: newBooking.address,
        latitude: newBooking.latitude,
        longitude: newBooking.longitude,
        userName: user.fullName,
        userPhone: user.phoneNumber,
        userEmail: user.email,
        instructions: newBooking.instructions,
        status: newBooking.status,
        paymentMethod: newBooking.paymentMethod,
        paymentStatus: newBooking.paymentStatus,
        paymentIntentId: newBooking.paymentIntentId,
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
          select: "fullName profile firebaseUID"
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
          select: "fullName profile firebaseUID",
        },
      })
      .populate("user", "fullName email phoneNumber area city profile firebaseUID role isEmailVerified reviews");

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
//   const { status, elapsedTime, completedTime } = req.body; // Accept elapsedTime and completedTime from frontend

//   try {
//     let updateData = { status, updatedAt: Date.now() };

//     if (status === "Confirmed") {
//       const orderNumber = `HFM-${Math.floor(1000 + Math.random() * 9000)}`;
//       updateData = { ...updateData, orderNumber };
//     }

//     if (status === "In-Progress") {
//       updateData = { ...updateData, startTime: new Date().toISOString() };
//     }

//     // When booking is completed, store completedTime and elapsedTime
//     if (status === "Completed" && completedTime) {
//       updateData = { ...updateData, completedTime, elapsedTime };
//     }

//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       updateData,
//       { new: true }
//     )
//       .populate({
//         path: "service",
//         populate: { path: "created_by", model: "user" } // Fetch service provider
//       })
//       .populate("user"); // Fetch user who booked the service

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found." });
//     }

//     const serviceUser = booking.user; // The user who booked the service
//     const serviceProvider = booking.service.created_by; // The service provider

//     // === Handle different booking statuses ===
//     if (status === "Confirmed") {
//       await BookingAcceptedEmail(serviceUser, serviceProvider, booking);
//     }

//     if (status === "Cancelled") {
//       await BookingRejectedEmail(serviceUser, serviceProvider, booking);
//     }

//     if (status === "In-Progress") {
//       await BookingInProgressEmail(serviceUser, serviceProvider, booking);
//     }

//     if (status === "Completed") {
//       await BookingCompletedEmail(serviceUser, serviceProvider, booking);

//       // === Check if the user already has a pending review for this booking ===
//       const user = await User.findById(serviceUser._id);
//       const existingBooking = user.pendingReviewBookings.find(
//         (b) => b.bookingId.toString() === booking._id.toString()
//       );

//       if (existingBooking) {
//         // If booking exists, update pendingReview to true
//         await User.findOneAndUpdate(
//           { _id: serviceUser._id, "pendingReviewBookings.bookingId": booking._id },
//           { $set: { "pendingReviewBookings.$.pendingReview": true } },
//           { new: true }
//         );
//         console.log(`Updated pendingReview to true for booking: ${booking._id}`);
//       } else {
//         // If no existing entry, add a new pending review entry
//         await User.findByIdAndUpdate(
//           serviceUser._id,
//           {
//             $push: {
//               pendingReviewBookings: {
//                 pendingReview: true,
//                 bookingId: booking._id,
//                 serviceProviderId: serviceProvider._id
//               }
//             }
//           },
//           { new: true }
//         );
//         console.log(`Added new pending review for booking: ${booking._id}`);
//       }
//     }

//     // Verify the update
//     const updatedUser = await User.findById(serviceUser._id);
//     console.log("Updated User Data:", JSON.stringify(updatedUser.pendingReviewBookings, null, 2));

    
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
  const { status, elapsedTime, completedTime } = req.body;

  try {
    let updateData = { status, updatedAt: Date.now() };

    if (status === "Confirmed") {
      const orderNumber = `HFM-${Math.floor(1000 + Math.random() * 9000)}`;
      updateData.orderNumber = orderNumber;
    }

    if (status === "In-Progress") {
      updateData.startTime = new Date().toISOString();
    }

    if (status === "Completed" && completedTime) {
      updateData.completedTime = completedTime;
      updateData.elapsedTime = elapsedTime;
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    )
      .populate({
        path: "service",
        populate: { path: "created_by", model: "user" }
      })
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const serviceUser = booking.user;
    const serviceProvider = booking.service.created_by;

    // === Handle different booking statuses ===
    if (status === "Confirmed") await BookingAcceptedEmail(serviceUser, serviceProvider, booking);
    if (status === "Cancelled") await BookingRejectedEmail(serviceUser, serviceProvider, booking);
    if (status === "In-Progress") await BookingInProgressEmail(serviceUser, serviceProvider, booking);
    if (status === "Completed") {
      await BookingCompletedEmail(serviceUser, serviceProvider, booking);

      // **Ensure pendingReview is updated correctly**
      await User.findByIdAndUpdate(
        serviceUser._id,
        {
          $pull: { pendingReviewBookings: { bookingId: booking._id } } // Remove existing entry if exists
        },
        { new: true }
      );

      await User.findByIdAndUpdate(
        serviceUser._id,
        {
          $push: {
            pendingReviewBookings: {
              pendingReview: true, // Ensure this is explicitly set
              bookingId: booking._id,
              serviceProviderId: serviceProvider._id
            }
          }
        },
        { new: true }
      );
    }

    const updatedUser = await User.findById(serviceUser._id);

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

export const submitReview = async (req, res) => {
  try {
    const { userToReviewId, bookingId, rating, comment } = req.body;
    console.log(userToReviewId, bookingId, rating, comment);

    // Find the user being reviewed
    const user = await User.findById(userToReviewId).populate(
      "reviews.userId",
      "fullName profile.profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Create a new review object
    const newReview = {
      userId: req.id, // ID of the user submitting the review
      rating,
      comment,
      createdAt: new Date(),
    };

    // Add the review to the user's reviews array
    user.reviews.push(newReview);

    // Recalculate the average rating
    const totalRatings = user.reviews.reduce((sum, review) => sum + review.rating, 0);
    user.averageRating = totalRatings / user.reviews.length;

    await user.save();

    //Set `pendingReview` to `false` in the service user's `pendingReviewBookings`
    const serviceUser = await User.findOneAndUpdate(
      { "pendingReviewBookings.bookingId": bookingId }, // Find the user who booked the service
      {
        $set: { "pendingReviewBookings.$.pendingReview": false }, // Update `pendingReview` to false
      },
      { new: true } // Return the updated document
    );

    if (!serviceUser) {
      return res.status(404).json({ message: "Service user not found", success: false });
    }

    // Populate updated user data before sending the response
    const updatedUser = await User.findById(userToReviewId).populate(
      "reviews.userId",
      "fullName profile.profilePic"
    );

    return res.status(200).json({
      message: "Review submitted successfully",
      success: true,
      user: updatedUser, // Send updated user data
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

