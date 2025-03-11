import { majorCategory } from '../models/MajorListings/category.js'

/*For now we are not implementing cloudinary , because for now we dont have admin panel who will add 
images dynamically. UPDATE IT FURTHER*/

export const addMajorCategories = async (req, res) => {
    try {
        const { name, icon, predefinedServices } = req.body;

        // Check if required fields are present
        if (!name || !icon || !predefinedServices || !Array.isArray(predefinedServices)) {
            return res.status(400).json({
                message: "Missing required fields or invalid predefinedServices format",
                success: false
            });
        }

        // Validate predefined services
        for (const service of predefinedServices) {
            if (!service.serviceName || !Array.isArray(service.pricingOptions)) {
                return res.status(400).json({
                    message: "Each service must have a serviceName and pricingOptions as an array",
                    success: false
                });
            }
        }

        // Create and store the new category
        const category = await majorCategory.create({
            name,
            icon,
            predefinedServices
        });

        return res.status(201).json({
            message: "New category added successfully",
            category,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getMajorCategories = async (req, res) => {
    try {
        const categories = await majorCategory.find({})
        if (!categories) {
            return res.status(404).json({
                message: "No category found",
                success: false
            })
        }
        return res.status(200).json({
            categories,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const updateMajorCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from request params
        const { serviceName, pricingOptions } = req.body; // Get new service data from request body

        // Validate input
        if (!serviceName || !Array.isArray(pricingOptions)) {
            return res.status(400).json({
                message: "Missing required fields or invalid pricingOptions format",
                success: false
            });
        }

        // Find and update the category by adding a new predefined service
        const updatedCategory = await majorCategory.findByIdAndUpdate(
            id,
            {
                $push: {
                    predefinedServices: { serviceName, pricingOptions }
                }
            },
            { new: true } // Return the updated document
        );

        // Check if category exists
        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Predefined service added successfully",
            category: updatedCategory,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
