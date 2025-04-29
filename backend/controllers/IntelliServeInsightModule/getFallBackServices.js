import { serviceListings } from "../../models/MajorListings/servicesListings.js";

const toRadians = (degrees) => (degrees * Math.PI) / 180;

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

export const getFallbackServices = async (user) => {
    // Fetch available services in user's city, within 5 km
    const allCityServices = await serviceListings.find({
      city: new RegExp(user.city, 'i'),
      availability: true
    }).populate('created_by', 'fullName averageRating')
      .populate('category', 'name');
  
    const MAX_DISTANCE_KM = 1000;
  
    const nearbyServices = allCityServices.filter(service => {
      const distance = getDistanceInKm(
        user.latitude,
        user.longitude,
        service.latitude,
        service.longitude
      );
      return distance <= MAX_DISTANCE_KM;
    });
  
    // Optionally, limit to top-rated services
    return nearbyServices.slice(0, 10); // Limit to top 10 fallback services
  };
  