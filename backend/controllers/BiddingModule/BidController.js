import { Bid } from "../../models/BiddingModule/bidModel";

// Create or post a new bid
export const createBid = async (req, res) => {
    try {
        const { serviceType, description, images, budget } = req.body;
        const customerId = req.user.id; // Assuming authenticated user

        const bid = await Bid.create({
            customerId,
            serviceType,
            description,
            images,
            budget
        });

        return res.status(201).json({
            bid,
            success: true,
            message: "Bid created successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
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
