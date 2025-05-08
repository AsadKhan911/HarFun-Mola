import { serviceListings } from "../../models/MajorListings/servicesListings.js";

// View all major service listings (with optional filters)
export const getAllMajorListings = async (req, res) => {
  try {
   
    const { city, category, availability, page = 1, limit = 10 } = req.query;

    const query = {};
    if (city) query.city = city;
    if (category) query.category = category;
    if (availability !== undefined) query.availability = availability === 'true';

    const listings = await serviceListings
      .find(query)
      .populate('category', 'name') // adjust if category has other name
      .populate('created_by', 'fullName email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await serviceListings.countDocuments(query);

    res.status(200).json({ total, listings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
};

// Edit a service listing
export const updateMajorListing = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Validate pricing options
      if (updatedData.pricingOptions) {
        const validPricingOptions = updatedData.pricingOptions.filter(
          option => option.label && !isNaN(option.price)
        );
        
        if (validPricingOptions.length === 0) {
          return res.status(400).json({ message: "At least one valid pricing option is required" });
        }
  
        updatedData.pricingOptions = validPricingOptions.map(option => ({
          label: option.label,
          price: Number(option.price)
        }));
      }
  
      const listing = await serviceListings.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
  
      if (!listing) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.status(200).json({ message: "Service updated", listing });
    } catch (error) {
      res.status(500).json({ message: "Error updating service", error });
    }
  };

// Remove (hard delete) a service listing
export const deleteMajorListing = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await serviceListings.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};

// Ban (soft delete) a service listing
export const banMajorListing = async (req, res) => {
  try {
    const { banId  } = req.params;

    const banned = await serviceListings.findByIdAndUpdate(
        banId,
      { availability: false },
      { new: true }
    );

    if (!banned) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service banned (availability set to false)", banned });
  } catch (error) {
    res.status(500).json({ message: "Error banning service", error });
  }
};
