import { Service } from "../../models/MinorListings/minorServices.js";


// Create a new service
export const addMinorServices = async (req, res) => {
  try {
    const { category, serviceName, serviceIcon, priceRange, description } = req.body;

    // Validate required fields
    if (!category || !serviceName || !priceRange?.minPrice || !priceRange?.maxPrice) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new service object (without predefined issues)
    const newService = new Service({
      category,
      serviceName,
      serviceIcon,
      priceRange,
      description
    });

    // Save to database
    const savedService = await newService.save();
    res.status(201).json({ message: "Service created successfully", service: savedService });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllMinorServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("category") // Populate category details
      .populate({
        path: "predefinedIssues",
        select: "issueName icon description" // Only fetch relevant fields
      });

    res.status(200).json({ success: true, data: services });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message
    });
  }
};

export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; 

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const services = await Service.find({ category: categoryId })
      .populate("predefinedIssues")
      .exec();

    if (!services.length) {
      return res.status(404).json({ message: "No services found for this category" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

