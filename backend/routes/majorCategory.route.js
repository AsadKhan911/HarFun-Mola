import express from 'express'
const router = express.Router()

import { addMajorCategories, getMajorCategories } from '../controllers/majorCategory.controller.js'

router.route('/postcategory').post( addMajorCategories)
router.route('/getcategory').get(getMajorCategories)

export default router

