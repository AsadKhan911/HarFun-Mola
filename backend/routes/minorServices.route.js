import express from 'express'
const router = express.Router()

import { addMinorServices, getAllMinorServices, getServicesByCategory } from '../controllers/MinorProduct/minorServices.controller.js'
import { addPredefinedIssue, getAllPredefinedIssues } from '../controllers/MinorProduct/minorIssues.controller.js'
import { createMinorServiceListing } from '../controllers/MinorProduct/minorListings.controller.js'

router.route('/post-minor-service').post( addMinorServices)
router.route('/get-minor-service').get(getAllMinorServices)
router.route('/get-minor-service-by-category/:categoryId').get(getServicesByCategory);
router.route('/post-minor-issues').post(addPredefinedIssue)
router.route('/get-minor-issues').get(getAllPredefinedIssues)
router.route('/submit-minor-listing').post(createMinorServiceListing)

export default router

