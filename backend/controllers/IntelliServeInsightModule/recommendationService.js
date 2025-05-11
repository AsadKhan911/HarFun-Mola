import { serviceListings } from '../../models/MajorListings/servicesListings.js'

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Haversine formula to calculate distance between 2 coordinates
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearbyServices = async (user, bookedCategories) => {
  // 1. Fetch all available services in the same city
  const allCityServices = await serviceListings.find({
    city: new RegExp(user.city, 'i'),
    availability: true
  }).populate('created_by', 'fullName averageRating').populate('category', 'name');

  // 2. Filter by distance (e.g., within 5 km radius)
  const MAX_DISTANCE_KM = 5;

  const nearbyServices = allCityServices.filter(service => {
    const distance = getDistanceInKm(
      user.latitude,
      user.longitude,
      service.latitude,
      service.longitude
    );
    return distance <= MAX_DISTANCE_KM;
  });
  

  // 3. Filter by booked categories
  const bookedCategoryIds = bookedCategories.map(cat => String(cat._id));

  const filteredServices = nearbyServices.filter(service =>
    bookedCategoryIds.includes(String(service.category._id))
  );
  

  return filteredServices;
};