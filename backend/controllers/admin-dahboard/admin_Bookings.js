import { Booking } from "../../models/MajorListings/booking.js";

// GET /admin/bookings
export const getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        // Apply status filter if provided
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .populate('user', 'fullName email phoneNumber')
            .populate({
                path: 'service',
                select: 'serviceName city',
                populate: { path: 'category', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ 
            message: 'Error retrieving bookings',
            error: error.message 
        });
    }
};

// GET /admin/bookings/:id
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'fullName email phoneNumber')
            .populate({
                path: 'service',
                populate: { path: 'category', select: 'name' }
            });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving booking', error });
    }
};

// PUT /admin/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Confirmed", "In-Progress", "Cancelled", "Completed"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error });
    }
};

// PUT /admin/bookings/:id
export const editBooking = async (req, res) => {
    try {
        const updates = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error });
    }
};

// DELETE /admin/bookings/:id
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
};

