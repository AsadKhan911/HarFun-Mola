import express from 'express'
const router = express.Router()

import { addMajorCategories, getMajorCategories, updateMajorCategory } from '../controllers/majorCategory.controller.js'

router.route('/postcategory').post( addMajorCategories)
router.route('/getcategory').get(getMajorCategories)
router.route('/updatecategory/:id').post(updateMajorCategory)

export default router

