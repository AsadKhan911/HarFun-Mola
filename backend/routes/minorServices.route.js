import express from 'express'
const router = express.Router()

import { addMinorServices, getAllMinorServices } from '../controllers/MinorProduct/minorServices.controller.js'
import { addPredefinedIssue, getAllPredefinedIssues } from '../controllers/MinorProduct/minorIssues.controller.js'

router.route('/post-minor-service').post( addMinorServices)
router.route('/get-minor-service').get(getAllMinorServices)
router.route('/post-minor-issues').post(addPredefinedIssue)
router.route('/get-minor-issues').get(getAllPredefinedIssues)

export default router

