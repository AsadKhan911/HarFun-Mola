import { Booking } from "../../models/MajorListings/booking.js";

export const getBookingsAnalyticsByCategory = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'Completed' })
      .populate({
        path: 'service',
        select: 'category',
        populate: {
          path: 'category',
          select: 'name', // assuming your category model has 'title' field like 'Cleaning'
        },
      });

    const categoryCountMap = {};

    bookings.forEach((booking) => {
      const categoryTitle = booking?.service?.category?.name || 'Unknown';

      if (!categoryCountMap[categoryTitle]) {
        categoryCountMap[categoryTitle] = 0;
      }

      categoryCountMap[categoryTitle]++;
    });

    const labels = Object.keys(categoryCountMap);
    const counts = Object.values(categoryCountMap);

    return res.status(200).json({ labels, counts });
  } catch (error) {
    console.error('Error fetching bookings by category:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
