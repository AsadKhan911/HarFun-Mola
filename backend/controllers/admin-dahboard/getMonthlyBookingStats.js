import { Booking } from "../../models/MajorListings/booking.js";

export const getMonthlyBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $match: { status: "Completed" } // Only completed bookings
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalBookings: { $sum: 1 },
          totalEarnings: { $sum: "$selectedPricingOption.price" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" }
            ]
          },
          totalBookings: 1,
          totalEarnings: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
