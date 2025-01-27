import { majorCategory } from '../models/MajorListings/category.js'

/*For now we are not implementing cloudinary , because for now we dont have admin panel who will add 
images dynamically. UPDATE IT FURTHER*/

export const addMajorCategories = async (req, res) => {
    try {
        const { name , icon } = req.body;
        if (!name || !icon) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const category = await majorCategory.create({
            name,
            icon,
        });

        return res.status(201).json({
            message: "New category added successfully",
            category,
            success: true
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

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