import express from 'express'
const router = express.Router()

import { addMinorCategories, getMinorCategories } from '../controllers/MinorProduct/minorCategory.controller.js'

router.route('/postcategory').post( addMinorCategories)
router.route('/getcategory').get(getMinorCategories)

export default router

