import cloudinary from '../../utils/cloudinary.js';
import { getDataUri } from '../../utils/dataURI.js';
import {Bid} from '../../models/BiddingModule/bidModel.js';

import fs from 'fs'; // File system module (useful for handling file buffers)

export const createBid = async (req, res) => {
    try {
        const { serviceType, description, budget } = req.body;
        const customerId = req.id;

        if (!req.images || req.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        // Process images in batches to avoid memory issues
        const batchSize = 2;
        let uploadedImageUrls = [];

        for (let i = 0; i < req.images.length; i += batchSize) {
            const batch = req.images.slice(i, i + batchSize);
            const uploadPromises = batch.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'HFM/bidImages' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    
                    // Convert buffer to stream
                    const bufferStream = new Readable();
                    bufferStream.push(file.buffer);
                    bufferStream.push(null);
                    bufferStream.pipe(stream);
                });
            });

            const batchResults = await Promise.all(uploadPromises);
            uploadedImageUrls.push(...batchResults);
        }

        const bid = await Bid.create({
            customerId,
            serviceType,
            description,
            budget,
            images: uploadedImageUrls,
        });

        return res.status(201).json({
            success: true,
            message: "Bid created successfully",
            bid,
        });

    } catch (error) {
        console.error("Bid creation error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create bid",
        });
    }
};

// Get all bids for a customer
export const getBidsByCustomer = async (req, res) => {
    try {
        const customerId = req.user.id;

        const bids = await Bid.find({ customerId });

        if (!bids.length) {
            return res.status(404).json({
                message: "No bids found",
                success: false
            });
        }

        return res.status(200).json({
            bids,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Get a single bid by ID
export const getBidById = async (req, res) => {
    try {
        const { bidId } = req.params;

        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
                success: false
            });
        }

        return res.status(200).json({
            bid,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Edit an existing bid
export const editBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const { serviceType, description, images, budget, status } = req.body;
        const customerId = req.user.id;

        const updatedBid = await Bid.findOneAndUpdate(
            { _id: bidId, customerId }, 
            { serviceType, description, images, budget, status },
            { new: true }
        );

        if (!updatedBid) {
            return res.status(404).json({
                message: "Bid not found or unauthorized",
                success: false
            });
        }

        return res.status(200).json({
            updatedBid,
            success: true,
            message: "Bid updated successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Delete a bid
export const deleteBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const customerId = req.user.id;

        const deletedBid = await Bid.findOneAndDelete({ _id: bidId, customerId });

        if (!deletedBid) {
            return res.status(404).json({
                message: "Bid not found or unauthorized",
                success: false
            });
        }

        return res.status(200).json({
            message: "Bid deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
