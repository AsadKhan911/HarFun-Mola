import { MinorCategory } from '../../models/MinorListings/minorCategories.js'

/*For now we are not implementing cloudinary , because for now we dont have admin panel who will add 
images dynamically. UPDATE IT FURTHER*/

export const addMinorCategories = async (req, res) => {
    try {
        const { name, icon } = req.body;

        // Check if required fields are present
        if (!name || !icon ) {
            return res.status(400).json({
                message: "Missing required fields or invalid predefinedServices format",
                success: false
            });
        }

        // Create and store the new category
        const category = await MinorCategory.create({
            name,
            icon,
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

export const getMinorCategories = async (req, res) => {
    try {
        const categories = await MinorCategory.find({})
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