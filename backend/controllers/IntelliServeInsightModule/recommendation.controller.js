import { User } from "../../models/User/user.js";
import { Booking } from "../../models/MajorListings/booking.js";
import { getNearbyServices } from "./recommendationService.js";
import { getFallbackServices } from "./getFallBackServices.js";

// Controller to get personalized recommendations for a user
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch user past bookings
    const bookings = await Booking.find({ user: userId, status: "Completed" })
      .populate("service")
      .populate("service.category");  // Populate category field inside service

    const bookedCategories = bookings.map((booking) => booking.service.category);
    
    let recommendedServices;

    if (bookedCategories.length > 0) {
      // Case 1: User has past bookings → personalize
      recommendedServices = await getNearbyServices(user, bookedCategories);
    } else {
      // Case 2: No past bookings → show fallback
      recommendedServices = await getFallbackServices(user);
    }

    // Sort services by provider ratings
    recommendedServices.sort((a, b) => b.created_by.averageRating - a.created_by.averageRating);

    // Return the recommendations
    res.status(200).json({ recommendedServices });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};
