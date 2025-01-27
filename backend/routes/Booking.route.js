import express from 'express'
import { BookServiceListingByListingId } from '../controllers/majorCategoryBooking.controller.js'

const router = express.Router()

//Add is authenticated after checking in route parameter
router.route('/post/:serviceListingId').post(BookServiceListingByListingId)

export default router


