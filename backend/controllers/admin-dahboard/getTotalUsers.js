

import { Booking } from "../../models/MajorListings/booking.js";
import {User } from '../../models/User/user.js'
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Aggregate user roles
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize stats
    const stats = {
      totalUsers: 0,
      totalServiceProviders: 0,
      activeBookings: 0,
      totalEarnings: 0,
    };

    // Map roles
    roleCounts.forEach(item => {
      if (item._id === "Service User") {
        stats.totalUsers = item.count;
      } else if (item._id === "Service Provider") {
        stats.totalServiceProviders = item.count;
      }
    });

    // Count active bookings where status is "In-Progress"
    stats.activeBookings = await Booking.countDocuments({
      status: { $regex: /^In-Progress$/i }
    });    

    // Sum up earnings from completed bookings
    const earningsResult = await Booking.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$selectedPricingOption.price" } } }
    ]);
    
    
    stats.totalEarnings = earningsResult[0]?.total || 0;

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
