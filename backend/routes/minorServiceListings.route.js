import express from 'express'
import { getListingsByIssue } from '../controllers/MinorProduct/getListingsForUser.js'
import { createBooking, getBookedTimeSlots } from '../controllers/MinorProduct/minorListings.controller.js'
const router = express.Router()

router.route('/get-minor-listings').get( getListingsByIssue)
router.route('/book-minor-listing').post(createBooking)
router.get("/:serviceListingId/:date", getBookedTimeSlots);

export default router