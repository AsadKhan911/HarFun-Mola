import mongoose from 'mongoose'
import { serviceListings } from '../models/MajorListings/servicesListings.js'
import { majorCategory } from '../models/MajorListings/category.js';
import { User } from '../models/User/user.js';
import cloudinary from '../utils/cloudinary.js';
import { getDataUri } from '../utils/dataURI.js';
import axios from 'axios'

axios.defaults.timeout = 120000;

// Modify postListing function to handle file upload

// export const postListing = async (req, res) => {
//     try {
//         // Destructure the required fields from req.body
//         const { serviceName, description, pricingOptions, city, location, categoryId, unavailableDates, timeSlots } = req.body;
//         const userID = req.id;

//         // Check for missing fields
//         if (!serviceName || !description || !pricingOptions  || !city || !location || !categoryId || !timeSlots) {
//             return res.status(400).json({
//                 message: "All fields are required, including categoryId and timeSlots.",
//                 success: false
//             });
//         }

//         let listingPicture = null;
//         let file = req.file;

//          if (file) {
//                     try {
//                         const fileUri = getDataUri(file);
//                         const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
//                             folder: 'HFM/majorListingPictures',
//                         });
//                         listingPicture = cloudResponse.secure_url;
//                     } catch (error) {
//                         console.error('Error uploading listing picture to Cloudinary:', error);
//                         listingPicture = null;
//                     }
//                 }
        

//         // Validate if the provided categoryId exists
//         const category = await majorCategory.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({
//                 message: "Category not found.",
//                 success: false
//             });
//         }

//          // Validate Pricing Options
//          if (!Array.isArray(pricingOptions) || pricingOptions.length === 0) {
//             return res.status(400).json({ message: "At least one pricing option is required.", success: false });
//         }

//         // Create a new service listing
//         const listing = await serviceListings.create({
//             serviceName,
//             description,
//             pricingOptions,
//             city,
//             location,
//             category: categoryId,  // Associate the listing with the category
//             created_by: userID,
//             unavailableDates,  // Save the unavailable dates
//             timeSlots,  // Save the available time slots
//             Listingpicture: listingPicture  // Add logic for image upload if needed
//         });

//         return res.status(201).json({
//             message: "New listing created successfully",
//             listing,
//             success: true
//         });
//     } catch (error) {
//         console.error("Error creating listing:", error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

export const postListing = async (req, res) => {
    try {
        // Destructure the required fields from req.body
        const { 
            serviceName, 
            description, 
            pricingOptions, 
            city, 
            location, 
            latitude,
            longitude,
            categoryId, 
            unavailableDates, 
            timeSlots 
        } = req.body;
        
        const userID = req.id;

        // Check for missing fields (add latitude and longitude validation)
        if (!serviceName || !description || !pricingOptions || !city || !location || 
            !latitude || !longitude || !categoryId || !timeSlots) {
            return res.status(400).json({
                message: "All fields are required, including location coordinates.",
                success: false
            });
        }

        // Validate coordinates are numbers
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                message: "Invalid latitude or longitude values.",
                success: false
            });
        }

        let listingPicture = null;
        let file = req.file;

        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: 'HFM/majorListingPictures',
                });
                listingPicture = cloudResponse.secure_url;
            } catch (error) {
                console.error('Error uploading listing picture to Cloudinary:', error);
                listingPicture = null;
            }
        }

        // Validate if the provided categoryId exists
        const category = await majorCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found.",
                success: false
            });
        }

        // Validate Pricing Options
        if (!Array.isArray(pricingOptions) || pricingOptions.length === 0) {
            return res.status(400).json({ 
                message: "At least one pricing option is required.", 
                success: false 
            });
        }

        // Create a new service listing with coordinates
        const listing = await serviceListings.create({
            serviceName,
            description,
            pricingOptions,
            city,
            location,
            latitude: parseFloat(latitude), // Ensure it's stored as a number
            longitude: parseFloat(longitude), // Ensure it's stored as a number
            category: categoryId,
            created_by: userID,
            unavailableDates,
            timeSlots,
            Listingpicture: listingPicture
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
            .populate('category', 'name predefinedServices') // Populate category name and predefined services
            .populate('created_by', 'fullName email profile') // Populate user details
            .exec();

        // Return the listings and predefined services
        return res.status(200).json({ 
            message: 'Listings fetched successfully', 
            listings,
            predefinedServices: categoryExists.predefinedServices
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
