import express from 'express'

import { BookServiceListingByListingId , getAllBookings, 
    getServiceProviderBookings } from '../controllers/majorCategoryBooking.controller.js'

import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

//Add is authenticated after checking in route parameter
router.route('/get').get( isAuthenticated , getAllBookings)
router.route('/post/:serviceListingId').post(isAuthenticated , BookServiceListingByListingId)
router.route('/getproviderbookings').get(isAuthenticated , getServiceProviderBookings)

export default router


