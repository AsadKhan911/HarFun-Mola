import express from 'express'
import { getListingsByIssue } from '../controllers/MinorProduct/getListingsForUser.js'
const router = express.Router()

router.route('/get-minor-listings').get( getListingsByIssue)

export default router