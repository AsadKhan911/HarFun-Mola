import express from 'express'

import { BookServiceListingByListingId , getAllBookings, getAllBookingsForServiceProvider, getBookedSlots, 
    getBooking, 
    getServiceProviderBookings, 
    submitReview, 
    updateBookingStatus} from '../controllers/majorCategoryBooking.controller.js'

import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

//Add is authenticated after checking in route parameter
router.route('/get').get( isAuthenticated , getAllBookings)
router.route('/getserviceprovider').get( isAuthenticated , getAllBookingsForServiceProvider)
router.route('/post/:serviceListingId').post(isAuthenticated , BookServiceListingByListingId)
router.route('/getproviderbookings').get(isAuthenticated , getServiceProviderBookings)
router.route('/bookings/:serviceId/:date').get(isAuthenticated , getBookedSlots)
router.route('/updateBooking/:bookingId').patch(isAuthenticated, updateBookingStatus);
router.route('/getBooking/:bookingId').get(isAuthenticated, getBooking);
router.route('/submitreview').post(isAuthenticated, submitReview);

export default router


