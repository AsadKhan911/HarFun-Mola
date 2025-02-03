import express from 'express'

import { BookServiceListingByListingId , getAllBookings, getBookedSlots, 
    getServiceProviderBookings } from '../controllers/majorCategoryBooking.controller.js'

import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

//Add is authenticated after checking in route parameter
router.route('/get').get( isAuthenticated , getAllBookings)
router.route('/post/:serviceListingId').post(isAuthenticated , BookServiceListingByListingId)
router.route('/getproviderbookings').get(isAuthenticated , getServiceProviderBookings)
router.route('/bookings/:serviceId/:date').get(isAuthenticated , getBookedSlots)

export default router


