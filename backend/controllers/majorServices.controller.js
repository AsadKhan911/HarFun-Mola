import mongoose from 'mongoose'
import { serviceListings } from '../models/MajorListings/servicesListings.js'
import { majorCategory } from '../models/MajorListings/category.js';
import { User } from '../models/User/user.js';

// Modify postListing function to handle file upload
// Modify postListing function to handle file upload
export const postListing = async (req, res) => {
    try {
        // Destructure the required fields from req.body
        const { serviceName, description, price, location, categoryId } = req.body;
        const userID = req.id;  // Assuming req.id is the authenticated user's ID
        console.log(userID)

        // Check for missing fields
        if (!serviceName || !description || !price || !location || !categoryId) {
            return res.status(400).json({
                message: "All fields are required, including categoryId.",
                success: false
            });
        }

        // Validate if the provided categoryId exists
        const category = await majorCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found.",
                success: false
            });
        }

        // If a file is uploaded, handle it
        let Listingpicture = "";  // Default to an empty string if no picture is uploaded
        if (req.file) {
            // Convert file to Data URI
            const fileUri = getDataUri(req.file);  // Get the Data URI

            // Upload the image to Cloudinary
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: 'majorserviceListings',  // Specify folder in Cloudinary
                resource_type: 'image'  // Specify resource type
            });

            // Get the secure URL for the uploaded image
            Listingpicture = cloudResponse.secure_url;
        }

        // Create a new service listing
        const listing = await serviceListings.create({
            serviceName,
            description,
            price,
            location,
            category: categoryId,  // Associate the listing with the category
            created_by: userID,
            Listingpicture  // Save the Cloudinary URL
        });

        return res.status(201).json({
            message: "New listing created successfully",
            listing,
            success: true
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getListingsByCategory = async (req, res) => {
    const { categoryId } = req.params; // Get category ID from request parameters
    const userID = req.id;

    try {
        // Check if the category exists
        const categoryExists = await majorCategory.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch listings for the specific category
        const listings = await serviceListings
            .find({ category: categoryId })
            .populate('category', 'name') // Populate category name
            .populate('created_by', 'fullName email') // Populate user details
            .exec();

        // Return the listings
        return res.status(200).json({ 
            message: 'Listings fetched successfully', 
            listings
        });
    } catch (error) {
        console.error('Error fetching listings by category:', error);
        return res.status(500).json({ 
            message: 'An error occurred while fetching listings', 
            error: error.message 
        });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const listings = await serviceListings.find({})
        if (!listings) {
            return res.status(404).json({
                message: "Listings not found",
                success: false
            })
        }
        return res.status(200).json({
            listings,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const getListingById = async (req, res) => {
    try {
        const listingId = req.params.id;

        // Validate if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({
                message: "Invalid Job ID format",
                success: false
            });
        }

        // Query the database to find the job by ID
        const listing = await serviceListings.findById(listingId);

        // If no job is found, return a 404 response
        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
                success: false
            });
        }

        // If job is found, return the job in the response
        return res.status(200).json({
            listing,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Controller to fetch listings by category
